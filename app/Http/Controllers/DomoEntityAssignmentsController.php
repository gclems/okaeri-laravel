<?php

namespace App\Http\Controllers;

use App\Domains\Domo\Actions\StoreDomoEntityAssignmentAction;
use App\Domains\Domo\EntityAssignmentRoles;
use App\Http\Requests\StoreDomoEntityAssignmentRequest;
use App\Models\DomoEntity;
use App\Models\DomoEntityAssignment;
use App\Models\DomoRoom;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class DomoEntityAssignmentsController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json(
            DomoEntityAssignment::all(),
            Response::HTTP_OK
        );
    }

    public function store(
        StoreDomoEntityAssignmentRequest $request,
        StoreDomoEntityAssignmentAction $storeAction
    ) {
        $entity = DomoEntity::find($request->validated('entity_id'));
        $room = $request->validated('room_id') ? DomoRoom::find($request->validated('room_id')) : null;

        $storeAction->execute(
            $entity,
            EntityAssignmentRoles::from($request->validated('role')),
            $room,
        );

        return Inertia::back();
    }
}
