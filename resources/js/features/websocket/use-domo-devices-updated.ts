import { useEchoPublic } from "@laravel/echo-react";

export function useDomoDevicesUpdated(callback: () => void) {
	return useEchoPublic("domo", ".DomoDevicesUpdated", () => callback());
}
