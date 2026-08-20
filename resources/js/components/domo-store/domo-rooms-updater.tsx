import { useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoRoomsController from "@/actions/App/Http/Controllers/DomoRoomsController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoRoom } from "@/types/models";

function DomoRoomsUpdater() {
	const updateRooms = useDomoStore((state) => state.updateRooms);
	const { get } = useHttp<Record<string, never>, DomoRoom[]>();

	useEchoPublic(
		"domo",
		".DomoRoomsUpdated",
		({ rooms, mode }: { rooms: DomoRoom[]; mode: UpdateMode }) => {
			updateRooms(rooms, mode);
		},
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		get(DomoRoomsController.list.url(), {
			onSuccess: (rooms) => updateRooms(rooms, UpdateMode.Replace),
		});
	}, []);

	return null;
}

export { DomoRoomsUpdater };
