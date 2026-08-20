import { useEchoPublic } from "@laravel/echo-react";

export function useDomoEntitiesUpdated(callback: () => void) {
	return useEchoPublic("domo", ".DomoEntitiesUpdated", () => callback());
}
