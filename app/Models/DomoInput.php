<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\DomoInputFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Home Assistant helper (input_text, input_boolean, .
 *
 * ..) state.
 * Helpers have no device, so they are not tracked as DomoEntity.
 *
 * @property int $id
 * @property string $ha_entity_id
 * @property string $value
 * @property array<array-key, mixed> $attributes
 * @property array<array-key, mixed> $raw
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @method static \Database\Factories\DomoInputFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoInput newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoInput newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoInput query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoInput whereAttributes($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoInput whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoInput whereHaEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoInput whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoInput whereRaw($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoInput whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoInput whereValue($value)
 *
 * @mixin \Eloquent
 */
class DomoInput extends Model
{
    /** @use HasFactory<DomoInputFactory> */
    use HasFactory;

    /**
     * @var array<string, array<string, string>>
     */
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
}
