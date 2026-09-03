import { Card } from "shanty-ui";

// import { RollingNumber } from "@/components/rolling-number";
// import { useDomoStore } from "@/features/domo/domo-store";
// import { EntityAssignmentRoles } from "@/types/models";

function AppTopBar() {
	return (
		<Card size="xs" className="shrink-0">
			<Card.Body className="min-h-4">
				<div className="flex items-center justify-between gap-x-4">
					<div></div>
					{/* <CarBlock /> */}
				</div>
			</Card.Body>
		</Card>
	);
}

// function CarBlock() {
// 	const assignments = Array.from(
// 		useDomoStore((state) => state.assignmentsMap).values(),
// 	);
// 	const entities = Array.from(
// 		useDomoStore((state) => state.entitiesMap).values(),
// 	);
// 	const states = Array.from(useDomoStore((state) => state.statesMap).values());

// 	const carBatteryAssignment = assignments.find(
// 		(assignment) => assignment.role === EntityAssignmentRoles.RenaultBattery,
// 	);

// 	if (!carBatteryAssignment) {
// 		return null;
// 	}

// 	const carBatteryEntity = entities.find(
// 		(e) => e.id === carBatteryAssignment.domo_entity_id,
// 	);
// 	if (!carBatteryEntity) {
// 		return null;
// 	}

// 	const carBatteryState = states.find(
// 		(s) => s.ha_entity_id === carBatteryEntity.ha_id,
// 	);
// 	if (!carBatteryState) {
// 		return null;
// 	}

// 	return (
// 		<div className="flex items-center">
// 			<img src="/renault_4_small.png" alt="Renault 4" className="w-8" />
// 			<div className="text-lg font-semibold text-metric ml-2">
// 				<RollingNumber number={+(carBatteryState.value ?? 0)} />
// 			</div>
// 			<div className="">%</div>
// 		</div>
// 	);
// }

export { AppTopBar };
