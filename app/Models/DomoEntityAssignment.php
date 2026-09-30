<?php

namespace App\Models;

use App\Domains\Domo\EntityAssignmentRoles;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $domo_entity_id
 * @property int|null $domo_room_id
 * @property EntityAssignmentRoles $role
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read DomoEntity|null $entity
 * @property-read DomoRoom|null $room
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityAssignment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityAssignment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityAssignment query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityAssignment whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityAssignment whereDomoEntityId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityAssignment whereDomoRoomId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityAssignment whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityAssignment whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DomoEntityAssignment whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class DomoEntityAssignment extends Model
{
    protected $fillable = [
        'domo_entity_id',
        'domo_room_id',
        'role',
    ];

    public function casts(): array
    {
        return [
            'role' => EntityAssignmentRoles::class,
        ];
    }

    /**
     * @return BelongsTo<DomoEntity, $this>
     */
    public function entity(): BelongsTo
    {
        return $this->belongsTo(DomoEntity::class);
    }

    /**
     * @return BelongsTo<DomoRoom, $this>
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(DomoRoom::class);
    }
}
