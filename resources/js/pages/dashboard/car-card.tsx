import { useEffect } from "react";

import {
	ArrowRight04Icon,
	AutomotiveBattery02Icon,
	ElectricPlugsIcon,
	Login02Icon,
	Plug01Icon,
	RoadIcon,
	UnplugIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { Card, cn } from "shanty-ui";

import { RollingNumber } from "@/components/rolling-number";
import { useDomoStore } from "@/features/domo/domo-store";
import type { Car } from "@/types/projections";
import "leaflet/dist/leaflet.css";

import { getBatteryLevelColor } from "@/features/renault/battery";
import { getChargingTime } from "@/features/renault/charing-time";

function CarCard() {
	const carsMap = useDomoStore((state) => state.carsMap);

	const cars = Array.from(carsMap.values());
	return cars.map((car) => <CarItem key={car.id} car={car} />);
}

function CarItem({ car }: { car: Car }) {
	return (
		<Card className="@container">
			<Card.Header
				title={
					<div>
						<div className="flex gap-x-2 items-center">
							<img
								src="/images/renault_4_small.png"
								alt="Renault 4"
								className="w-10"
							/>{" "}
							Renault 4
						</div>
					</div>
				}
			></Card.Header>

			<Card.Body className=" space-y-2  text-metric">
				<div className="grid @xs:grid-cols-2 gap-1">
					{(car.battery || car.autonomy) && (
						<div className="flex items-center justify-between">
							{car.battery && (
								<div className="flex gap-x-2">
									<HugeiconsIcon icon={AutomotiveBattery02Icon} />
									<div className="flex items-center gap-x-2">
										{car.battery && (
											<span
												className={cn(
													"font-semibold text-lg",
													getBatteryLevelColor(+(car.battery.value ?? 0)),
												)}
											>
												<RollingNumber number={+(car.battery.value ?? 0)} />
												<span>{car.battery.unit ?? ""}</span>
											</span>
										)}
									</div>
								</div>
							)}
							{car.autonomy && (
								<div className="flex gap-x-2">
									<HugeiconsIcon icon={RoadIcon} size="1.25rem" />
									<span className="text-sm text-metric">
										<RollingNumber number={+(car.autonomy.value ?? 0)} />
										<span>{car.autonomy.unit ?? ""}</span>
									</span>
								</div>
							)}
						</div>
					)}

					<PlugAndChargeStatus car={car} />
				</div>
				{car.energyFlapOpened && !car.isPlugged && (
					<div className="flex gap-x-2 text-destructive">
						<HugeiconsIcon icon={Login02Icon} size="1.25rem" /> Trappe ouverte
					</div>
				)}
				{car.coordinates && (
					<div className="col-span-2 w-full aspect-video">
						<MapContainer
							center={[
								+(car.coordinates.latitude ?? 0),
								+(car.coordinates.longitude ?? 0),
							]}
							zoom={16}
							scrollWheelZoom={false}
							dragging={false}
							zoomControl={false}
							attributionControl
							className="h-full w-full"
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
								url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<RecenterMap
								latitude={+(car.coordinates.latitude ?? 0)}
								longitude={+(car.coordinates.longitude ?? 0)}
							/>
							<Marker
								position={[
									+(car.coordinates.latitude ?? 0),
									+(car.coordinates.longitude ?? 0),
								]}
							/>
						</MapContainer>
					</div>
				)}

				{car.mileage && (
					<div className="text-metric font-thin text-base">
						<RollingNumber
							number={+(car.mileage.value ?? 0)}
							formatter={(n) => new Intl.NumberFormat("fr-FR").format(n)}
						/>
						{car.mileage.unit}
					</div>
				)}
			</Card.Body>
		</Card>
	);
}

function PlugAndChargeStatus({ car }: { car: Car }) {
	const isPlugged = car.isPlugged.value;
	const isCharging = car.isCharging.value;
	const chargingTime = getChargingTime(car.remainingChargingMinutes?.value ?? 0);

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-x-1">
					<HugeiconsIcon
						icon={
							isPlugged ? (isCharging ? ElectricPlugsIcon : Plug01Icon) : UnplugIcon
						}
					/>
					<span className="text-sm">
						{isCharging ? "Charge en cours" : isPlugged ? "Branchée" : "Débranchée"}
					</span>
				</div>

				{isCharging && (
					<div className="flex items-center gap-x-1">
						<span>
							{!chargingTime && "???"}
							{!!chargingTime && (
								<span className="font-semibold text-metric">
									<RollingNumber number={chargingTime.hours} />h
									<RollingNumber
										number={chargingTime.minutes}
										formatter={(num) => num.toString().padStart(2, "0")}
									/>
								</span>
							)}
						</span>
					</div>
				)}
			</div>
			<div className="flex items-center gap-x-1">
				{isCharging && (
					<>
						<HugeiconsIcon icon={ArrowRight04Icon} size="1.25rem" />
						<span className="text-sm text-metric">{`${car.targetChargeLevel?.value ?? "?"}%`}</span>
					</>
				)}
			</div>
		</>
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
