<?php

namespace App\Http\Controllers;

use App\Domains\Domo\Actions\GenerateDomoModelsAction;
use Symfony\Component\HttpFoundation\Response;

class DomoController extends Controller
{
    public function getProjections(
        GenerateDomoModelsAction $generateDomoModelsAction
    ) {
        return response()->json($generateDomoModelsAction->execute(), Response::HTTP_OK);
    }
}
