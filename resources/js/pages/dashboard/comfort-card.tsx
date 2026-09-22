import { useMemo } from "react";

import Humidity from "@meteocons/svg/fill/humidity.svg";
import Thermometer from "@meteocons/svg/fill/thermometer.svg";
import { Card, cn, Separator } from "shanty-ui";

import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
} from "@/components/embla-carousel";
import { Meteocon } from "@/components/meteocon";
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
		<Card>
			<Card.Header
				title={
					<div className="flex gap-x-2 items-center">
						<img src="/images/comfort_small.png" alt="Confort" className="h-6" />{" "}
						Confort
					</div>
				}
			></Card.Header>
			<Card.Body>
				<Carousel
					opts={{
						loop: true,
					}}
					autoplay
				>
					<CarouselContent>
						{viewModels.map((vm) => (
							<CarouselItem key={vm.room.id}>
								<RoomItem vm={vm} />
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselDots />
				</Carousel>
			</Card.Body>
		</Card>
	);
}

function RoomItem({ vm }: { vm: RoomViewModel }) {
	return (
		<div>
			<div className="text-center text-muted">{vm.room.name}</div>
			<div>
				{vm.sensors.map((sensor) => (
					<div key={sensor.id} className="flex items-center">
						{sensor.thermometer && (
							<div className="flex items-center gap-x-1 flex-1">
								<Meteocon src={Thermometer} alt="Thermometer" className="size-16" />
								<span
									className={cn("text-metric text-xl font-semibold -ml-4", {
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
						{sensor.thermometer && sensor.hygrometer && (
							<Separator orientation="vertical" className="bg-border h-8" />
						)}
						{sensor.hygrometer && (
							<div className="flex items-center text-sm flex-1">
								<Meteocon src={Humidity} alt="Humidity" className="size-12" />
								<span className="text-metric -ml-2 text-xl font-semibold">
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
	);
}

export { ComfortCard };
