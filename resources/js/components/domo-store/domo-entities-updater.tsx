import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoEntitiesController from "@/actions/App/Http/Controllers/DomoEntitiesController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoEntity } from "@/types/models";

function DomoEntitiesUpdater() {
	const updateEntities = useDomoStore((state) => state.updateDomoEntities);
	const { get } = useHttp<Record<string, never>, DomoEntity[]>();

	const update = useCallback(() => {
		get(DomoEntitiesController.list.url(), {
			onSuccess: (entities) => updateEntities(entities, UpdateMode.Replace),
		});
	}, [get, updateEntities]);

	useEchoPublic("domo", ".DomoEntitiesUpdated", () => {
		update();
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		update();
	}, []);

	return null;
}

export { DomoEntitiesUpdater };
