import { useMemo } from "react";

import { Lightbulb } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHttp } from "@inertiajs/react";
import { Card, Switch } from "shanty-ui";

import LightingController from "@/actions/App/Http/Controllers/LightingController";
import { useDomoStore } from "@/features/domo/domo-store";
import { getLightColorCode } from "@/features/lighting/lighting";
import {
	type DomoEntity,
	type DomoEntityAssignment,
	type DomoEntityState,
	type DomoRoom,
	EntityAssignmentRoles,
} from "@/types/models";

type RoomViewModel = {
	assignment: DomoEntityAssignment;
	room: DomoRoom;
	entity: DomoEntity;
	state: DomoEntityState;
	bulbs: {
		entity: DomoEntity;
		state: DomoEntityState;
	}[];
};

function LightingCard() {
	const { post } = useHttp();

	const assignmentsMap = useDomoStore((state) => state.assignmentsMap);
	const roomsMap = useDomoStore((state) => state.roomsMap);
	const entitiesMap = useDomoStore((state) => state.entitiesMap);
	const statesMap = useDomoStore((state) => state.statesMap);
	const optimisticallyUpdateState = useDomoStore(
		(state) => state.optimisticallyUpdateState,
	);

	console.log({ state: statesMap.get(47)?.value });

	const viewModels: RoomViewModel[] = useMemo(() => {
		const vms = [] as RoomViewModel[];

		const groupAssignments = [] as DomoEntityAssignment[];
		const bulbAssignments = [] as DomoEntityAssignment[];

		const entitiesByHaId = Array.from(entitiesMap.values()).reduce(
			(acc, entity) => {
				acc[entity.ha_id] = entity;
				return acc;
			},
			{} as Record<string, DomoEntity>,
		);

		const statesByEntityId = Array.from(statesMap.values()).reduce(
			(acc, state) => {
				const entity = entitiesByHaId[state.ha_entity_id];
				if (entity) {
					acc[entity.id] = state;
				}
				return acc;
			},
			{} as Record<number, DomoEntityState>,
		);

		// Filter assignments for HueLightGroup and HueLight roles
		for (const assignment of assignmentsMap.values()) {
			if (assignment.role === EntityAssignmentRoles.HueLightGroup)
				groupAssignments.push(assignment);

			if (assignment.role === EntityAssignmentRoles.HueLight)
				bulbAssignments.push(assignment);
		}

		// Generate view models for each group assignment
		for (const assignment of groupAssignments) {
			// we don't keep lights that are not assigned to a room
			if (!assignment.domo_room_id) continue;

			const room = roomsMap.get(assignment.domo_room_id);
			if (!room) continue; // it should not happen but just in case

			const entity = entitiesMap.get(assignment.domo_entity_id);
			if (!entity) continue; // it should not happen but just in case

			const state = statesByEntityId[entity.id];
			if (!state) continue; // it should not happen but just in case

			const bulbs = [];
			for (const bulbEntityId of (state.attributes.entity_id as string[]) || []) {
				const bulbEntity = entitiesByHaId[bulbEntityId];
				if (!bulbEntity) continue;

				const bulbState = statesByEntityId[bulbEntity.id];
				if (!bulbState) continue;

				bulbs.push({
					entity: bulbEntity,
					state: bulbState,
				});
			}

			vms.push({
				assignment,
				room,
				entity,
				state,
				bulbs,
			});
		}

		return vms;
	}, [assignmentsMap, roomsMap, entitiesMap, statesMap]);

	const handleGroupToggle = async (
		entity: DomoEntity,
		currentState: DomoEntityState,
	) => {
		optimisticallyUpdateState(
			currentState.id,
			currentState.value === "on" ? "off" : "on",
		);

		post(LightingController.toggleLight.url({ entity: entity.id }));
	};

	return (
		<Card className="bg-linear-to-tl from-lighting/20 to-transparent">
			<Card.Header
				title={
					<div className="flex gap-x-2 items-center">
						<HugeiconsIcon icon={Lightbulb} />
						Éclairage
					</div>
				}
			/>
			<Card.Body>
				<ul>
					{viewModels.map((vm) => {
						const isOn = vm.state.value === "on";

						return (
							<li key={vm.assignment.id}>
								<div className="flex items-center">
									<div className="flex-1 truncate">{vm.room.name}</div>
									<div className="flex gap-x-0.5">
										{vm.bulbs.map((bulb) => (
											<div
												key={bulb.entity.id}
												className="size-3 border border-border"
												style={{
													backgroundColor: getLightColorCode(bulb.state),
												}}
											/>
										))}
									</div>
									<Switch
										checked={isOn}
										onCheckedChange={() => {
											handleGroupToggle(vm.entity, vm.state);
										}}
									/>
								</div>
							</li>
						);
					})}
				</ul>
			</Card.Body>
			<Card.Footer></Card.Footer>
		</Card>
	);
}

export { LightingCard };
