import { useMemo } from "react";

import { Icon } from "@iconify/react";
import { Card, cn } from "shanty-ui";

import { useClock } from "@/features/clock/use-clock";
import { useToday } from "@/features/clock/use-today";
import { useDomoStore } from "@/features/domo/domo-store";
import {
	getWeatherConditionIcon,
	getWeatherConditionLabel,
} from "@/features/weather/weather-condition";

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
							<Icon icon="meteocons:dust-day" className="size-8" /> Météo
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
									<Icon
										icon={getWeatherConditionIcon(
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
										<Icon icon="meteocons:humidity-fill" className="size-8" />
										{weatherForecast.humidity?.value?.toFixed(0) ?? "–"}%
									</div>
									<div className="flex items-center gap-x-1 justify-center">
										<Icon icon="meteocons:wind-fill" className="size-8" />
										{weatherForecast.windSpeed?.value?.toFixed(0) ?? "–"}
										<span className="text-xs">{weatherForecast.windSpeed?.unit}</span>
									</div>
									<div className="flex items-center gap-x-1 justify-center">
										<Icon icon="meteocons:umbrella-fill" className="size-8" />
										{weatherForecast.rainChance?.value?.toFixed(0) ?? "–"}%
									</div>
									<div className="flex items-center gap-x-1 justify-center">
										<Icon
											icon={getUvIndexIcon(weatherForecast.uvIndex?.value)}
											className="size-8"
										/>
										UV{weatherForecast.uvIndex?.value ?? "–"}
									</div>
									<div className="flex items-center gap-x-1 justify-center">
										<Icon icon="meteocons:barometer-fill" className="size-8" />
										{weatherForecast.pressure?.value?.toFixed(0) ?? "–"}
										<span className="text-xs">{weatherForecast.pressure?.unit}</span>
									</div>
									{/* <div className="flex items-center gap-x-1 justify-center">
										<Icon icon="meteocons:snowflake-fill" className="size-8" />
										{weatherForecast.snowChance?.value?.toFixed(0) ?? "–"}%
									</div>
									<div className="flex items-center gap-x-1 justify-center">
										<Icon icon="meteocons:thermometer-colder-fill" className="size-8" />
										{weatherForecast.freezeChance?.value?.toFixed(0) ?? "–"}%
									</div> */}
								</div>
							</div>
						) : (
							<div className="text-sm text-muted">Aucune donnée météo</div>
						)}
					</div>
					{!!sunPhase && (
						<div className="grid grid-cols-3 @xl:grid-cols-1 gap-4">
							<PhaseBlock
								icon="meteocons:sunrise-fill"
								time={new Date(sunPhase.sunrise_starts_at)}
							/>
							<PhaseBlock
								icon="meteocons:clear-day-fill"
								time={new Date(sunPhase.solar_noon_at)}
							/>
							<PhaseBlock
								icon="meteocons:sunset-fill"
								time={new Date(sunPhase.sunset_starts_at)}
							/>
						</div>
					)}
				</div>
			</Card.Body>
		</Card>
	);
}

function getUvIndexIcon(value: number | null | undefined): string {
	if (value === null || value === undefined) return "meteocons:uv-index-fill";

	const level = Math.min(11, Math.max(1, Math.round(value)));
	return `meteocons:uv-index-${level}-fill`;
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
			<Icon icon={icon} width="1.5rem" height="1.5rem" />
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
