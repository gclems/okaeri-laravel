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
		<div className="[--dashboard-spacing:1rem]">
			<Head title="" />

			<div className="flex justify-end my-(--dashboard-spacing)">
				<div className="@container w-full md:w-4/5 lg:w-1/2 xl:w-1/3 flex justify-end max-w-130">
					<WeatherCard />
				</div>
			</div>

			<div>
				<div className="flex gap-(--dashboard-spacing) flex-col lg:flex-row">
					<div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--dashboard-spacing) content-center">
						<div className="lg:block hidden" />
						<ComfortCard />
						<AirConditioningCard />

						<div className="md:col-span-2">
							<CarCard />
						</div>

						<LightingCard />
						<BatteriesCard />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-(--dashboard-spacing) lg:block lg:w-72 lg:space-y-(--dashboard-spacing)">
						<DoorCard />
						<EnergyConsumptionCard />
						<NetworkCard />
					</div>
				</div>
			</div>
		</div>
	);
}
