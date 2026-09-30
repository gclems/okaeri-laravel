<?php

namespace App\Http\Controllers;

use App\Models\DomoEntityEvent;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class DomoEntityEventsController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json(
            DomoEntityEvent::query()
                ->with('entity')
                ->latest('occurred_at')
                ->latest('id')
                ->get(),
            Response::HTTP_OK
        );
    }
}
