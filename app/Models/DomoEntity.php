<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DomoEntity extends Model
{
    public function casts(): array
    {
        return [
            'raw' => 'array',
        ];
    }

    protected $hidden = [
        'raw',
    ];

    protected function domain(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => explode('.', $attributes['ha_id'])[0] ?? null,
        );
    }

    public function device(): BelongsTo
    {
        return $this->belongsTo(DomoDevice::class, 'ha_device_id', 'ha_id');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(DomoEntityAssignment::class);
    }
}
