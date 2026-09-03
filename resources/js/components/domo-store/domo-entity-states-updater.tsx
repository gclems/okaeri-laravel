import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoEntityStatesController from "@/actions/App/Http/Controllers/DomoEntityStatesController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoEntityState } from "@/types/models";

function DomoEntityStatesUpdater() {
	const updateStates = useDomoStore((state) => state.updateDomoStates);
	const { get } = useHttp<Record<string, never>, DomoEntityState[]>();

	const updateAll = useCallback(() => {
		get(DomoEntityStatesController.list.url(), {
			onSuccess: (states) => updateStates(states, UpdateMode.Replace),
		});
	}, [get, updateStates]);

	const updateOne = useCallback(
		(state: DomoEntityState) => {
			updateStates([state], UpdateMode.Merge);
		},
		[updateStates],
	);

	useEchoPublic("domo", ".DomoEntityStatesUpdated", () => {
		updateAll();
	});

	useEchoPublic(
		"domo",
		".DomoEntityStateUpdated",
		(event: { state: DomoEntityState }) => {
			updateOne(event.state);
		},
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		updateAll();
	}, []);

	return null;
}

export { DomoEntityStatesUpdater };
