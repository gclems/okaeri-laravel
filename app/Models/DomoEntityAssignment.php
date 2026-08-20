<?php

namespace App\Models;

use App\Domains\Domo\EntityAssignmentRoles;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    public function entity(): BelongsTo
    {
        return $this->belongsTo(DomoEntity::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(DomoRoom::class);
    }
}