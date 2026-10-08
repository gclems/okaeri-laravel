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
				<div className="@container w-full md:w-4/5 lg:w-1/2 2xl:w-1/3 flex justify-end max-w-130">
					<WeatherCard />
				</div>
			</div>

			<div className="flex gap-(--dashboard-spacing) flex-col lg:flex-row">
				<div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-(--dashboard-spacing) content-start">
					<div className="lg:block hidden order-1" />
					<ComfortCard className="order-2" />
					<AirConditioningCard className="order-5 md:order-3" />

					<div className="md:col-span-2 order-4">
						<CarCard />
					</div>

					<LightingCard className="order-3 md:order-5" />
					{/* <div className="col-span-2">
							<TraceCard />
						</div> */}
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-(--dashboard-spacing) lg:block lg:w-72 lg:space-y-(--dashboard-spacing)">
					<DoorCard />
					<BatteriesCard />
					<EnergyConsumptionCard />
					<NetworkCard />
				</div>
			</div>
		</div>
	);
}
