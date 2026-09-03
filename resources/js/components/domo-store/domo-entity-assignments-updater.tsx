import { useCallback, useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoEntityAssignmentsController from "@/actions/App/Http/Controllers/DomoEntityAssignmentsController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoEntityAssignment } from "@/types/models";

function DomoEntityAssignmentsUpdater() {
	const updateAssignments = useDomoStore((state) => state.updateDomoAssignments);
	const { get } = useHttp<Record<string, never>, DomoEntityAssignment[]>();

	const update = useCallback(() => {
		get(DomoEntityAssignmentsController.list.url(), {
			onSuccess: (assignments) =>
				updateAssignments(assignments, UpdateMode.Replace),
		});
	}, [get, updateAssignments]);

	useEchoPublic("domo", ".DomoEntityAssignmentsUpdated", () => {
		update();
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		update();
	}, []);

	return null;
}

export { DomoEntityAssignmentsUpdater };
