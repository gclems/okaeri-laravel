import { DoorIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "shanty-ui";

function DoorCard() {
	return (
		<Card className="bg-linear-to-br from-transparent to-security/10">
			<Card.Header
				title={
					<div className="flex items-center gap-x-2">
						<HugeiconsIcon icon={DoorIcon} /> Porte d'entrée
					</div>
				}
			/>
			<Card.Body>
				<div className="flex items-center justify-center h-80 w-full text-muted">
					Todo
				</div>
			</Card.Body>
		</Card>
	);
}

export { DoorCard };
