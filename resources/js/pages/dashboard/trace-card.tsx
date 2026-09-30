import { useMemo } from "react";

import { Card, cn } from "shanty-ui";

import { Trace } from "@/components/trace";
import { useDomoStore } from "@/features/domo/domo-store";

const MAX_DISPLAYED_TRACES = 10;

function TraceCard() {
	const tracesMap = useDomoStore((state) => state.tracesMap);

	const traces = useMemo(
		() =>
			Array.from(tracesMap.values())
				.sort(
					(a, b) =>
						new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime() ||
						b.id - a.id,
				)
				.slice(0, MAX_DISPLAYED_TRACES),
		[tracesMap],
	);

	return (
		<Card>
			<Card.Header
				title={
					<>
						{/* <img src="/images/router_small.png" alt="Router" className="h-6" />  */}
						Historique
					</>
				}
			/>
			<Card.Body>
				{traces.length === 0 ? (
					<div className="flex items-center justify-center h-50 w-full text-muted">
						Aucun événement
					</div>
				) : (
					<ul className="space-y-2">
						{traces.map((event) => (
							<li
								key={event.id}
								className={cn(
									"w-full relative",
									"hover:before:absolute hover:before:-inset-1 hover:before:block hover:before:-skew-y-0.8",
									"hover:before:bg-primary/10",
								)}
							>
								<Trace event={event} />
							</li>
						))}
					</ul>
				)}
			</Card.Body>
		</Card>
	);
}

export { TraceCard };
