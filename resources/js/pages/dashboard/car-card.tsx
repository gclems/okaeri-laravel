import { useEffect } from "react";

import {
	ElectricPlugsIcon,
	Plug01Icon,
	RoadIcon,
	UnplugIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { Card, cn, Separator } from "shanty-ui";

import { RollingNumber } from "@/components/rolling-number";
import { useDomoStore } from "@/features/domo/domo-store";
import type { Car } from "@/types/projections";
import "leaflet/dist/leaflet.css";

import { getChargingTime } from "@/features/renault/charing-time";

const carIcon = L.divIcon({
	html: `<img src="/images/renault_4_map_marker.png" alt="Renault 4" class="size-10 drop-shadow-lg" />`,
	className: "",
	iconSize: [40, 40],
	iconAnchor: [20, 20],
});

const carChargingIcon = L.divIcon({
	html: `<img src="/images/renault_4_map_marker_charging.png" alt="Renault 4" class="size-10 drop-shadow-lg" />`,
	className: "",
	iconSize: [40, 40],
	iconAnchor: [20, 20],
});

function CarCard() {
	const carsMap = useDomoStore((state) => state.carsMap);

	const cars = Array.from(carsMap.values());
	return cars.map((car) => <CarItem key={car.id} car={car} />);
}

function CarItem({ car }: { car: Car }) {
	const batteryLevel = car.battery?.value ?? 0;
	const isPlugged = car.isPlugged.value;
	const isCharging = car.isCharging.value;
	const chargingTime = getChargingTime(car.remainingChargingMinutes?.value ?? 0);

	return (
		<Card className="@container">
			<Card.Body className="flex flex-col @xl:flex-row gap-3">
				{car.coordinates && (
					<div className="flex-1 order-2 @xl:order-1">
						<MapContainer
							center={[car.coordinates.latitude ?? 0, car.coordinates.longitude ?? 0]}
							zoom={16}
							scrollWheelZoom
							dragging
							zoomControl
							attributionControl
							className="h-full w-full"
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
								url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<RecenterMap
								latitude={car.coordinates.latitude ?? 0}
								longitude={car.coordinates.longitude ?? 0}
							/>
							<Marker
								position={[
									car.coordinates.latitude ?? 0,
									car.coordinates.longitude ?? 0,
								]}
								icon={car.isActive ? carChargingIcon : carIcon}
							/>
						</MapContainer>
					</div>
				)}
				<div className="flex-1 order-1 @xl:order-2">
					<div className="flex gap-x-2 items-center text-lg font-semibold">
						<img src="/images/renault_4_small.png" alt="Renault 4" className="w-10" />
						&nbsp; Renault 4
					</div>

					<div className="mt-4 text-metric flex items-baseline justify-between">
						<div
							className={cn("font-semibold text-2xl", {
								"text-destructive": batteryLevel <= 20,
								"text-warning": batteryLevel > 20 && batteryLevel <= 50,
								"text-info": batteryLevel > 50 && batteryLevel < 70,
								"text-success": batteryLevel >= 70,
							})}
						>
							{batteryLevel}
							{car.battery?.unit ?? "%"}
						</div>
						{car.autonomy && (
							<div>
								{/* <HugeiconsIcon icon={RoadIcon} size="1.25rem" /> */}
								<span className="text-sm text-metric">
									~
									<RollingNumber number={+(car.autonomy.value ?? 0)} />
									<span>{car.autonomy.unit ?? ""}</span>
								</span>
							</div>
						)}
					</div>
					<div className="w-full rounded-full h-2 bg-muted/30 overflow-hidden">
						<div
							className={cn("h-full", {
								"bg-destructive": batteryLevel <= 20,
								"bg-warning": batteryLevel > 20 && batteryLevel <= 50,
								"bg-info": batteryLevel > 50 && batteryLevel < 70,
								"bg-success": batteryLevel >= 70,
							})}
							style={{
								width: `${batteryLevel}%`,
							}}
						/>
					</div>

					<div className="flex justify-between mt-4 text-metric text-sm items-center">
						<div className="font-semibold flex">
							<HugeiconsIcon
								icon={
									isPlugged ? (isCharging ? ElectricPlugsIcon : Plug01Icon) : UnplugIcon
								}
								size="1rem"
							/>
							&nbsp;{isPlugged ? "Branchée" : "Débranchée"}
						</div>
						<div className="">{isCharging ? "En charge" : "Pas en charge"}</div>
					</div>
					{(chargingTime.hours > 0 || chargingTime.minutes > 0) && (
						<div className="flex justify-between text-metric text-xs items-center pl-8">
							<div className="font-semibold flex">Temps restant</div>
							<div className="">
								<RollingNumber number={chargingTime.hours} />h
								<RollingNumber
									number={chargingTime.minutes}
									formatter={(num) => num.toString().padStart(2, "0")}
								/>
							</div>
						</div>
					)}

					<Separator className="my-2 bg-border/50" />
					<div className="flex justify-between text-metric text-sm items-center">
						<div className="font-semibold flex">
							<HugeiconsIcon icon={RoadIcon} size="1rem" />
							&nbsp;Kilométrage
						</div>
						<div className="">
							<RollingNumber
								number={+(car.mileage?.value ?? 0)}
								formatter={(n) => new Intl.NumberFormat("fr-FR").format(n)}
							/>
							{car.mileage?.unit ?? "Km"}
						</div>
					</div>

					{car.energyFlapOpened && (
						<div
							className={cn("mt-4 text-metric text-sm", {
								"text-destructive font-semibold text-lg": !isPlugged,
							})}
						>
							Trappe de charge ouverte
						</div>
					)}
				</div>
			</Card.Body>
		</Card>
	);
}

function RecenterMap({
	latitude,
	longitude,
}: {
	latitude: number;
	longitude: number;
}) {
	const map = useMap();

	useEffect(() => {
		map.setView([latitude, longitude]);
	}, [map, latitude, longitude]);

	return null;
}

export { CarCard };
