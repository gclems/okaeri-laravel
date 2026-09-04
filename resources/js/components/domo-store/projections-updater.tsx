import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoController from "@/actions/App/Http/Controllers/DomoController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { ClimateSensor, LightBulb, Renault4 } from "@/types/projections";

type ProjectionsApiResponse = {
	lights: LightBulb[];
	climateSensors: ClimateSensor[];
};

// spatie/typescript-transformer flattens each Device subclass independently,
// so `type` is widened to the full DeviceType union on every one of them.
// Re-narrowing it here restores per-variant discrimination on `device.type`.
type AnyDevice =
	| (Omit<LightBulb, "type"> & { type: "light_bulb" })
	| (Omit<ClimateSensor, "type"> & { type: "climate_sensor" })
	| (Omit<Renault4, "type"> & { type: "renault4" });

function ProjectionsUpdater() {
	const updateLights = useDomoStore((state) => state.updateLights);
	const updateClimateSensors = useDomoStore(
		(state) => state.updateClimateSensors,
	);
	const { get } = useHttp<ProjectionsApiResponse>();

	const update = useCallback(() => {
		get(DomoController.getProjections.url(), {
			onSuccess: (projections) => {
				const { lights, climateSensors } = projections as ProjectionsApiResponse;

				updateLights(lights, UpdateMode.Replace);
				updateClimateSensors(climateSensors, UpdateMode.Replace);
			},
		});
	}, [get, updateLights, updateClimateSensors]);

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
				case "renault4":
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
