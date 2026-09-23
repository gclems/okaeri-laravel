import { Head } from "@inertiajs/react";

import { AirConditioningCard } from "./air-conditioning-card";
import { BatteriesCard } from "./batteries-card";
import { CarCard } from "./car-card";
import { ComfortCard } from "./comfort-card";
import { DoorCard } from "./door-card";
import { EnergyConsumptionCard } from "./energy-consumption-card";
import { LightingCard } from "./lighting-card";
import { NetworkCard } from "./network-card";
import { WeatherCard } from "./weather-card";

export default function Dashboard() {
	return (
		<>
			<Head title="" />

			<div className="flex justify-end">
				<WeatherCard />
			</div>

			<div className="@container mt-10">
				<div className="flex gap-2 flex-col @xl:flex-row">
					<div className="flex-1 grid grid-cols-3 gap-2 content-start">
						<div />
						<ComfortCard />
						<AirConditioningCard />

						<div className="col-span-2">
							<CarCard />
						</div>
						<LightingCard />
						<BatteriesCard />
					</div>
					<div className="@xl:w-72 space-y-2">
						<DoorCard />
						<EnergyConsumptionCard />
						<NetworkCard />
					</div>
				</div>
			</div>
		</>
	);
}
