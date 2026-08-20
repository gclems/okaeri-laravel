import { useEffect } from "react";

import { useHttp } from "@inertiajs/react";

import SunPhasesController from "@/actions/App/Http/Controllers/SunPhasesController";
import { useToday } from "@/features/clock/use-today";
import { useDomoStore } from "@/features/domo/domo-store";
import type { SunPhase } from "@/types/models";

function SunPhaseUpdater() {
	const updateSunPhase = useDomoStore((state) => state.updateSunPhase);
	const { get } = useHttp<Record<string, never>, SunPhase>();

	const today = useToday();

	useEffect(() => {
		get(SunPhasesController.getByDate.url({ date: today.toDateString() }), {
			onSuccess: (sunPhase) => updateSunPhase(sunPhase),
		});
	}, [today, get, updateSunPhase]);

	return null;
}

export { SunPhaseUpdater };
