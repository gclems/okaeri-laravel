import { useMemo } from "react";

import Barometer from "@meteocons/svg/fill/barometer.svg";
import ClearDay from "@meteocons/svg/fill/clear-day.svg";
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
import { Card, cn, Popover, ScrollArea } from "shanty-ui";

import { Meteocon } from "@/components/meteocon";
import { RollingTime } from "@/components/rolling-time";
import { useClock } from "@/features/clock/use-clock";
import { useToday } from "@/features/clock/use-today";
import { useDomoStore } from "@/features/domo/domo-store";
import {
	getWeatherConditionIcon,
	getWeatherConditionLabel,
} from "@/features/weather/weather-condition";
import type { HourWeatherForecast, WeatherForecast } from "@/types/projections";

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
		<Card className="@container relative overflow-hidden bg-transparent bg-none! border-none! before:content-none! h-57.5">
			<Card.Body className="text-white">
				{weatherForecast && (
					<div className="flex flex-col-reverse @lg:flex-row items-center justify-end gap-2">
						<ForecastPopover weatherForecast={weatherForecast} />

						<DatePanel />
					</div>
				)}
			</Card.Body>
			<Card.Footer className="hidden @xl:flex justify-end items-end text-white gap-x-4">
				{weatherForecast && (
					<>
						<ConditionsBar weatherForecast={weatherForecast} />
						<div className="bg-black/20 px-4 rounded-lg w-fit">
							{!!sunPhase && (
								<div className="grid grid-cols-3 gap-4">
									<PhaseBlock
										icon={Sunrise}
										time={new Date(sunPhase.sunrise_starts_at)}
									/>
									<PhaseBlock icon={ClearDay} time={new Date(sunPhase.solar_noon_at)} />
									<PhaseBlock icon={Sunset} time={new Date(sunPhase.sunset_starts_at)} />
								</div>
							)}
						</div>
					</>
				)}
			</Card.Footer>
		</Card>
	);
}

function getUvIndexIcon(value: number | null | undefined): string {
	if (value === null || value === undefined) return UvIndex1;

	const level = Math.min(11, Math.max(1, Math.round(value)));
	return UV_INDEX_ICONS[level - 1];
}

