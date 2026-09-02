import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import SunPhasesController from "@/actions/App/Http/Controllers/SunPhasesController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { SunPhase } from "@/types/models";

function SunPhaseUpdater() {
	const updateSunPhase = useDomoStore((state) => state.updateSunPhases);
	const { get } = useHttp<Record<string, never>, SunPhase[]>();

	const update = useCallback(() => {
		get(SunPhasesController.list.url(), {
			onSuccess: (sunPhases: SunPhase[]) => {
				updateSunPhase(sunPhases, UpdateMode.Replace);
			},
		});
	}, [get, updateSunPhase]);

	useEchoPublic("domo", ".SunPhaseUpdated", () => {
		update();
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		update();
	}, []);

	return null;
}

export { SunPhaseUpdater };
