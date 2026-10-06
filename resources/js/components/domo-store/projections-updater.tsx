import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoController from "@/actions/App/Http/Controllers/DomoController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type {
	Car,
	ClimateSensor,
	ElectricityMeter,
	LightBulb,
	SwitchDevice,
	WeatherForecast,
} from "@/types/projections";

type ProjectionsApiResponse = {
	lights: LightBulb[];
	climateSensors: ClimateSensor[];
	cars: Car[];
	switches: SwitchDevice[];
	weatherForecasts: WeatherForecast[];
	electricityMeters: ElectricityMeter[];
};

// spatie/typescript-transformer flattens each Device subclass independently,
// so `type` is widened to the full DeviceType union on every one of them.
// Re-narrowing it here restores per-variant discrimination on `device.type`.
type AnyDevice =
	| (Omit<LightBulb, "type"> & { type: "light_bulb" })
	| (Omit<ClimateSensor, "type"> & { type: "climate_sensor" })
	| (Omit<Car, "type"> & { type: "car" })
	| (Omit<SwitchDevice, "type"> & { type: "switch" })
	| (Omit<WeatherForecast, "type"> & { type: "weather_forecast" })
	| (Omit<ElectricityMeter, "type"> & { type: "electricity_meter" });

function ProjectionsUpdater() {
	const updateLights = useDomoStore((state) => state.updateLights);
	const updateClimateSensors = useDomoStore(
		(state) => state.updateClimateSensors,
	);
	const updateCars = useDomoStore((state) => state.updateCars);
	const updateSwitches = useDomoStore((state) => state.updateSwitches);
	const updateWeatherForecasts = useDomoStore(
		(state) => state.updateWeatherForecasts,
	);
	const updateElectricityMeters = useDomoStore(
		(state) => state.updateElectricityMeters,
	);
	const { get } = useHttp<ProjectionsApiResponse>();

	const update = useCallback(() => {
		get(DomoController.getProjections.url(), {
			onSuccess: (projections) => {
				const {
					lights,
					climateSensors,
					cars,
					switches,
					weatherForecasts,
					electricityMeters,
				} = projections as ProjectionsApiResponse;

				updateLights(lights, UpdateMode.Replace);
				updateClimateSensors(climateSensors, UpdateMode.Replace);
				updateCars(cars, UpdateMode.Replace);
				updateSwitches(switches, UpdateMode.Replace);
				updateWeatherForecasts(weatherForecasts, UpdateMode.Replace);
				updateElectricityMeters(electricityMeters, UpdateMode.Replace);
			},
		});
	}, [
		get,
		updateLights,
		updateClimateSensors,
		updateCars,
		updateSwitches,
		updateWeatherForecasts,
		updateElectricityMeters,
	]);

	useEchoPublic(
		"domo",
		".DeviceUpdated",
		({ device }: { device: AnyDevice }) => {
			switch (device.type) {
				case "light_bulb":
					updateLights([device], UpdateMode.Merge);
					break;
				case "climate_sensor":
					updateClimateSensors([device], UpdateMode.Merge);
					break;
				case "car":
					updateCars([device], UpdateMode.Merge);
					break;
				case "switch":
					updateSwitches([device], UpdateMode.Merge);
					break;
				case "weather_forecast":
					updateWeatherForecasts([device], UpdateMode.Merge);
					break;
				case "electricity_meter":
					updateElectricityMeters([device], UpdateMode.Merge);
					break;
			}
		},
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		update();
	}, []);

	return null;
}

export { ProjectionsUpdater };
