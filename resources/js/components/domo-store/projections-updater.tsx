import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";

import DomoController from "@/actions/App/Http/Controllers/DomoController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { LightBulb } from "@/types/projections";

type ProjectionsApiResponse = {
	lights: LightBulb[];
};

function ProjectionsUpdater() {
	const updateLights = useDomoStore((state) => state.updateLights);
	const { get } = useHttp<ProjectionsApiResponse>();

	const update = useCallback(() => {
		get(DomoController.getProjections.url(), {
			onSuccess: (projections) => {
				const { lights } = projections as ProjectionsApiResponse;

				updateLights(lights, UpdateMode.Replace);
			},
		});
	}, [get, updateLights]);

	// useEchoPublic("domo", ".DomoEntitiesUpdated", () => {
	// 	update();
	// });

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		update();
	}, []);

	return null;
}

export { ProjectionsUpdater };
