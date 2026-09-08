import ClearDay from "@meteocons/svg/fill/clear-day.svg";
import ClearNight from "@meteocons/svg/fill/clear-night.svg";
import Cloudy from "@meteocons/svg/fill/cloudy.svg";
import ExtremeRain from "@meteocons/svg/fill/extreme-rain.svg";
import Fog from "@meteocons/svg/fill/fog.svg";
import Hail from "@meteocons/svg/fill/hail.svg";
import Hurricane from "@meteocons/svg/fill/hurricane.svg";
import NotAvailable from "@meteocons/svg/fill/not-available.svg";
import PartlyCloudyDay from "@meteocons/svg/fill/partly-cloudy-day.svg";
import Rain from "@meteocons/svg/fill/rain.svg";
import Sleet from "@meteocons/svg/fill/sleet.svg";
import Snow from "@meteocons/svg/fill/snow.svg";
import Thunderstorms from "@meteocons/svg/fill/thunderstorms.svg";
import ThunderstormsOvercast from "@meteocons/svg/fill/thunderstorms-overcast.svg";
import Wind from "@meteocons/svg/fill/wind.svg";

import type { WeatherConditionType } from "@/types/projections";

const WEATHER_CONDITION_ICONS: Record<WeatherConditionType, string> = {
	sunny: ClearDay,
	"clear-night": ClearNight,
	partlycloudy: PartlyCloudyDay,
	cloudy: Cloudy,
	fog: Fog,
	windy: Wind,
	"windy-variant": Wind,
	rainy: Rain,
	pouring: ExtremeRain,
	lightning: Thunderstorms,
	"lightning-rainy": ThunderstormsOvercast,
	hail: Hail,
	snowy: Snow,
	"snowy-rainy": Sleet,
	exceptional: Hurricane,
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
	return condition ? WEATHER_CONDITION_ICONS[condition] : NotAvailable;
}

function getWeatherConditionLabel(
	condition: WeatherConditionType | null,
): string {
	return condition ? WEATHER_CONDITION_LABELS[condition] : "Inconnu";
}

export { getWeatherConditionIcon, getWeatherConditionLabel };
