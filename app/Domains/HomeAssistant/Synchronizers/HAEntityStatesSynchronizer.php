<?php

namespace App\Domains\HomeAssistant\Synchronizers;

use App\Domains\HomeAssistant\Events\HAWSEntityStateChanged;
use App\Domains\HomeAssistant\HAWSClient;
use App\Domains\HomeAssistant\Messages\HAEventWSMessage;

final class HAEntityStatesSynchronizer
{
    public function __construct(
        private HAWSClient $client,
    ) {}

    public function sync(?HAEventWSMessage $eventMessage = null): void
    {
        $newStates = [];

        if ($eventMessage === null) {
            $states = $this->client->request([
                'type' => 'get_states',
            ]);

            if (! is_array($states)) {
                throw new \RuntimeException('Home Assistant states response is invalid');
            }

            $newStates = $states;
        } else {
            $newStates[] = $eventMessage->data['new_state'];
        }

        if (count($newStates) === 0) {
            return;
        }

        HAWSEntityStateChanged::dispatch($newStates);
    }
}
