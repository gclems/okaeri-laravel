<?php

namespace App\Http\Controllers;

use App\Models\SunPhase;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class SunPhasesController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json(
            SunPhase::all()->toArray(),
            Response::HTTP_OK
        );
    }
}
