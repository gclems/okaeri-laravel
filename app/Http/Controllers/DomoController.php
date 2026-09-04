<?php

namespace App\Http\Controllers;

use App\Domains\Domo\Actions\GenerateDomoModelsAction;
use App\Domains\Domo\Models\ClimateSensor;
use App\Domains\Domo\Models\LightBulb;
use Symfony\Component\HttpFoundation\Response;

class DomoController extends Controller
{
    public function getProjections(
        GenerateDomoModelsAction $generateDomoModelsAction
    ) {
        $allProjections = $generateDomoModelsAction->execute();

        $lights = [];
        $climateSensors = [];

        $allProjections->each(function ($projection) use (&$lights, &$climateSensors) {
            if ($projection instanceof LightBulb) {
                $lights[] = $projection;
            }

            if ($projection instanceof ClimateSensor) {
                $climateSensors[] = $projection;
            }
        });

        return response()->json([
            'lights' => $lights,
            'climateSensors' => $climateSensors,
        ], Response::HTTP_OK);
    }
}