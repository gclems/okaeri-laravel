import { useMemo } from "react";

import { DropletIcon, HouseHeartIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, cn } from "shanty-ui";

import { RollingNumber } from "@/components/rolling-number";
import { useDomoStore } from "@/features/domo/domo-store";
import type {
	DomoEntityState,
	DomoRoom,
	EntityAssignmentRolesEnum,
} from "@/types/models";
import { EntityAssignmentRoles } from "@/types/models";

const comfortRoles: EntityAssignmentRolesEnum[] = [
	EntityAssignmentRoles.AqaraHygrometer,
	EntityAssignmentRoles.AqaraThermometer,
];

function ComfortCard() {
	const assignments = Array.from(
		useDomoStore((state) => state.assignmentsMap).values(),
	);
	const rooms = Array.from(useDomoStore((state) => state.roomsMap).values());
	const entities = Array.from(
		useDomoStore((state) => state.entitiesMap).values(),
	);
	const states = Array.from(useDomoStore((state) => state.statesMap).values());

	const roomsById = useMemo(() => {
		const map: Record<string, (typeof rooms)[0]> = {};
		for (const room of rooms) {
			map[room.id] = room;
		}
		return map;
	}, [rooms]);

	const statesByEntityId = useMemo(() => {
		const map: Record<number, (typeof states)[0]> = {};
		for (const state of states) {
			const entity = entities.find((e) => e.ha_id === state.ha_entity_id);
			if (entity) {
				map[entity.id] = state;
			}
		}
		return map;
	}, [states, entities]);

	const assignmentsByRoom = useMemo(() => {
		const assignmentsByRoom: Record<
			number,
			{
				thermometer: DomoEntityState | null;
				hygrometer: DomoEntityState | null;
			}
		> = {};

		for (const assignment of assignments) {
			if (comfortRoles.includes(assignment.role)) {
				if (!assignment.domo_room_id) continue;

				if (!assignmentsByRoom[assignment.domo_room_id]) {
					assignmentsByRoom[assignment.domo_room_id] = {
						thermometer: null,
						hygrometer: null,
					};
				}

				switch (assignment.role) {
					case EntityAssignmentRoles.AqaraThermometer:
						assignmentsByRoom[assignment.domo_room_id].thermometer =
							statesByEntityId[assignment.domo_entity_id];
						break;
					case EntityAssignmentRoles.AqaraHygrometer:
						assignmentsByRoom[assignment.domo_room_id].hygrometer =
							statesByEntityId[assignment.domo_entity_id];
						break;
				}
			}
		}

		return assignmentsByRoom;
	}, [assignments, statesByEntityId]);

	return (
		<Card className="bg-linear-to-bl to-comfort/20 from-transparent">
			<Card.Header
				title={
					<div className="flex gap-x-2 items-center">
						<HugeiconsIcon icon={HouseHeartIcon} /> Confort
					</div>
				}
			></Card.Header>
			<Card.Body>
				<ul className="space-y-1">
					{assignmentsByRoom &&
						Object.entries(assignmentsByRoom).map(([roomId, roomAssignments]) => {
							const room = roomsById[roomId];
							if (!room) return null;

							return (
								<HorizontalRoomCard
									key={roomId}
									room={room}
									thermometerState={roomAssignments.thermometer}
									hygrometerState={roomAssignments.hygrometer}
								/>
							);
						})}
				</ul>
			</Card.Body>
		</Card>
	);
}

function HorizontalRoomCard({
	room,
	thermometerState,
	hygrometerState,
}: {
	room: DomoRoom;
	thermometerState: DomoEntityState | null;
	hygrometerState: DomoEntityState | null;
}) {
	return (
		<li>
			<div className="flex items-center gap-x-4">
				<div className="flex-1 truncate">{room.name}</div>
				{thermometerState && (
					<div className="flex items-center gap-x-1">
						<span
							className={cn("text-metric", {
								"text-temperature-excessive": +(thermometerState.value ?? 0) >= 26,
								"text-temperature-low": +(thermometerState.value ?? 0) <= 17,
							})}
						>
							<RollingNumber
								number={+(thermometerState.value ?? 0)}
								formatter={(value) => value.toFixed(1).toString()}
							/>
						</span>
						<span className="text-muted text-xs">
							{thermometerState.attributes.unit_of_measurement as string}
						</span>
					</div>
				)}
				{hygrometerState && (
					<div className="flex items-center gap-x-1 text-sm">
						<HugeiconsIcon
							icon={DropletIcon}
							size="0.75rem"
							className="fill-humidity text-white"
						/>
						<span className="text-metric">
							<RollingNumber
								number={+(hygrometerState.value ?? 0)}
								formatter={(value) => value.toFixed(1).toString()}
							/>
						</span>
						<span className="text-muted text-xs">
							{hygrometerState.attributes.unit_of_measurement as string}
						</span>
					</div>
				)}
			</div>
		</li>
	);
}

export { ComfortCard };
