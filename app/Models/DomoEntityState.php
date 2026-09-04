<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property string $ha_entity_id
 * @property string $value
 * @property array<array-key, mixed> $attributes
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property array<array-key, mixed>|null $raw
 * @property-read DomoEntity|null $entity
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityState newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityState newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityState query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityState whereAttributes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityState whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityState whereHaEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityState whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityState whereRaw($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityState whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityState whereValue($value)
 *
 * @mixin \Eloquent
 */
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

    public function entity(): BelongsTo
    {
        return $this->belongsTo(DomoEntity::class, 'ha_entity_id', 'ha_id');
    }
}
