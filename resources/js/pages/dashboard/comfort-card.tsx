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
					<>
						<img src="/images/comfort_small.png" alt="Confort" /> Confort
					</>
				}
			/>
			<Card.Body className="px-0!">
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
					<div className="mt-4">
						<CarouselDots />
					</div>
				</Carousel>
			</Card.Body>
		</Card>
	);
}

function RoomItem({ vm }: { vm: RoomViewModel }) {
	return (
		<div className="@container space-y-2">
			<div className="text-center">{vm.room.name}</div>
			<div>
				{vm.sensors.map((sensor) => (
					<div key={sensor.id} className="flex items-center">
						{sensor.thermometer && (
							<div className="flex items-center justify-center gap-x-1 flex-1">
								<Meteocon src={Thermometer} alt="Thermometer" className="size-8" />
								<span
									className={cn("text-metric text-lg @md:text-2xl font-semibold", {
										"text-temperature-excessive": +(sensor.thermometer.value ?? 0) >= 26,
										"text-temperature-low": +(sensor.thermometer.value ?? 0) <= 17,
									})}
								>
									<RollingNumber
										number={+(sensor.thermometer.value ?? 0)}
										formatter={(value) => value.toFixed(1).toString()}
									/>
								</span>
								<span className="text-muted">
									&nbsp;{sensor.thermometer.unit as string}
								</span>
							</div>
						)}
						{sensor.thermometer && sensor.hygrometer && (
							<Separator orientation="vertical" className="bg-border h-8" />
						)}
						{sensor.hygrometer && (
							<div className="flex items-center justify-center text-sm flex-1">
								<Meteocon src={Humidity} alt="Humidity" className="size-8" />
								<span className="text-metric text-lg @md:text-2xl font-semibold">
									<RollingNumber
										number={+(sensor.hygrometer.value ?? 0)}
										formatter={(value) => value.toFixed(1).toString()}
									/>
								</span>
								<span className="text-muted">
									&nbsp;{sensor.hygrometer.unit as string}
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
