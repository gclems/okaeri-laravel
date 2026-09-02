<?php

namespace App\Domains\Domo\Models;

abstract class Entity
{
    public function __construct(
        public readonly int $id,
    ) {}
}
