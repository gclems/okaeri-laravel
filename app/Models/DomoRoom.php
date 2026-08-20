<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DomoRoom extends Model
{
    public function devices(): HasMany
    {
        return $this->hasMany(DomoDevice::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(DomoEntityAssignment::class);
    }
}