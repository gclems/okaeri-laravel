<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\DomoEntityFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property string $ha_id
 * @property string $ha_device_id
 * @property string $name
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property array<array-key, mixed>|null $raw
 * @property string|null $platform
 * @property-read Collection<int, DomoEntityAssignment> $assignments
 * @property-read int|null $assignments_count
 * @property-read DomoDevice|null $device
 * @property-read mixed $domain
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity whereHaDeviceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity whereHaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity wherePlatform($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity whereRaw($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntity whereUpdatedAt($value)
 *
 * @property-read DomoEntityState|null $state
 * @property-read Collection<int, DomoEntityEvent> $events
 * @property-read int|null $events_count
 *
 * @mixin \Eloquent
 */
class DomoEntity extends Model
{
    /** @use HasFactory<DomoEntityFactory> */
    use HasFactory;

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
     * @return Attribute<string, never>
     */
    protected function domain(): Attribute
    {
        return Attribute::make(
            get: fn (mixed $value, array $attributes) => explode('.', $attributes['ha_id'])[0],
        );
    }

    /**
     * @return BelongsTo<DomoDevice, $this>
     */
    public function device(): BelongsTo
    {
        return $this->belongsTo(DomoDevice::class, 'ha_device_id', 'ha_id');
    }

    /**
     * @return HasOne<DomoEntityState, $this>
     */
    public function state(): HasOne
    {
        return $this->hasOne(DomoEntityState::class, 'ha_entity_id', 'ha_id');
    }

    /**
     * @return HasMany<DomoEntityEvent, $this>
     */
    public function events(): HasMany
    {
        return $this->hasMany(DomoEntityEvent::class);
    }

    /**
     * @return HasMany<DomoEntityAssignment, $this>
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(DomoEntityAssignment::class);
    }
}
