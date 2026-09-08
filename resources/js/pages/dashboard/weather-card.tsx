import { useMemo } from "react";

import Barometer from "@meteocons/svg/fill/barometer.svg";
import ClearDay from "@meteocons/svg/fill/clear-day.svg";
import DustDay from "@meteocons/svg/fill/dust-day.svg";
import Humidity from "@meteocons/svg/fill/humidity.svg";
import Sunrise from "@meteocons/svg/fill/sunrise.svg";
import Sunset from "@meteocons/svg/fill/sunset.svg";
import Umbrella from "@meteocons/svg/fill/umbrella.svg";
import UvIndex1 from "@meteocons/svg/fill/uv-index-1.svg";
import UvIndex2 from "@meteocons/svg/fill/uv-index-2.svg";
import UvIndex3 from "@meteocons/svg/fill/uv-index-3.svg";
import UvIndex4 from "@meteocons/svg/fill/uv-index-4.svg";
import UvIndex5 from "@meteocons/svg/fill/uv-index-5.svg";
import UvIndex6 from "@meteocons/svg/fill/uv-index-6.svg";
import UvIndex7 from "@meteocons/svg/fill/uv-index-7.svg";
import UvIndex8 from "@meteocons/svg/fill/uv-index-8.svg";
import UvIndex9 from "@meteocons/svg/fill/uv-index-9.svg";
import UvIndex10 from "@meteocons/svg/fill/uv-index-10.svg";
import UvIndex11 from "@meteocons/svg/fill/uv-index-11.svg";
import Wind from "@meteocons/svg/fill/wind.svg";
import { Card, cn } from "shanty-ui";

import { Meteocon } from "@/components/meteocon";
import { useClock } from "@/features/clock/use-clock";
import { useToday } from "@/features/clock/use-today";
import { useDomoStore } from "@/features/domo/domo-store";
import {
	getWeatherConditionIcon,
	getWeatherConditionLabel,
} from "@/features/weather/weather-condition";

const UV_INDEX_ICONS = [
	UvIndex1,
	UvIndex2,
	UvIndex3,
	UvIndex4,
	UvIndex5,
	UvIndex6,
	UvIndex7,
	UvIndex8,
	UvIndex9,
	UvIndex10,
	UvIndex11,
];

