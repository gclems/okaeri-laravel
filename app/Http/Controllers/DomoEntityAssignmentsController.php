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
use Symfony\Component\HttpFoundation\RedirectResponse;
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
    ): RedirectResponse {
        $entity = DomoEntity::findOrFail($request->integer('entity_id'));
        $room = $request->filled('room_id') ? DomoRoom::findOrFail($request->integer('room_id')) : null;

        $storeAction->execute(
            $entity,
            EntityAssignmentRoles::from($request->validated('role')),
            $room,
        );

        return Inertia::back();
    }
}
