<?php

namespace App\Domains\Unify;

use App\Domains\Unify\DTO\UnifyUplinkStatistics;
use App\Domains\Unify\DTO\UnifyWifiBroadcast;
use Illuminate\Support\Facades\Http;

final class UnifyClient
{
    private ?string $siteId = null;

    private ?string $deviceId = null;

    private ?string $wifiBroadcastId = null;

    public function getUplinkStatistics(): UnifyUplinkStatistics
    {
        $response = $this->request("/sites/{$this->getSiteId()}/devices/{$this->getDeviceId()}/statistics/latest");

        return UnifyUplinkStatistics::fromArray($response);
    }

    public function getWifiBroadcast(): UnifyWifiBroadcast
    {
        $response = $this->request("/sites/{$this->getSiteId()}/wifi/broadcasts/{$this->getWifiBroadcastId()}");

        return UnifyWifiBroadcast::fromArray($response);
    }

    private function getSiteId(): string
    {
        if ($this->siteId === null) {
            $this->siteId = $this->request('/sites')['data'][0]['id'];
        }

        return $this->siteId;
    }

    private function getDeviceId(): string
    {
        if ($this->deviceId === null) {
            $this->deviceId = $this->request("/sites/{$this->getSiteId()}/devices")['data'][0]['id'];
        }

        return $this->deviceId;
    }

    private function getWifiBroadcastId(): string
    {
        if ($this->wifiBroadcastId === null) {
            $this->wifiBroadcastId = $this->request("/sites/{$this->getSiteId()}/wifi/broadcasts")['data'][0]['id'];
        }

        return $this->wifiBroadcastId;
    }

    private function request(string $path): array
    {
        $url = rtrim(config('unify.url'), '/').'/proxy/network/integrations/v1'.$path;

        return Http::withHeaders([
            'X-API-Key' => config('unify.api_key'),
        ])
            ->withoutVerifying()
            ->connectTimeout(3)
            ->timeout(5)
            ->get($url)
            ->throw()
            ->json();
    }
}
