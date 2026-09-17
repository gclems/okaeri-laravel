import Echo from "laravel-echo";
import Pusher from "pusher-js";

if (typeof window !== "undefined") {
	window.Pusher = Pusher;

	window.Echo = new Echo({
		broadcaster: "reverb",
		namespace: "App.Domains.Domo.Events",
		key: import.meta.env.VITE_REVERB_APP_KEY,

		wsHost: import.meta.env.VITE_REVERB_HOST,
		wsPort: Number(import.meta.env.VITE_REVERB_PORT),

		forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",
		enabledTransports:
			import.meta.env.VITE_REVERB_SCHEME === "https" ? ["wss"] : ["ws"],
	});
}
