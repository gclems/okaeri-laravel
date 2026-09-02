import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";

import DomoController from "@/actions/App/Http/Controllers/DomoController";
import type { DomoEntity } from "@/types/models";

function ProjectionsUpdater() {
	// const updateEntities = useDomoStore((state) => state.updateEntities);
	const { get } = useHttp<Record<string, never>, DomoEntity[]>();

	const update = useCallback(() => {
		get(DomoController.getProjections.url(), {
			onSuccess: (projections) => {
				console.log({ projections });
			},
		});
	}, [get]);

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
