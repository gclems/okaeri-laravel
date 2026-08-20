import { useEchoPublic } from "@laravel/echo-react";

export function useDomoEntityAssignmentsUpdated(callback: () => void) {
	return useEchoPublic("domo", ".DomoEntityAssignmentsUpdated", () =>
		callback(),
	);
}
