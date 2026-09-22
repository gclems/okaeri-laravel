import { useEchoPublic } from "@laravel/echo-react";

export function useAppUpdated() {
	return useEchoPublic("app", ".AppUpdated", () => {
		console.log("app updated");
		window.location.reload();
	});
}
