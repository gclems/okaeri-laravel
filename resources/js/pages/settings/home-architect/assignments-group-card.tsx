import { Card, cn } from "shanty-ui";

import { getDomoEntityAssignmentRoleLabel } from "@/features/domo-entity-assignment-role";
import { useDomoStore } from "@/features/domo/domo-store";
import type { DomoDevice, DomoRoom } from "@/types/models";

import { AddAssignmentButton } from "./add-assignment-button";
import { RenameRoomButton } from "./rename-room-button";

function AssignmentsGroupCard({
	title,
	room,
}: {
	title?: React.ReactNode;
	room?: DomoRoom | null;
}) {
	const assignments = Array.from(
		useDomoStore((state) => state.assignmentsMap).values(),
	);
	const roomsAssignments = assignments.filter(
		(a) => a.domo_room_id === (room?.id ?? null),
	);
	const entitiesMap = useDomoStore((state) => state.entitiesMap);

	const devices = Array.from(useDomoStore((state) => state.devicesMap).values());
	const devicesByHaId = devices.reduce(
		(acc, device) => {
			acc[device.ha_id] = device;
			return acc;
		},
		{} as Record<string, DomoDevice>,
	);

	return (
		<Card
			className={cn("group", {
				"border-dashed": !room,
			})}
		>
			<Card.Header
				title={
					<div className="flex gap-4">
						<div className="flex-1 truncate">{title ?? room?.name ?? ""}</div>
						{!!room && <RenameRoomButton room={room} />}
					</div>
				}
			/>

			<Card.Body>
				<ul className="space-y-1">
					{roomsAssignments.map((assignment) => {
						const entity = entitiesMap.get(assignment.domo_entity_id);
						return (
							<li key={assignment.id}>
								<div className="font-semibold text-sm">
									{getDomoEntityAssignmentRoleLabel(assignment.role)}
								</div>
								<div className="space-x-2">
									<span className="text-metric text-sm">
										{entity?.name ?? "Entité inconnue"}
									</span>
									<span className="text-xs text-metric">
										({devicesByHaId[entity?.ha_device_id ?? ""]?.name ?? "Aucun appareil"}
										)
									</span>
								</div>
							</li>
						);
					})}
				</ul>

				<div className="mt-4">
					<AddAssignmentButton room={room} />
				</div>
			</Card.Body>
		</Card>
	);
}

export { AssignmentsGroupCard };
