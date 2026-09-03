<?php

namespace App\Http\Controllers;

use App\Domains\Domo\Actions\ToggleLightsAction;
use App\Http\Requests\ToggleLightsRequest;
use App\Models\DomoEntity;
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
            $entities->pluck('ha_id')->all(),
            $request->validated('target_state')
        );

        return response()->json(null, Response::HTTP_ACCEPTED);
    }
}