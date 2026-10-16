import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoInputsController from "@/actions/App/Http/Controllers/DomoInputsController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoInput } from "@/types/models";

function DomoInputsUpdater() {
	const updateInputs = useDomoStore((state) => state.updateDomoInputs);
	const { get } = useHttp<Record<string, never>, DomoInput[]>();

	const updateAll = useCallback(() => {
		get(DomoInputsController.list.url(), {
			onSuccess: (inputs) => updateInputs(inputs, UpdateMode.Replace),
		});
	}, [get, updateInputs]);

	useEchoPublic("domo", ".DomoInputsUpdated", () => {
		updateAll();
	});

	useEchoPublic("domo", ".DomoInputUpdated", (event: { input: DomoInput }) => {
		updateInputs([event.input], UpdateMode.Merge);
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		updateAll();
	}, []);

	return null;
}

export { DomoInputsUpdater };
