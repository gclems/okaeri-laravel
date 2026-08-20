<?php

namespace App\Http\Controllers;

use App\Models\DomoDevice;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class DomoDevicesController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json(
            DomoDevice::all(),
            Response::HTTP_OK
        );
    }
}
