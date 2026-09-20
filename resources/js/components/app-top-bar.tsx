import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Card } from "shanty-ui";

function AppTopBar() {
	return (
		<Card size="xs" className="shrink-0">
			<Card.Body className="min-h-4">
				<div className="flex items-center justify-between gap-x-4">
					<Button
						size="sm"
						variant="ghost"
						color="primary"
						square
						onClick={() => window.location.reload()}
					>
						<HugeiconsIcon icon={RefreshIcon} />
					</Button>
				</div>
			</Card.Body>
		</Card>
	);
}

export { AppTopBar };
