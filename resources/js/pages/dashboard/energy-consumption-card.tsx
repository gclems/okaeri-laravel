import { Card } from "shanty-ui";

import { useDomoStore } from "@/features/domo/domo-store";
import type { ElectricityMeter } from "@/types/projections";

function EnergyConsumptionCard() {
	const energyMeters = useDomoStore((state) => state.electricityMetersMap);

	return (
		<Card>
			<Card.Header
				title={
					<>
						<img src="/images/energy_small.png" alt="Energy" className="w-8" />{" "}
						Énergie
					</>
				}
			/>
			<Card.Body>
				{Array.from(energyMeters.values()).map((meter: ElectricityMeter) => (
					<div
						key={meter.id}
						className="flex flex-col items-center justify-center h-full w-full"
					>
						<div className="Puissance">
							<span className="text-metric text-3xl font-semibold">
								{meter.apparentPower?.value}
							</span>{" "}
							<span className="">{meter.apparentPower?.unit}</span>
						</div>
						<div className="flex w-full items-baseline gap-x-2">
							<div className="text-xs">Conso. totale</div>
							<div className="flex-1 border-b border-dotted"></div>
							<div>
								<span className="text-metric font-semibold">
									{meter.consumption?.value}
								</span>
								<span className="text-sm">{meter.consumption?.unit}</span>
							</div>
						</div>
					</div>
				))}
			</Card.Body>
		</Card>
	);
}

export { EnergyConsumptionCard };