function WeatherCard() {
	const today = useToday();
	const sunPhasesMap = useDomoStore((state) => state.sunPhasesMap);
	const sunPhase = sunPhasesMap.get(today.toISOString());

	const weatherForecastsMap = useDomoStore((state) => state.weatherForecastsMap);
	const weatherForecast = useMemo(
		() => Array.from(weatherForecastsMap.values())[0],
		[weatherForecastsMap],
	);

	return (
		<Card>
			<Card.Header
				title={
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-x-2 flex-1 truncate">
							<Meteocon src={DustDay} alt="Météo" className="size-8" /> Météo
						</div>
						<div className="text-xs text-muted relative">
							{today.toLocaleDateString([], {
								weekday: "long",
								day: "2-digit",
								month: "long",
								year: "numeric",
							})}

							<DayProgress />
						</div>
					</div>
				}
			/>
			<Card.Body className="@container">
				<div className="flex flex-col @xl:flex-row">
					<div className="flex-1">
						{weatherForecast ? (
							<div className="flex flex-col @lg:flex-row items-center gap-x-4">
								<div className="flex items-center gap-x-1 justify-center">
									<Meteocon
										src={getWeatherConditionIcon(
											weatherForecast.condition?.condition ?? null,
										)}
										alt={getWeatherConditionLabel(
											weatherForecast.condition?.condition ?? null,
										)}
										className="size-24"
									/>
									<div className="flex flex-col">
										<span className="text-metric font-semibold text-4xl">
											{weatherForecast.temperature?.value?.toFixed(0) ?? "–"}
											<span className="text-lg text-muted">°C</span>
										</span>
										<span className="text-muted">
											{getWeatherConditionLabel(
												weatherForecast.condition?.condition ?? null,
											)}
										</span>
									</div>
								</div>
								<div className="grid @lg:grid-cols-2 grid-cols-3 gap-x-4 gap-y-1 text-sm text-muted text-metric w-full">
									<div className="flex items-center gap-x-1 justify-center">
										<Meteocon src={Humidity} alt="Humidité" className="size-8" />
										{weatherForecast.humidity?.value?.toFixed(0) ?? "–"}%
									</div>
									<div className="flex items-center gap-x-1 justify-center">
										<Meteocon src={Wind} alt="Vent" className="size-8" />
										{weatherForecast.windSpeed?.value?.toFixed(0) ?? "–"}
										<span className="text-xs">{weatherForecast.windSpeed?.unit}</span>
									</div>
									<div className="flex items-center gap-x-1 justify-center">
										<Meteocon src={Umbrella} alt="Pluie" className="size-8" />
										{weatherForecast.rainChance?.value?.toFixed(0) ?? "–"}%
									</div>
									<div className="flex items-center gap-x-1 justify-center">
										<Meteocon
											src={getUvIndexIcon(weatherForecast.uvIndex?.value)}
											alt="Indice UV"
											className="size-8"
										/>
										UV{weatherForecast.uvIndex?.value ?? "–"}
									</div>
									<div className="flex items-center gap-x-1 justify-center">
										<Meteocon src={Barometer} alt="Pression" className="size-8" />
										{weatherForecast.pressure?.value?.toFixed(0) ?? "–"}
										<span className="text-xs">{weatherForecast.pressure?.unit}</span>
									</div>
								</div>
							</div>
						) : (
							<div className="text-sm text-muted">Aucune donnée météo</div>
						)}
					</div>
					{!!sunPhase && (
						<div className="grid grid-cols-3 @xl:grid-cols-1 gap-4">
							<PhaseBlock icon={Sunrise} time={new Date(sunPhase.sunrise_starts_at)} />
							<PhaseBlock icon={ClearDay} time={new Date(sunPhase.solar_noon_at)} />
							<PhaseBlock icon={Sunset} time={new Date(sunPhase.sunset_starts_at)} />
						</div>
					)}
				</div>
			</Card.Body>
		</Card>
	);
}

function getUvIndexIcon(value: number | null | undefined): string {
	if (value === null || value === undefined) return UvIndex1;

	const level = Math.min(11, Math.max(1, Math.round(value)));
	return UV_INDEX_ICONS[level - 1];
}

function DayProgress() {
	const currentDate = useClock();

	const dayProgression = useMemo(() => {
		const day = new Date(currentDate);

		const nowTime = day.getTime();

		day.setHours(0, 0, 0, 0);
		const startOfDayTime = day.getTime();

		day.setDate(day.getDate() + 1);
		const endOfDayTime = day.getTime();

		return (
			((nowTime - startOfDayTime) / (endOfDayTime - startOfDayTime)) *
			100
		).toFixed(2);
	}, [currentDate]);

	return (
		<>
			<div className="absolute -bottom-1 left-0 right-0" />
			<div
				className="absolute -bottom-0.5 left-0 h-px bg-primary"
				style={{ width: `calc(${dayProgression}% - 0.125rem)` }}
			/>
			<div
				className="absolute -bottom-1 size-1 rounded-full bg-primary"
				style={{ left: `calc(${dayProgression}% - 0.125rem)` }}
			/>
		</>
	);
}

function PhaseBlock({ icon, time }: { icon: string; time: Date }) {
	const now = useClock();
	const isPast = useMemo(() => {
		return time.getTime() < now.getTime();
	}, [time, now]);

	return (
		<div
			className={cn("flex flex-col @xl:flex-row items-center gap-0.5", {
				"text-muted": isPast,
			})}
		>
			<Meteocon src={icon} alt="" className="size-6" />
			<div className="text-metric text-sm">
				{time.toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				})}
			</div>
		</div>
	);
}

export { WeatherCard };
