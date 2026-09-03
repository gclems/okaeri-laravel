<?php

namespace App\Http\Controllers;

use App\Domains\Domo\Actions\GenerateDomoModelsAction;
use App\Domains\Domo\Models\LightBulb;
use Symfony\Component\HttpFoundation\Response;

class DomoController extends Controller
{
    public function getProjections(
        GenerateDomoModelsAction $generateDomoModelsAction
    ) {
        $allProjections = $generateDomoModelsAction->execute();

        $lights = $allProjections->where(fn ($projection) => $projection instanceof LightBulb);

        return response()->json([
            'lights' => $lights,
        ], Response::HTTP_OK);
    }
}
