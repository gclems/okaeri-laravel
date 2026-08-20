import { SmartAcIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "shanty-ui";

function AirConditioningCard() {
	return (
		<Card className="bg-linear-to-bl to-temperature-low/20 from-transparent">
			<Card.Header
				title={
					<div className="flex items-center gap-x-2">
						<HugeiconsIcon icon={SmartAcIcon} /> Climatisation
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

export { AirConditioningCard };
