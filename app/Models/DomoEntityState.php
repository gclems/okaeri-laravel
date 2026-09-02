<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DomoEntityState extends Model
{
    public array $interfaces = [
        'attributes' => [
            'type' => 'Record<string, unknown>',
        ],
    ];

    protected $hidden = [
        'raw',
    ];

    public function casts(): array
    {
        return [
            'attributes' => 'array',
            'raw' => 'array',
        ];
    }

    public function entity(): HasMany
    {
        return $this->hasMany(DomoEntity::class, 'ha_entity_id', 'ha_id');
    }
}
