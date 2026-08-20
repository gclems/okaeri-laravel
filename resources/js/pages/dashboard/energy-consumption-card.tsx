import { EnergyIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "shanty-ui";

function EnergyConsumptionCard() {
	return (
		<Card className="bg-linear-to-b from-energy/20 to-transparent">
			<Card.Header
				title={
					<div className="flex items-center gap-x-2">
						<HugeiconsIcon icon={EnergyIcon} /> Énergie
					</div>
				}
			/>
			<Card.Body>
				<div className="flex items-center justify-center h-full w-full text-muted">
					Todo
				</div>
			</Card.Body>
		</Card>
	);
}

export { EnergyConsumptionCard };
