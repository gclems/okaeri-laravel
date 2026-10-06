<?php

namespace App\Http\Controllers;

use App\Domains\Domo\Actions\GenerateDomoModelsAction;
use App\Domains\Domo\Models\Devices\Car;
use App\Domains\Domo\Models\Devices\ClimateSensor;
use App\Domains\Domo\Models\Devices\ElectricityMeter;
use App\Domains\Domo\Models\Devices\LightBulb;
use App\Domains\Domo\Models\Devices\SwitchDevice;
use App\Domains\Domo\Models\Devices\WeatherForecast;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class DomoController extends Controller
{
    public function getProjections(
        GenerateDomoModelsAction $generateDomoModelsAction
    ): JsonResponse {
        $allProjections = $generateDomoModelsAction->execute();

        $lights = [];
        $climateSensors = [];
        $cars = [];
        $switches = [];
        $weatherForecasts = [];
        $electricityMeters = [];

        $allProjections->each(function ($projection) use (&$lights, &$climateSensors, &$cars, &$switches, &$weatherForecasts, &$electricityMeters) {
            if ($projection instanceof LightBulb) {
                $lights[] = $projection;
            }

            if ($projection instanceof ClimateSensor) {
                $climateSensors[] = $projection;
            }

            if ($projection instanceof Car) {
                $cars[] = $projection;
            }

            if ($projection instanceof SwitchDevice) {
                $switches[] = $projection;
            }

            if ($projection instanceof WeatherForecast) {
                $weatherForecasts[] = $projection;
            }

            if ($projection instanceof ElectricityMeter) {
                $electricityMeters[] = $projection;
            }
        });

        return response()->json([
            'lights' => $lights,
            'climateSensors' => $climateSensors,
            'cars' => $cars,
            'switches' => $switches,
            'weatherForecasts' => $weatherForecasts,
            'electricityMeters' => $electricityMeters,
        ], Response::HTTP_OK);
    }
}
