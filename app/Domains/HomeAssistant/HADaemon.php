<?php

namespace App\Domains\HomeAssistant;

use Amp\Cancellation;
use Amp\CancelledException;
use Amp\SignalCancellation;
use App\Domains\HomeAssistant\Messages\HAEventWSMessage;
use App\Domains\HomeAssistant\Synchronizers\HAAreasSynchronizer;
use App\Domains\HomeAssistant\Synchronizers\HADevicesSynchronizer;
use App\Domains\HomeAssistant\Synchronizers\HAEntitiesSynchronizer;
use App\Domains\HomeAssistant\Synchronizers\HAEntityStatesSynchronizer;

use function Amp\async;

final class HADaemon
{
    /**
     * @var array<string, bool>
     */
    private array $registrySyncsInProgress = [];

    public function __construct(
        private readonly HAWSClient $client,
        private readonly HAAreasSynchronizer $areasSynchronizer,
        private readonly HADevicesSynchronizer $devicesSynchronizer,
        private readonly HAEntitiesSynchronizer $entitiesSynchronizer,
        private readonly HAEntityStatesSynchronizer $entityStatesSynchronizer,
    ) {}

    public function run(): void
    {
        $cancellation = new SignalCancellation([SIGINT, SIGTERM]);

        $future = async(fn () => $this->listen($cancellation))
            ->catch(function (\Throwable $e) {
                if ($e instanceof CancelledException) {
                    logger()->info('Home Assistant daemon shutting down');

                    return;
                }

                logger()->error('Error in Home Assistant daemon', ['exception' => $e]);
            });

        $future->await();

        $this->client->close();
    }

    private function listen(Cancellation $cancellation): void
    {
        $this->client->start($cancellation);
        $this->client->subscribeEvents($cancellation);
        $this->syncRegistries();
        $this->client->listen(fn (HAEventWSMessage $event) => $this->handleEvent($event), $cancellation);
    }

    private function handleEvent(HAEventWSMessage $event): void
    {
        match ($event->eventType) {
            'state_changed' => $this->syncRegistry('entity_states', fn () => $this->entityStatesSynchronizer->sync($event)),
            'area_registry_updated' => $this->syncRegistry('areas', fn () => $this->areasSynchronizer->sync()),
            'device_registry_updated' => $this->syncRegistry('devices', fn () => $this->devicesSynchronizer->sync()),
            'entity_registry_updated' => $this->syncRegistry('entities', fn () => $this->entitiesSynchronizer->sync()),
            default => null,
        };
    }

    private function syncRegistries(): void
    {
        logger()->info('Synchronizing Home Assistant registries');

        $this->syncRegistry('areas', fn () => $this->areasSynchronizer->sync());
        $this->syncRegistry('devices', fn () => $this->devicesSynchronizer->sync());
        $this->syncRegistry('entities', fn () => $this->entitiesSynchronizer->sync());
        $this->syncRegistry('entity_states', fn () => $this->entityStatesSynchronizer->sync());
    }

    private function syncRegistry(string $registry, callable $sync): void
    {
        if ($this->registrySyncsInProgress[$registry] ?? false) {
            return;
        }

        $this->registrySyncsInProgress[$registry] = true;

        try {
            $sync();
        } catch (\Throwable $e) {
            logger()->error("Error syncing Home Assistant registry [{$registry}]", ['exception' => $e]);
        } finally {
            $this->registrySyncsInProgress[$registry] = false;
        }
    }
}
