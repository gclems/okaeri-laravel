<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DomoEntity extends Model
{
    public function device(): BelongsTo
    {
        return $this->belongsTo(DomoDevice::class, 'ha_device_id', 'ha_id');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(DomoEntityAssignment::class);
    }
}