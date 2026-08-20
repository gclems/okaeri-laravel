import { BatteryMedium01Icon, DoorIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { Head } from "@inertiajs/react";
import { Card } from "shanty-ui";

import { AirConditioningCard } from "./air-conditioning-card";
import { CarCard } from "./car-card";
import { ComfortCard } from "./comfort-card";
import { EnergyConsumptionCard } from "./energy-consumption-card";
import { LightingCard } from "./lighting-card";
import { WeatherCard } from "./weather-card";

export default function Welcome() {
	return (
		<>
			<Head title="" />

			<div className="@container mt-6">
				<div className="flex gap-4 flex-col @xl:flex-row">
					<div className="flex-1 space-x-4 space-y-4">
						<WeatherCard />
						<div className="grid grid-cols-3 gap-4">
							<AirConditioningCard />
							<EnergyConsumptionCard />
							<LightingCard />
						</div>
						<div className="grid grid-cols-3 gap-4">
							<CarCard />
							<TemporaryCard
								icon={BatteryMedium01Icon}
								title="Batteries"
							></TemporaryCard>
						</div>
					</div>
					<div className="@xl:w-72 space-y-4">
						<TemporaryCard icon={DoorIcon} title="Porte d'entrée"></TemporaryCard>
						<ComfortCard />
					</div>
				</div>
			</div>
		</>
	);
}

function TemporaryCard({
	icon,
	title,
	children,
}: {
	icon: IconSvgElement;
	title: React.ReactNode;
	children?: React.ReactNode;
}) {
	return (
		<Card>
			<Card.Header
				title={
					<div className="flex items-center gap-x-2">
						<HugeiconsIcon icon={icon} /> {title}
					</div>
				}
			/>
			{children}
		</Card>
	);
}
