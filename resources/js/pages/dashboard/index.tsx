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

			<div className="mt-4">
				<div className="flex gap-2 flex-col lg:flex-row">
					<div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2 content-start">
						<div className="lg:block hidden" />
						<ComfortCard />
						<AirConditioningCard />

						<div className="lg:col-span-2">
							<CarCard />
						</div>

						<LightingCard />
						<BatteriesCard />
					</div>
					<div className="lg:w-72 space-y-2">
						<DoorCard />
						<EnergyConsumptionCard />
						<NetworkCard />
					</div>
				</div>
			</div>
		</>
	);
}
