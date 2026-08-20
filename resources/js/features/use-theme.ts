// import type { SunPhase } from "@/features/sun/sun-functions";
// import { useSun } from "@/features/sun/use-sun";
// import { useSunPhase } from "@/features/sun/use-sun-phase";

// import { type OkaeriTheme, applyTheme } from "./theme";

// const themeFromSunPhase = {
// 	sunrise: "morning",
// 	day: "day",
// 	sunset: "evening",
// 	night: "night",
// } satisfies Record<SunPhase, OkaeriTheme>;

export function useTheme() {
	applyTheme("day");
	return "day";
	// const sunQuery = useSun();
	// const sunPhase = useSunPhase(sunQuery.data);

	// const [theme, setTheme] = useState<OkaeriTheme>("morning");

	// useEffect(() => {
	// 	// const nextTheme = themeFromSunPhase[sunPhase as SunPhase] ?? "day";
	// 	const nextTheme = "morning";
	// 	setTheme(nextTheme);
	// 	applyTheme(nextTheme);
	// // }, [sunPhase]);

	// return {
	// 	theme,
	// 	setTheme: (theme: OkaeriTheme) => {
	// 		setTheme(theme);
	// 		applyTheme(theme);
	// 	},
	// };
}

function applyTheme(theme: string) {
	document.documentElement.dataset.theme = theme;
	localStorage.setItem("okaeri-theme", theme);
}
