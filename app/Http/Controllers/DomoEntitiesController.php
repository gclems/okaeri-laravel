<?php

namespace App\Http\Controllers;

use App\Models\DomoEntity;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class DomoEntitiesController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json(
            DomoEntity::all(),
            Response::HTTP_OK
        );
    }
}
