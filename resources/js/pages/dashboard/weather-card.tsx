import { useMemo } from "react";

import {
	Sun02Icon,
	SunCloud02Icon,
	SunriseIcon,
	SunsetIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Card, cn } from "shanty-ui";

import { useClock } from "@/features/clock/use-clock";
import { useToday } from "@/features/clock/use-today";
import { useDomoStore } from "@/features/domo/domo-store";

function WeatherCard() {
	const sunPhase = useDomoStore((state) => state.sunPhase);
	const today = useToday();

	return (
		<Card>
			<Card.Header
				title={
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-x-2 flex-1 truncate">
							<HugeiconsIcon icon={SunCloud02Icon} /> Météo
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
					<div className="flex-1"></div>
					{!!sunPhase && (
						<div className="grid grid-cols-3 @xl:grid-cols-1 gap-4">
							<PhaseBlock
								icon={SunriseIcon}
								time={new Date(sunPhase.sunrise_starts_at)}
							/>
							<PhaseBlock icon={Sun02Icon} time={new Date(sunPhase.solar_noon_at)} />
							<PhaseBlock
								icon={SunsetIcon}
								time={new Date(sunPhase.sunset_starts_at)}
							/>
						</div>
					)}
				</div>
			</Card.Body>
			<Card.Footer></Card.Footer>
		</Card>
	);
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

function PhaseBlock({ icon, time }: { icon: IconSvgElement; time: Date }) {
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
			<HugeiconsIcon icon={icon} size="1.5rem" />
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
