<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $ha_id
 * @property string $name
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property array<array-key, mixed>|null $raw
 * @property string|null $ha_temperature_entity_id
 * @property string|null $ha_humidity_entity_id
 * @property-read Collection<int, DomoEntityAssignment> $assignments
 * @property-read int|null $assignments_count
 * @property-read Collection<int, DomoDevice> $devices
 * @property-read int|null $devices_count
 * @property-read DomoEntity|null $temperatureEntity
 * @property-read DomoEntity|null $humidityEntity
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereHaHumidityEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereHaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereHaTemperatureEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereRaw($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoRoom whereUpdatedAt($value)
 *
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

    /**
     * @return HasMany<DomoDevice, $this>
     */
    public function devices(): HasMany
    {
        return $this->hasMany(DomoDevice::class, 'ha_area_id', 'ha_id');
    }

    /**
     * @return HasMany<DomoEntityAssignment, $this>
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(DomoEntityAssignment::class);
    }

    /**
     * @return BelongsTo<DomoEntity, $this>
     */
    public function temperatureEntity(): BelongsTo
    {
        return $this->belongsTo(DomoEntity::class, 'ha_temperature_entity_id', 'ha_id');
    }

    /**
     * @return BelongsTo<DomoEntity, $this>
     */
    public function humidityEntity(): BelongsTo
    {
        return $this->belongsTo(DomoEntity::class, 'ha_humidity_entity_id', 'ha_id');
    }
}
