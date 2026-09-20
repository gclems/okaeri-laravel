import { Card } from "shanty-ui";

function EnergyConsumptionCard() {
	return (
		<Card>
			<Card.Header
				title={
					<div className="flex items-center gap-x-2">
						<img src="/images/energy_small.png" alt="Energy" className="w-8" />{" "}
						Énergie
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
