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
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityStateHistory newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityStateHistory newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityStateHistory query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityStateHistory whereAttributes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityStateHistory whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityStateHistory whereHaEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityStateHistory whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityStateHistory whereRaw($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityStateHistory whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityStateHistory whereValue($value)
 *
 * @mixin \Eloquent
 */
class DomoEntityStateHistory extends Model
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
