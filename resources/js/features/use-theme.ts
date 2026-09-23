import { useClock } from "./clock/use-clock";

export function isDay(date: Date = new Date()) {
	const minutesSinceMidnight = date.getHours() * 60 + date.getMinutes();

	// Define day as between 7:00 AM and 7:00 PM
	const dayStart = 7 * 60; // 7:00 AM in minutes
	const dayEnd = 19 * 60; // 7:00 PM in minutes

	return minutesSinceMidnight >= dayStart && minutesSinceMidnight < dayEnd;
}

export function useTheme() {
	const now = useClock();
	const theme = isDay(now) ? "day" : "night";
	applyTheme(theme);
	return theme;
}

function applyTheme(theme: string) {
	document.documentElement.dataset.theme = theme;
	localStorage.setItem("okaeri-theme", theme);
}
