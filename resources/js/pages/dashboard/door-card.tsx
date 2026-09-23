import { Card } from "shanty-ui";

function DoorCard() {
	return (
		<Card>
			<Card.Header
				title={
					<>
						<img src="/images/door_small.png" alt="Door" className="h-6" /> Porte
						d'entrée
					</>
				}
			/>
			<Card.Body>
				<div className="flex items-center justify-center h-50 w-full text-muted">
					Todo
				</div>
			</Card.Body>
		</Card>
	);
}

export { DoorCard };
