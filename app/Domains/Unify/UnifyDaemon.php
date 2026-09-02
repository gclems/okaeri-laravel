<?php

namespace App\Domains\Unify;

use App\Domains\Unify\Events\UnifyUplinkUpdated;

final class UnifyDaemon
{
    public function __construct(
        private readonly UnifyClient $client,
    ) {}

    public function run(): void
    {
        while (true) {
            $this->poll();

            sleep(2);
        }
    }

    private function poll(): void
    {
        try {
            $statistics = $this->client->getUplinkStatistics();

            UnifyUplinkUpdated::dispatch($statistics->txRateBps, $statistics->rxRateBps);
        } catch (\Throwable $e) {
            logger()->error('Error polling UniFi uplink statistics', ['exception' => $e]);
        }
    }
}
