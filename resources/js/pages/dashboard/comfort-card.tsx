import { useMemo } from "react";

import { DropletIcon, HouseHeartIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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
	console.log(climateSensorsMap, roomsMap);
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

	console.log(viewModels);

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
		<li>
			<div className="flex items-center gap-x-4">
				<div className="flex-1 truncate">{vm.room.name}</div>
				<div>
					{vm.sensors.map((sensor) => (
						<div key={sensor.id} className="flex gap-x-2">
							{sensor.thermometer && (
								<div className="flex items-baseline gap-x-1">
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
								<div className="flex items-center gap-x-1 text-sm">
									<HugeiconsIcon
										icon={DropletIcon}
										size="0.75rem"
										className="fill-humidity text-white"
									/>
									<span className="text-metric">
										<RollingNumber
											number={+(sensor.hygrometer.value ?? 0)}
											formatter={(value) => value.toFixed(1).toString()}
										/>
									</span>
									<span className="text-muted text-xs">
										{sensor.hygrometer.unit as string}
									</span>
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</li>
	);
}

export { ComfortCard };
