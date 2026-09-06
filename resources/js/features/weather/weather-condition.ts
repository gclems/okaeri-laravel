import type { WeatherConditionType } from "@/types/projections";

// Meteocons (https://iconify.design/icon-sets/meteocons/, MIT) icon names,
// used via the "meteocons:" Iconify prefix.
const WEATHER_CONDITION_ICONS: Record<WeatherConditionType, string> = {
	sunny: "clear-day-fill",
	"clear-night": "clear-night-fill",
	partlycloudy: "partly-cloudy-day-fill",
	cloudy: "cloudy-fill",
	fog: "fog-fill",
	windy: "wind-fill",
	"windy-variant": "wind-fill",
	rainy: "rain-fill",
	pouring: "extreme-rain-fill",
	lightning: "thunderstorms-fill",
	"lightning-rainy": "thunderstorms-overcast-fill",
	hail: "hail-fill",
	snowy: "snow-fill",
	"snowy-rainy": "sleet-fill",
	exceptional: "hurricane-fill",
};

const WEATHER_CONDITION_LABELS: Record<WeatherConditionType, string> = {
	sunny: "Ensoleillé",
	"clear-night": "Ciel dégagé",
	partlycloudy: "Partiellement nuageux",
	cloudy: "Nuageux",
	fog: "Brouillard",
	windy: "Venteux",
	"windy-variant": "Venteux",
	rainy: "Pluvieux",
	pouring: "Fortes pluies",
	lightning: "Orageux",
	"lightning-rainy": "Orages et pluie",
	hail: "Grêle",
	snowy: "Neigeux",
	"snowy-rainy": "Neige et pluie",
	exceptional: "Conditions exceptionnelles",
};

function getWeatherConditionIcon(
	condition: WeatherConditionType | null,
): string {
	return `meteocons:${condition ? WEATHER_CONDITION_ICONS[condition] : "not-available-fill"}`;
}

function getWeatherConditionLabel(
	condition: WeatherConditionType | null,
): string {
	return condition ? WEATHER_CONDITION_LABELS[condition] : "Inconnu";
}

export { getWeatherConditionIcon, getWeatherConditionLabel };
