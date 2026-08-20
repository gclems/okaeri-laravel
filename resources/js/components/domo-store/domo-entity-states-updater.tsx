import { useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoEntityStatesController from "@/actions/App/Http/Controllers/DomoEntityStatesController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoEntityState } from "@/types/models";

function DomoEntityStatesUpdater() {
	const updateStates = useDomoStore((state) => state.updateStates);
	const { get } = useHttp<Record<string, never>, DomoEntityState[]>();

	useEchoPublic(
		"domo",
		".DomoEntityStatesUpdated",
		({ states, mode }: { states: DomoEntityState[]; mode: UpdateMode }) => {
			updateStates(states, mode);
		},
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		get(DomoEntityStatesController.list.url(), {
			onSuccess: (states) => updateStates(states, UpdateMode.Replace),
		});
	}, []);

	return null;
}

export { DomoEntityStatesUpdater };
