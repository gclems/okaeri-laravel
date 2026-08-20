import { useEchoPublic } from "@laravel/echo-react";

export function useDomoEntityStatesUpdated(callback: () => void) {
	return useEchoPublic("domo", ".DomoEntityStatesUpdated", () => callback());
}
