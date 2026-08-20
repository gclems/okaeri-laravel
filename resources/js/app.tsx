import { createInertiaApp } from "@inertiajs/react";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/manrope";

import { configureEcho } from "@laravel/echo-react";

import "./bootstrap";
import { Layout } from "./pages/layout";

configureEcho({
	broadcaster: "reverb",
});

createInertiaApp({
	title: (title) => (title ? `${appName} - ${title}` : appName),
	layout: () => Layout,
	progress: {
		color: "#4B5563",
	},
});