function PhaseBlock({ icon, time }: { icon: string; time: Date }) {
	const now = useClock();
	const isPast = useMemo(() => {
		return time.getTime() < now.getTime();
	}, [time, now]);

	return (
		<div
			className={cn("flex flex-col items-center gap-0.5", {
				"opacity-60": isPast,
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

function DatePanel() {
	const now = useClock();
	return (
		<div className="bg-black/20 p-4 rounded-lg w-fit">
			<div className="space-x-1 text-metric">
				<span className="">
					{now.toLocaleDateString([], {
						weekday: "short",
					})}
				</span>
				<span className="font-semibold text-lg">
					{now.toLocaleDateString([], {
						day: "2-digit",
					})}
				</span>
				<span className="">
					{now.toLocaleDateString([], {
						month: "short",
					})}
				</span>
				<span className="">
					{now.toLocaleDateString([], {
						year: "numeric",
					})}
				</span>
			</div>
			<div className="flex justify-center">
				<RollingTime date={now} className="text-2xl font-bold" />
			</div>
		</div>
	);
}

function ForecastPopover({
	weatherForecast,
}: {
	weatherForecast: WeatherForecast;
}) {
	const now = useClock();

	const currentHour = useMemo(() => {
		const date = new Date(now);
		date.setMinutes(0, 0, 0);
		return date.getTime();
	}, [now]);

	const conditionIcon = getWeatherConditionIcon(
		weatherForecast?.condition?.condition ?? null,
	);

	const conditionLabel = getWeatherConditionLabel(
		weatherForecast?.condition?.condition ?? null,
	);

	const hourlyForecastsByDay = useMemo(() => {
		const grouped: Record<string, HourWeatherForecast[]> = {};

		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 2);
		tomorrow.setHours(0, 0, 0, 0);

		for (const forecast of weatherForecast.hourlyForecasts) {
			const date = new Date(forecast.date);

			if (date.getTime() < currentHour || date.getTime() >= tomorrow.getTime()) {
				continue;
			}

			const day = new Date(date);
			day.setHours(0, 0, 0, 0);
			const dayKey = day.toISOString();

			if (!grouped[dayKey]) {
				grouped[dayKey] = [];
			}

			grouped[dayKey].push(forecast);
		}

		return grouped;
	}, [weatherForecast.hourlyForecasts, currentHour]);

	return (
		<Popover>
			<Popover.Trigger
				nativeButton={false}
				render={<div />}
				className="flex items-center gap-x-1 justify-center bg-black/20 @xl:bg-transparent rounded-lg w-fit px-4"
			>
				<Meteocon src={conditionIcon} alt={conditionLabel} className="size-24" />
				<div className="flex flex-col">
					<span className="text-metric font-semibold text-4xl">
						{weatherForecast.temperature?.value?.toFixed(0) ?? "–"}
						<span className="text-lg">°C</span>
					</span>
					<span className="">{conditionLabel}</span>
				</div>
			</Popover.Trigger>
			<Popover.Popup size="sm">
				<div className="flex gap-x-2 items-center">
					<Meteocon src={conditionIcon} alt={conditionLabel} className="size-24" />
					<div className="text-metric">
						<div className=" font-semibold text-xl">{conditionLabel}</div>
						<div>
							{weatherForecast.minTemperature?.value?.toFixed(0) ?? "–"}
							{weatherForecast.minTemperature?.unit ?? ""}/
							{weatherForecast.maxTemperature?.value?.toFixed(0) ?? "–"}
							{weatherForecast.maxTemperature?.unit ?? ""}
						</div>
					</div>
				</div>

				{hourlyForecastsByDay && (
					<ScrollArea horizontal className="w-full max-w-90">
						<ul className="flex gap-x-1">
							{Object.keys(hourlyForecastsByDay).map((day) => {
								const dayDate = new Date(day);

								return (
									<li key={day}>
										<div className="sticky left-0 w-fit text-metric text-sm">
											{dayDate.toLocaleDateString("fr-FR", {
												weekday: "short",
											})}
										</div>
										<ul className="flex gap-x-1">
											{hourlyForecastsByDay[day].map((hourlyForecast) => {
												const forecastTime = new Date(hourlyForecast.date);
												forecastTime.setMinutes(0, 0, 0);

												return (
													<li
														key={hourlyForecast.id}
														className={cn(
															"flex flex-col items-center bg-black/10 rounded-lg p-1",
															{
																"border-2 border-border bg-primary text-primary-foreground":
																	currentHour === forecastTime.getTime(),
															},
														)}
													>
														<Meteocon
															src={getWeatherConditionIcon(hourlyForecast?.condition ?? null)}
															alt=""
															className="size-6"
														/>
														<div className="text-sm">
															{forecastTime.toLocaleString("fr-FR", {
																hour: "2-digit",
																minute: "2-digit",
															})}
														</div>
														<div className="text-metric text-xs">
															{hourlyForecast.temperature?.toFixed(0) ?? "–"}
															{hourlyForecast.temperatureUnit ?? ""}
														</div>
													</li>
												);
											})}
										</ul>
									</li>
								);
							})}
						</ul>
					</ScrollArea>
				)}

				{weatherForecast.dailyForecasts && (
					<ScrollArea horizontal className="w-full max-w-90 mt-2">
						<ul className="flex gap-x-1">
							{weatherForecast.dailyForecasts
								.sort((a, b) => a.date.localeCompare(b.date))
								.map((dailyForecast) => {
									const forecastDate = new Date(dailyForecast.date);

									return (
										<li
											key={dailyForecast.id}
											className="flex flex-col items-center bg-black/10 rounded-lg p-1 w-20"
										>
											<Meteocon
												src={getWeatherConditionIcon(dailyForecast?.condition ?? null)}
												alt=""
												className="size-6"
											/>
											<div className="text-sm">
												{forecastDate.toLocaleDateString("fr-FR", {
													weekday: "short",
													day: "2-digit",
													month: "2-digit",
												})}
											</div>

											<div className="text-metric text-sm">
												{dailyForecast.temperature?.toFixed(0) ?? "–"}
												{dailyForecast.temperatureUnit ?? ""}
											</div>
										</li>
									);
								})}
						</ul>
					</ScrollArea>
				)}
			</Popover.Popup>
		</Popover>
	);
}

function ConditionsBar({
	weatherForecast,
}: {
	weatherForecast: WeatherForecast;
}) {
	return (
		<div className="flex bg-black/20 px-4 items-center rounded-lg w-fit gap-x-4">
			<div className="flex gap-x-0.5 items-center">
				<Meteocon src={Humidity} alt="Humidité" className="size-8" />
				{weatherForecast.humidity?.value?.toFixed(0) ?? "–"}%
			</div>
			<div className="flex gap-x-0.5 items-center">
				<Meteocon src={Wind} alt="Vent" className="size-8" />
				{weatherForecast.windSpeed?.value?.toFixed(0) ?? "–"}
				<span className="text-xs">{weatherForecast.windSpeed?.unit}</span>
			</div>
			<div className="flex gap-x-0.5 items-center">
				<Meteocon src={Umbrella} alt="Pluie" className="size-8" />
				{weatherForecast.rainChance?.value?.toFixed(0) ?? "–"}%
			</div>
			<div className="flex gap-x-0.5 items-center">
				<Meteocon
					src={getUvIndexIcon(weatherForecast.uvIndex?.value)}
					alt="Indice UV"
					className="size-8"
				/>
				UV{weatherForecast.uvIndex?.value ?? "–"}
			</div>
			<div className="flex gap-x-0.5 items-center">
				<Meteocon src={Barometer} alt="Pression" className="size-8" />
				{weatherForecast.pressure?.value?.toFixed(0) ?? "–"}
				<span className="text-xs">{weatherForecast.pressure?.unit}</span>
			</div>
		</div>
	);
}

export { WeatherCard };
