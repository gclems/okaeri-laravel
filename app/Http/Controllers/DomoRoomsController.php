<?php

namespace App\Http\Controllers;

use App\Domains\Domo\Actions\DeleteHomeAssistantAreaAction;
use App\Domains\Domo\Actions\RenameHomeAssistantAreaAction;
use App\Domains\Domo\Actions\StoreHomeAssistantAreaAction;
use App\Http\Requests\RenameDomoRoomRequest;
use App\Http\Requests\StoreDomoRoomRequest;
use App\Models\DomoRoom;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class DomoRoomsController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json(
            DomoRoom::all(),
            Response::HTTP_OK
        );
    }

    public function store(
        StoreDomoRoomRequest $request,
        StoreHomeAssistantAreaAction $storeAction
    ) {
        $storeAction->execute($request->validated('name'));

        return Inertia::back();
    }

    public function rename(
        RenameDomoRoomRequest $request,
        DomoRoom $room,
        RenameHomeAssistantAreaAction $renameAction)
    {
        $renameAction->execute($room, $request->validated('name'));

        return Inertia::back();
    }

    public function delete(
        DomoRoom $room,
        DeleteHomeAssistantAreaAction $deleteAction
    ) {
        $deleteAction->execute($room);

        return Inertia::back();
    }
}
