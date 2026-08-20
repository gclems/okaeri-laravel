<?php

namespace App\Http\Controllers;

use App\Domains\Domo\Actions\ToggleLightAction;
use App\Models\DomoEntity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class LightingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function toggleLight(DomoEntity $entity, ToggleLightAction $toggleLightAction): JsonResponse
    {
        $toggleLightAction->execute($entity->ha_id);

        return response()->json(null, Response::HTTP_ACCEPTED);
    }
}
