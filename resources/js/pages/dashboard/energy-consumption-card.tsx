import { Card } from "shanty-ui";

function EnergyConsumptionCard() {
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
				<div className="flex items-center justify-center h-full w-full text-muted">
					Todo
				</div>
			</Card.Body>
		</Card>
	);
}

export { EnergyConsumptionCard };
