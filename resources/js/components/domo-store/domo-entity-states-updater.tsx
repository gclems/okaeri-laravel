import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoEntityStatesController from "@/actions/App/Http/Controllers/DomoEntityStatesController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoEntityState } from "@/types/models";

function DomoEntityStatesUpdater() {
	const updateStates = useDomoStore((state) => state.updateStates);
	const { get } = useHttp<Record<string, never>, DomoEntityState[]>();

	const update = useCallback(() => {
		get(DomoEntityStatesController.list.url(), {
			onSuccess: (states) => updateStates(states, UpdateMode.Replace),
		});
	}, [get, updateStates]);

	useEchoPublic("domo", ".DomoEntityStatesUpdated", () => {
		update();
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		update();
	}, []);

	return null;
}

export { DomoEntityStatesUpdater };
