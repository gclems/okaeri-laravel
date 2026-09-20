import { useEchoPublic } from "@laravel/echo-react";

export function useAppRestarted() {
	return useEchoPublic("app", ".AppRestarted", () => {
		window.location.reload();
	});
}
