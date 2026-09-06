<?php

namespace App\Domains\Domo\Resolvers\Entities;

use App\Models\DomoDevice;
use App\Models\DomoEntity;
use Illuminate\Support\Str;

abstract class SlugSuffixEntityResolver implements EntityResolver
{
    abstract protected function domain(): string;

    abstract protected function suffix(): string;

    public function supports(DomoEntity $entity, DomoDevice $device): bool
    {
        $prefix = $this->devicePrefix($device);

        if ($prefix === '') {
            return false;
        }

        $dedupSuffix = $this->deviceDedupSuffix($device);

        return $entity->ha_id === "{$this->domain()}.{$prefix}{$this->suffix()}{$dedupSuffix}";
    }

    /**
     * The device's HA slug, common to every one of its entities' ha_id, derived
     * from the entities themselves rather than reimplementing HA's slugify.
     */
    private function devicePrefix(DomoDevice $device): string
    {
        $localIds = $this->localIds($device);

        if (count($localIds) < 2) {
            return '';
        }

        $prefix = array_reduce(
            array_slice($localIds, 1),
            fn (string $carry, string $localId) => $this->commonPrefix($carry, $localId),
            $localIds[0],
        );

        $lastUnderscore = strrpos($prefix, '_');

        return $lastUnderscore === false ? '' : substr($prefix, 0, $lastUnderscore + 1);
    }

    /**
     * HA appends the same "_<n>" suffix to every entity of a device when its
     * slug collides with another device's. Only trust it when every entity
     * shares it, so a coincidental trailing digit doesn't get mistaken for it.
     */
    private function deviceDedupSuffix(DomoDevice $device): string
    {
        $localIds = $this->localIds($device);

        if ($localIds === [] || ! preg_match('/_\d+$/', $localIds[0], $matches)) {
            return '';
        }

        foreach ($localIds as $localId) {
            if (! str_ends_with($localId, $matches[0])) {
                return '';
            }
        }

        return $matches[0];
    }

    /**
     * @return list<string>
     */
    private function localIds(DomoDevice $device): array
    {
        return array_values(
            $device->entities
                ->map(fn (DomoEntity $sibling) => Str::after($sibling->ha_id, '.'))
                ->all()
        );
    }

    private function commonPrefix(string $a, string $b): string
    {
        $length = min(strlen($a), strlen($b));

        $i = 0;
        while ($i < $length && $a[$i] === $b[$i]) {
            $i++;
        }

        return substr($a, 0, $i);
    }
}
