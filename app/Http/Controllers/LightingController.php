<?php

namespace App\Http\Controllers;

use App\Domains\Domo\Actions\ChangeLightBulbColorAction;
use App\Domains\Domo\Actions\ToggleLightsAction;
use App\Domains\Domo\Actions\ToggleRoomsLightsAction;
use App\Http\Requests\ChangeBulbColorRequest;
use App\Http\Requests\ToggleLightsRequest;
use App\Http\Requests\ToggleRoomsLightsRequest;
use App\Models\DomoEntity;
use App\Models\DomoRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class LightingController extends Controller
{
    public function toggle(
        ToggleLightsRequest $request,
        ToggleLightsAction $toggleAction
    ): JsonResponse {
        $entities = DomoEntity::query()
            ->whereIn('id', $request->validated('entities_ids', []))
            ->get();

        $toggleAction->execute(
            $entities->map(fn (DomoEntity $entity) => $entity->ha_id)->all(),
            $request->validated('target_state')
        );

        return response()->json(null, Response::HTTP_ACCEPTED);
    }

    public function toggleRooms(
        ToggleRoomsLightsRequest $request,
        ToggleRoomsLightsAction $toggleRoomsAction
    ): JsonResponse {
        $rooms = DomoRoom::query()
            ->whereIn('id', $request->validated('rooms_ids'))
            ->get();

        $toggleRoomsAction->execute($rooms, $request->validated('target_state'));

        return response()->json(null, Response::HTTP_ACCEPTED);
    }

    public function changeLightBulbColor(
        ChangeBulbColorRequest $request,
        ChangeLightBulbColorAction $changeLightBulbColorAction
    ): JsonResponse {
        $changeLightBulbColorAction->execute(
            $request->validated('ha_entity_id'),
            $request->filled('red')
                ? [$request->integer('red'), $request->integer('green'), $request->integer('blue')]
                : null,
            $request->filled('brightness') ? $request->integer('brightness') : null,
        );

        return response()->json(null, Response::HTTP_ACCEPTED);
    }
}
