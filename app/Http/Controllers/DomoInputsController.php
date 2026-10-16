<?php

namespace App\Http\Controllers;

use App\Models\DomoInput;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class DomoInputsController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json(
            DomoInput::all(),
            Response::HTTP_OK
        );
    }
}
