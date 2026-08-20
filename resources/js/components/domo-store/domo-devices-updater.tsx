import { useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoDevicesController from "@/actions/App/Http/Controllers/DomoDevicesController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoDevice } from "@/types/models";

function DomoDevicesUpdater() {
	const updateDevices = useDomoStore((state) => state.updateDevices);
	const { get } = useHttp<Record<string, never>, DomoDevice[]>();

	useEchoPublic(
		"domo",
		".DomoDevicesUpdated",
		({ devices, mode }: { devices: DomoDevice[]; mode: UpdateMode }) => {
			updateDevices(devices, mode);
		},
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		get(DomoDevicesController.list.url(), {
			onSuccess: (devices) => updateDevices(devices, UpdateMode.Replace),
		});
	}, []);

	return null;
}

export { DomoDevicesUpdater };
