<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DomoDevice extends Model
{
    public function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_virtual' => 'boolean',
        ];
    }

    public function entities(): HasMany
    {
        return $this->hasMany(DomoEntity::class, 'ha_device_id', 'ha_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(DomoRoom::class, 'ha_area_id', 'ha_id');
    }
}
