<?php

namespace App\Domains\HomeAssistant;

use Amp\Cancellation;
use Amp\Websocket\Client\WebsocketConnection;
use Amp\Websocket\Client\WebsocketHandshake;
use App\Domains\HomeAssistant\Messages\HAAuthOKWSMessage;
use App\Domains\HomeAssistant\Messages\HAAuthRequiredWSMessage;
use App\Domains\HomeAssistant\Messages\HAEventWSMessage;
use App\Domains\HomeAssistant\Messages\HAResultWSMessage;
use App\Domains\HomeAssistant\Messages\HAWSMessage;
use App\Domains\HomeAssistant\Messages\HAWSMessageFactory;
use RuntimeException;

use function Amp\Websocket\Client\connect as ampConnect;

final class HAWSClient
{
    private int $messageId = 0;

    private WebsocketConnection $connection;

    private mixed $eventHandler = null;

    public function __construct(
        private readonly HAWSMessageFactory $factory,
    ) {}

    private function baseUrl(): string
    {
        return config('homeassistant.scheme').'://'.config('homeassistant.url').'/api/websocket';
    }

    public function start(?Cancellation $cancellation = null): void
    {
        $this->connect($cancellation);

        $this->authenticate($cancellation);

    }

    public function receive(?Cancellation $cancellation = null): HAWSMessage
    {
        $payload = $this->receiveRaw($cancellation);

        return $this->factory->create($payload);
    }

    public function request(array $payload, ?Cancellation $cancellation = null): mixed
    {
        $messageId = $this->sendCommand($payload);

        while ($message = $this->receive($cancellation)) {
            if ($message instanceof HAResultWSMessage && $message->id === $messageId) {
                if (! $message->success) {
                    throw new RuntimeException(
                        'Home Assistant request failed: '.json_encode($message->error, JSON_THROW_ON_ERROR)
                    );
                }

                return $message->result;
            }

            if ($message instanceof HAEventWSMessage) {
                $this->dispatchEvent($message);

                continue;
            }
        }

        throw new RuntimeException('Home Assistant closed websocket connection before request completed');
    }

    public function requestOnce(array $payload, ?Cancellation $cancellation = null): mixed
    {
        $this->start();
        $result = $this->request($payload, $cancellation);
        $this->close();

        return $result;
    }

    public function callService(
        string $domain,
        string $service,
        ?array $serviceData = null,
        ?array $target = null,
        ?Cancellation $cancellation = null,
    ) {
        $payload = [
            'type' => 'call_service',
            'domain' => $domain,
            'service' => $service,
        ];

        if ($serviceData !== null) {
            $payload['service_data'] = $serviceData;
        }

        if ($target !== null) {
            $payload['target'] = $target;
        }

        return $this->requestOnce($payload, $cancellation);
    }

    public function listen(callable $handler, ?Cancellation $cancellation = null): void
    {
        $this->eventHandler = $handler;

        while ($message = $this->receive($cancellation)) {
            match (true) {
                $message instanceof HAEventWSMessage => $this->dispatchEvent($message),
                default => null,
            };
        }
    }

    public function close(): void
    {
        if (isset($this->connection) && ! $this->connection->isClosed()) {
            $this->connection->close();
        }
    }

    private function connect(?Cancellation $cancellation = null): void
    {
        $handshake = new WebsocketHandshake($this->baseUrl());
        $this->connection = ampConnect($handshake, $cancellation);

        $message = $this->receive($cancellation);

        if (! $message instanceof HAAuthRequiredWSMessage) {
            throw new RuntimeException(
                'Expected auth_required message'
            );
        }
    }

    private function authenticate(?Cancellation $cancellation = null): void
    {
        $this->send([
            'type' => 'auth',
            'access_token' => config('homeassistant.token'),
        ]);

        $response = $this->receive($cancellation);

        if (($response instanceof HAAuthOKWSMessage) === false) {
            throw new RuntimeException(
                'Home Assistant authentication failed'
            );
        }
    }

    public function subscribeEvents(?Cancellation $cancellation = null): void
    {
        $messageId = $this->sendCommand([
            'type' => 'subscribe_events',
        ]);

        $response = $this->receive($cancellation);

        if (! $response instanceof HAResultWSMessage || $response->id !== $messageId || ! $response->success) {
            throw new RuntimeException(
                'Unable to subscribe to Home Assistant events'
            );
        }
    }

    private function send(array $payload): void
    {
        $this->connection->sendText(
            json_encode(
                $payload,
                JSON_THROW_ON_ERROR
            ),
        );
    }

    private function sendCommand(array $payload): int
    {
        $messageId = $this->nextMessageId();

        $this->send([...$payload, 'id' => $messageId]);

        return $messageId;
    }

    private function nextMessageId(): int
    {
        return ++$this->messageId;
    }

    private function receiveRaw(?Cancellation $cancellation = null): array
    {
        $message = $this->connection->receive($cancellation);

        if ($message === null) {
            throw new RuntimeException('Home Assistant closed websocket connection');
        }

        $content = $message->buffer();

        return json_decode(
            $content,
            true,
            flags: JSON_THROW_ON_ERROR,
        );
    }

    private function dispatchEvent(HAEventWSMessage $message): void
    {
        if ($this->eventHandler === null) {
            return;
        }

        ($this->eventHandler)($message);
    }
}
