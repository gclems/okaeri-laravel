<?php

namespace App\Http\Controllers;

use App\Models\SunPhase;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class SunPhasesController extends Controller
{
    public function getByDate(Carbon $date): JsonResponse
    {
        return response()->json(
            SunPhase::whereDate('date', $date->toDateString())->first(),
            Response::HTTP_OK
        );
    }
}
