<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\DomoEntityEventFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Prunable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $domo_entity_id
 * @property string $value
 * @property array<string, mixed>|null $attributes
 * @property list<string> $changes
 * @property CarbonImmutable $occurred_at
 * @property-read DomoEntity|null $entity
 *
 * @mixin \Eloquent
 */
class DomoEntityEvent extends Model
{
    /** @use HasFactory<DomoEntityEventFactory> */
    use HasFactory, Prunable;

    public const int RETENTION_DAYS = 7;

    /** @var array<string, array{type: string}> */
    public array $interfaces = [
        'attributes' => [
            'type' => 'Record<string, unknown> | null',
        ],
        'changes' => [
            'type' => 'string[]',
        ],
    ];

    public $timestamps = false;

    protected $fillable = [
        'domo_entity_id',
        'value',
        'attributes',
        'changes',
        'occurred_at',
    ];

    public function casts(): array
    {
        return [
            'attributes' => 'array',
            'changes' => 'array',
            'occurred_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<DomoEntity, $this>
     */
    public function entity(): BelongsTo
    {
        return $this->belongsTo(DomoEntity::class, 'domo_entity_id');
    }

    /**
     * @return Builder<static>
     */
    public function prunable(): Builder
    {
        return static::query()->where('occurred_at', '<', now()->subDays(self::RETENTION_DAYS));
    }
}
