<?php

namespace App\Domains\Unify\DTO;

final class UnifyWifiBroadcast
{
    public function __construct(
        public readonly string $ssid,
        public readonly string $password,
        public readonly bool $hidden,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            ssid: $data['name'],
            password: $data['securityConfiguration']['passphrase'],
            hidden: $data['hideName'],
        );
    }
}
