<?php

namespace App\Domains\Unify\DTO;

final class UnifyUplinkStatistics
{
    public function __construct(
        public readonly int $txRateBps,
        public readonly int $rxRateBps,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            txRateBps: $data['uplink']['txRateBps'],
            rxRateBps: $data['uplink']['rxRateBps'],
        );
    }
}
