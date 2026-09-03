import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoDevicesController from "@/actions/App/Http/Controllers/DomoDevicesController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoDevice } from "@/types/models";

function DomoDevicesUpdater() {
	const updateDevices = useDomoStore((state) => state.updateDomoDevices);
	const { get } = useHttp<Record<string, never>, DomoDevice[]>();

	const update = useCallback(() => {
		get(DomoDevicesController.list.url(), {
			onSuccess: (devices) => updateDevices(devices, UpdateMode.Replace),
		});
	}, [get, updateDevices]);

	useEchoPublic("domo", ".DomoDevicesUpdated", () => {
		update();
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		update();
	}, []);

	return null;
}

export { DomoDevicesUpdater };
