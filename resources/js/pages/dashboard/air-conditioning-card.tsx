import { Card } from "shanty-ui";

function AirConditioningCard() {
	return (
		<Card>
			<Card.Header
				title={
					<div className="flex items-center gap-x-2">
						<img
							src="/images/air_conditioning_small.png"
							alt="Air Conditioning"
							className="w-8"
						/>{" "}
						Climatisation
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
