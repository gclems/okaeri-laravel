import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoEntityEventsController from "@/actions/App/Http/Controllers/DomoEntityEventsController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoEntityEvent } from "@/types/models";

function TraceUpdater() {
	const updateTraces = useDomoStore((state) => state.updateTraces);
	const { get } = useHttp<Record<string, never>, DomoEntityEvent[]>();

	const update = useCallback(() => {
		get(DomoEntityEventsController.list.url(), {
			onSuccess: (traces) => updateTraces(traces, UpdateMode.Replace),
		});
	}, [get, updateTraces]);

	useEchoPublic("domo", ".DomoEntityEventsUpdated", () => {
		update();
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		update();
	}, []);

	return null;
}

export { TraceUpdater };
