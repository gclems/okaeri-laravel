import { useEffect } from "react";

import { useHttp } from "@inertiajs/react";
import { useEchoPublic } from "@laravel/echo-react";

import DomoEntityAssignmentsController from "@/actions/App/Http/Controllers/DomoEntityAssignmentsController";
import { UpdateMode, useDomoStore } from "@/features/domo/domo-store";
import type { DomoEntityAssignment } from "@/types/models";

function DomoEntityAssignmentsUpdater() {
	const updateAssignments = useDomoStore((state) => state.updateAssignments);
	const { get } = useHttp<Record<string, never>, DomoEntityAssignment[]>();

	useEchoPublic(
		"domo",
		".DomoEntityAssignmentsUpdated",
		({
			assignments,
			mode,
		}: {
			assignments: DomoEntityAssignment[];
			mode: UpdateMode;
		}) => {
			console.log("DomoEntityAssignmentsUpdater: received update", {
				assignments,
				mode,
			});
			updateAssignments(assignments, mode);
		},
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We want this to run only once on mount
	useEffect(() => {
		get(DomoEntityAssignmentsController.list.url(), {
			onSuccess: (assignments) =>
				updateAssignments(assignments, UpdateMode.Replace),
		});
	}, []);

	return null;
}

export { DomoEntityAssignmentsUpdater };
