import { Card } from "shanty-ui";

function AirConditioningCard({ className }: { className?: string }) {
	return (
		<Card className={className}>
			<Card.Header
				title={
					<>
						<img
							src="/images/air_conditioning_small.png"
							alt="Air Conditioning"
							className="w-8"
						/>{" "}
						Climatisation
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

export { AirConditioningCard };
