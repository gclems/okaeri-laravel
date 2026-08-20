import { useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoEntitiesController from "@/actions/App/Http/Controllers/DomoEntitiesController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoEntity } from "@/types/models";

function DomoEntitiesUpdater() {
	const updateEntities = useDomoStore((state) => state.updateEntities);
	const { get } = useHttp<Record<string, never>, DomoEntity[]>();

	useEchoPublic(
		"domo",
		".DomoEntitiesUpdated",
		({ entities, mode }: { entities: DomoEntity[]; mode: UpdateMode }) => {
			updateEntities(entities, mode);
		},
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		get(DomoEntitiesController.list.url(), {
			onSuccess: (entities) => updateEntities(entities, UpdateMode.Replace),
		});
	}, []);

	return null;
}

export { DomoEntitiesUpdater };
