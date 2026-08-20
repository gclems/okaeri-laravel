<?php

namespace App\Domains\Domo\Actions;

use App\Domains\Domo\DomoEventMode;
use App\Domains\Domo\EntityAssignmentRoles;
use App\Domains\Domo\Events\DomoEntityAssignmentsUpdated;
use App\Models\DomoEntity;
use App\Models\DomoRoom;

final class StoreDomoEntityAssignmentAction
{
    public function __construct(
        private MoveHomeAssistantDeviceAction $moveHomeAssistantDeviceAction
    ) {}

    public function execute(
        DomoEntity $entity,
        EntityAssignmentRoles $role,
        ?DomoRoom $room,
    ): void {
        // Create the assignment
        $created = $entity->assignments()->create([
            'role' => $role,
            'domo_room_id' => $room?->id,
        ]);

        // Move the device into the room
        $this->moveHomeAssistantDeviceAction->execute(
            $entity->ha_device_id,
            $room?->ha_id ?? null
        );

        DomoEntityAssignmentsUpdated::dispatch(
            [$created],
            DomoEventMode::MERGE
        );
    }
}
