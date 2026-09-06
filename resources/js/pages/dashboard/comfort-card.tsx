import { useMemo } from "react";

import { HouseHeartIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Icon } from "@iconify/react";
import { Card, cn } from "shanty-ui";

import { RollingNumber } from "@/components/rolling-number";
import { useDomoStore } from "@/features/domo/domo-store";
import type { DomoRoom } from "@/types/models";
import type { ClimateSensor } from "@/types/projections";

type RoomViewModel = {
	room: DomoRoom;
	sensors: ClimateSensor[];
};

function ComfortCard() {
	const climateSensorsMap = useDomoStore((state) => state.climateSensorsMap);
	const roomsMap = useDomoStore((state) => state.domoRoomsMap);
	const viewModels: RoomViewModel[] = useMemo(() => {
		return Array.from(roomsMap.values())
			.map((room) => {
				return {
					room,
					sensors: Array.from(climateSensorsMap.values()).filter(
						(sensor) => sensor.roomId === room.id,
					),
				};
			})
			.filter((vm) => vm.sensors.length > 0)
			.sort((a, b) => a.room.name.localeCompare(b.room.name));
	}, [climateSensorsMap, roomsMap]);

	return (
		<Card className="bg-linear-to-bl to-comfort/20 from-transparent">
			<Card.Header
				title={
					<div className="flex gap-x-2 items-center">
						<HugeiconsIcon icon={HouseHeartIcon} /> Confort
					</div>
				}
			></Card.Header>
			<Card.Body>
				<ul className="space-y-2">
					{viewModels.map((vm) => (
						<li key={vm.room.id}>
							<RoomItem vm={vm} />
						</li>
					))}
				</ul>
			</Card.Body>
		</Card>
	);
}

function RoomItem({ vm }: { vm: RoomViewModel }) {
	return (
		<div className="flex items-center gap-x-4">
			<div className="flex-1 truncate">{vm.room.name}</div>
			<div>
				{vm.sensors.map((sensor) => (
					<div key={sensor.id} className="flex gap-x-2">
						{sensor.thermometer && (
							<div className="flex items-baseline gap-x-1">
								{+(sensor.thermometer.value ?? 0) > 25 && (
									<Icon
										icon="meteocons:thermometer-warmer-fill"
										width="1rem"
										height="1rem"
									/>
								)}
								<span
									className={cn("text-metric text-lg", {
										"text-temperature-excessive": +(sensor.thermometer.value ?? 0) >= 26,
										"text-temperature-low": +(sensor.thermometer.value ?? 0) <= 17,
									})}
								>
									<RollingNumber
										number={+(sensor.thermometer.value ?? 0)}
										formatter={(value) => value.toFixed(1).toString()}
									/>
								</span>
								<span className="text-muted text-xs">
									{sensor.thermometer.unit as string}
								</span>
							</div>
						)}
						{sensor.hygrometer && (
							<div className="flex items-center text-sm">
								<Icon icon="meteocons:humidity-fill" height="2rem" className="-mr-2" />
								<span className="text-metric">
									<RollingNumber
										number={+(sensor.hygrometer.value ?? 0)}
										formatter={(value) => value.toFixed(1).toString()}
									/>
								</span>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export { ComfortCard };
