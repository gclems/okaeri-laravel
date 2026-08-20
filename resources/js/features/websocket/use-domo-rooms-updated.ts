import { useEchoPublic } from "@laravel/echo-react";

export function useDomoRoomsUpdated(callback: () => void) {
	return useEchoPublic("domo", ".DomoRoomsUpdated", () => callback());
}
