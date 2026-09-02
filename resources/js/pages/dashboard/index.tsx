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

export default function Welcome() {
	return (
		<>
			<Head title="" />

			<div className="@container mt-6">
				<div className="flex gap-4 flex-col @xl:flex-row">
					<div className="flex-1 grid grid-cols-3 gap-4">
						<div className="col-span-3">
							<WeatherCard />
						</div>

						<AirConditioningCard />

						<EnergyConsumptionCard />

						<LightingCard />

						<CarCard />

						<BatteriesCard />

						<NetworkCard />
					</div>
					<div className="@xl:w-72 space-y-4">
						<DoorCard />
						<ComfortCard />
					</div>
				</div>
			</div>
		</>
	);
}
