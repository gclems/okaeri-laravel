<?php

namespace App\Http\Controllers;

use App\Domains\Domo\Actions\ToggleLightAction;
use App\Domains\Domo\Actions\TurnMultipleLightsAction;
use App\Http\Requests\TurnMultipleLightsOffRequest;
use App\Models\DomoEntity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class LightingController extends Controller
{
    public function toggleLight(DomoEntity $entity, ToggleLightAction $toggleLightAction): JsonResponse
    {
        $toggleLightAction->execute($entity->ha_id);

        return response()->json(null, Response::HTTP_ACCEPTED);
    }

    public function turnOffMultiple(
        TurnMultipleLightsOffRequest $request,
        TurnMultipleLightsAction $turnOffAction
    ): JsonResponse {
        $entities = DomoEntity::query()
            ->whereIn('id', $request->validated('entities_ids', []))
            ->get();

        $turnOffAction->execute($entities->pluck('ha_id')->all());

        return response()->json(null, Response::HTTP_ACCEPTED);
    }
}
