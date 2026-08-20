<?php

namespace App\Http\Controllers;

use App\Models\DomoEntityState;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class DomoEntityStatesController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json(
            DomoEntityState::all(),
            Response::HTTP_OK
        );
    }
}
