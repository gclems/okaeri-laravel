<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $ha_id
 * @property int|null $ha_area_id
 * @property string $name
 * @property bool $is_active
 * @property bool $is_virtual
 * @property \Carbon\CarbonImmutable|null $created_at
 * @property \Carbon\CarbonImmutable|null $updated_at
 * @property array<array-key, mixed>|null $raw
 * @property string|null $manufacturer
 * @property string|null $model
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\DomoEntity> $entities
 * @property-read int|null $entities_count
 * @property-read \App\Models\DomoRoom|null $room
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereHaAreaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereHaId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereIsVirtual($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereManufacturer($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereRaw($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoDevice whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class DomoDevice extends Model
{
    public function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_virtual' => 'boolean',
            'raw' => 'array',
        ];
    }

    protected $hidden = [
        'raw',
    ];

    public function entities(): HasMany
    {
        return $this->hasMany(DomoEntity::class, 'ha_device_id', 'ha_id');
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(DomoRoom::class, 'ha_area_id', 'ha_id');
    }
}
