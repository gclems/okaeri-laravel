import { useEchoPublic } from "@laravel/echo-react";

export function useSunPhaseUpdated(callback: () => void) {
	return useEchoPublic("domo", ".SunPhaseUpdated", () => callback());
}
