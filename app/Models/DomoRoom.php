<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $ha_id
 * @property string $name
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property array<array-key, mixed>|null $raw
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DomoEntityAssignment> $assignments
 * @property-read int|null $assignments_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DomoDevice> $devices
 * @property-read int|null $devices_count
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereHaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereRaw($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class DomoRoom extends Model
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

    public function devices(): HasMany
    {
        return $this->hasMany(DomoDevice::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(DomoEntityAssignment::class);
    }
}
