import { type ComponentProps, useMemo } from "react";

import Humidity from "@meteocons/svg/fill/humidity.svg";
import Rain from "@meteocons/svg/fill/rain.svg";
import WindSock from "@meteocons/svg/fill/windsock.svg";
import { motion } from "motion/react";
import { Card, cn, Popover, ScrollArea } from "shanty-ui";

import { Meteocon } from "@/components/meteocon";
import { RollingTime } from "@/components/rolling-time";
import { useClock } from "@/features/clock/use-clock";
import { useDomoStore } from "@/features/domo/domo-store";
import {
	getWeatherConditionIcon,
	getWeatherConditionLabel,
} from "@/features/weather/weather-condition";
import type { HourWeatherForecast, WeatherForecast } from "@/types/projections";

function WeatherCard() {
	const weatherForecastsMap = useDomoStore((state) => state.weatherForecastsMap);
	const weatherForecast = useMemo(
		() => Array.from(weatherForecastsMap.values())[0],
		[weatherForecastsMap],
	);

	if (!weatherForecast) return null;

	return (
		<Card size="sm">
			<Card.Body className="w-fit min-w-120">
				<div className="w-full flex flex-row gap-x-4">
					<div className="flex-1">
						<ForecastPopover weatherForecast={weatherForecast} />
					</div>
					<div className="flex flex-col justify-center gap-y-6">
						<ConditionItem>
							<ConditionIcon src={Rain} alt="Pluie" />
							<ConditionValue
								value={weatherForecast.rainChance?.value?.toFixed(0) ?? "–"}
								unit="%"
							/>
						</ConditionItem>
						<ConditionItem>
							<ConditionIcon src={WindSock} alt="Vent" />
							<ConditionValue
								value={weatherForecast.windSpeed?.value?.toFixed(0) ?? "–"}
								unit={weatherForecast.windSpeed?.unit ?? ""}
							/>
						</ConditionItem>
						<ConditionItem>
							<ConditionIcon src={Humidity} alt="Humidité" />
							<ConditionValue
								value={weatherForecast.humidity?.value?.toFixed(0) ?? "–"}
								unit="%"
							/>
						</ConditionItem>
					</div>
					<div className="flex-1 flex flex-col">
						<div className="flex-1">
							<Card.Header
								title={
									<div className="flex items-center gap-x-2 flex-row-reverse w-full">
										<img src="/images/weather_small.png" alt="Météo" /> Météo
									</div>
								}
							/>
						</div>
						<div className="mt-4 flex flex-col items-end justify-end">
							<DatePanel />
						</div>
					</div>
				</div>
				{weatherForecast.alert && weatherForecast.alert.level !== "Vert" && (
					<motion.ul className="space-y-0.5 mt-4">
						{Object.entries(weatherForecast.alert.risks)
							.filter(([_, level]) => level !== "Vert")
							.map(([risk, level]) => (
								<li
									key={risk}
									className={cn(
										"text-metric px-2 rounded-full",
										"flex items-center justify-between",
										{
											"bg-weather-alert-red text-weather-alert-red-foreground":
												level === "Rouge",
											"bg-weather-alert-orange text-weather-alert-orange-foreground":
												level === "Orange",
											"bg-weather-alert-yellow text-weather-alert-yellow-foreground":
												level === "Jaune",
										},
									)}
								>
									<div className="text-xs">Vigilance {level}</div>
									<div className="text-base font-bold">{risk}</div>
								</li>
							))}
					</motion.ul>
				)}
			</Card.Body>
		</Card>
	);
}

function DatePanel() {
	const now = useClock();
	return (
		<div className="text-right">
			<div className="space-x-1 text-metric flex items-baseline">
				<span>
					{now.toLocaleDateString([], {
						weekday: "short",
					})}
				</span>
				<span>
					{now.toLocaleDateString([], {
						day: "2-digit",
					})}
				</span>
				<span>
					{now.toLocaleDateString([], {
						month: "short",
					})}
				</span>
				<span>
					{now.toLocaleDateString([], {
						year: "numeric",
					})}
				</span>
			</div>
			<RollingTime date={now} className="text-2xl font-bold" />
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
				className="flex flex-col justify-center items-center"
			>
				<Meteocon src={conditionIcon} alt={conditionLabel} className="size-16" />
				<div className="mb-3">{conditionLabel}</div>
				<div className="text-metric font-semibold text-4xl">
					{weatherForecast.temperature?.value?.toFixed(0) ?? "–"}
					<span className="text-lg">°C</span>
				</div>
			</Popover.Trigger>

			<Popover.Popup size="sm">
				<div className="flex gap-x-2 items-center">
					<Meteocon src={conditionIcon} alt={conditionLabel} className="size-12" />
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
					<ScrollArea horizontal className="w-full @xl:max-w-90 max-w-60">
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
					<ScrollArea horizontal className="w-full @xl:max-w-90 max-w-60">
						<ul className="flex gap-x-1">
							{weatherForecast.dailyForecasts
								.sort((a, b) => a.date.localeCompare(b.date))
								.map((dailyForecast) => {
									const forecastDate = new Date(dailyForecast.date);

									return (
										<li
											key={dailyForecast.id}
											className="flex flex-col items-center bg-foreground/10 rounded-lg p-1 w-20"
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

function ConditionItem(props: Omit<ComponentProps<"div">, "className">) {
	return <div className="flex gap-x-1" {...props} />;
}

function ConditionIcon(
	props: Omit<ComponentProps<typeof Meteocon>, "className">,
) {
	return <Meteocon className="size-6" {...props} />;
}

function ConditionValue({ value, unit }: { value: string; unit?: string }) {
	return (
		<div className="text-metric">
			<div>
				{value ?? "–"}
				<span className="text-xs">{unit}</span>
			</div>
		</div>
	);
}

export { WeatherCard };
