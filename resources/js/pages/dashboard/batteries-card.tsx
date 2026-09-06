import { useMemo } from "react";

import {
	BatteryEmptyIcon,
	BatteryFullIcon,
	BatteryLowIcon,
	BatteryMedium01Icon,
	BatteryMedium02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, cn } from "shanty-ui";

import { useDomoStore } from "@/features/domo/domo-store";
import { clamp } from "@/helpers/numbers";
import type {
	Car,
	ClimateSensor,
	LightBulb,
	SwitchDevice,
} from "@/types/projections";

function BatteriesCard() {
	const lightsMap = useDomoStore((state) => state.lightsMap);
	const climateSensorsMap = useDomoStore((state) => state.climateSensorsMap);
	const carsMap = useDomoStore((state) => state.carsMap);
	const switchesMap = useDomoStore((state) => state.switchesMap);
	const domoRoomsMap = useDomoStore((state) => state.domoRoomsMap);

	const devicesWithBattery: (LightBulb | Car | ClimateSensor | SwitchDevice)[] =
		useMemo(() => {
			return [
				...Array.from(lightsMap.values()),
				...Array.from(climateSensorsMap.values()),
				...Array.from(carsMap.values()),
				...Array.from(switchesMap.values()),
			]
				.filter((device) => !!device.battery)
				.sort((a, b) => (a.battery?.value ?? 0) - (b.battery?.value ?? 0));
		}, [lightsMap, climateSensorsMap, carsMap, switchesMap]);

	if (devicesWithBattery.length === 0) return null;

	return (
		<Card className="bg-linear-to-tl from-transparent to-energy/20">
			<Card.Header
				title={
					<div className="flex items-center gap-x-2">
						<HugeiconsIcon icon={BatteryMedium01Icon} /> Batteries
					</div>
				}
			/>
			<Card.Body>
				<ul className="space-y-2">
					{devicesWithBattery.map((device) => {
						const battery = device.battery;
						if (!battery) return null;
						if (battery.value === undefined || battery.value === null) return null;

						let textColor = "text-current";
						if (battery.value <= 20) {
							textColor = "text-destructive";
						} else if (battery.value <= 50) {
							textColor = "text-warning";
						}

						const roomName = device.roomId
							? domoRoomsMap.get(device.roomId)?.name
							: undefined;

						return (
							<li
								key={battery.id}
								className={cn("flex items-center justify-between gap-x-2", {
									"font-semibold": battery.value <= 50,
									"font-bold": battery.value <= 20,
								})}
								style={{
									opacity: `${clamp(120 - battery.value, 20, 100)}%`,
								}}
							>
								<div className="flex flex-col">
									<span className="text-xs">{device.name}</span>
									{roomName && <span className="text-muted text-xs">{roomName}</span>}
								</div>
								<span
									className={cn(
										"text-metric text-sm flex items-center gap-x-1",
										textColor,
									)}
								>
									{battery.value.toFixed(0)}
									<span className="text-xs">%</span>
									<HugeiconsIcon
										size={28}
										className="-rotate-90"
										icon={
											battery.value > 80
												? BatteryFullIcon
												: battery.value > 60
													? BatteryMedium02Icon
													: battery.value > 30
														? BatteryMedium01Icon
														: battery.value > 5
															? BatteryLowIcon
															: BatteryEmptyIcon
										}
									/>
								</span>
							</li>
						);
					})}
				</ul>
			</Card.Body>
		</Card>
	);
}

export { BatteriesCard };
