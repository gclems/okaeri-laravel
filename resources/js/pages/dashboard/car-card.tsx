import { useEffect } from "react";

import { useMap } from "react-leaflet";
import { Card } from "shanty-ui";

import {
	EntityAssignmentRoles,
	type EntityAssignmentRolesEnum,
} from "@/types/models";

import "leaflet/dist/leaflet.css";

const carRoles: EntityAssignmentRolesEnum[] = [
	EntityAssignmentRoles.RenaultAutonomy,
	EntityAssignmentRoles.RenaultBattery,
	EntityAssignmentRoles.RenaultChargeLevelTarget,
	EntityAssignmentRoles.RenaultChargingState,
	EntityAssignmentRoles.RenaultGpsTracker,
	EntityAssignmentRoles.RenaultPlugState,
	EntityAssignmentRoles.RenaultTotalDistance,
	EntityAssignmentRoles.RenaultRemainingChargingTime,
];

function CarCard() {
	// const assignments = Array.from(
	// 	useDomoStore((state) => state.assignmentsMap).values(),
	// );
	// const entities = Array.from(
	// 	useDomoStore((state) => state.entitiesMap).values(),
	// );
	// const states = Array.from(useDomoStore((state) => state.statesMap).values());

	// const carAssignments = useMemo(() => {
	// 	const ass = {} as Record<
	// 		EntityAssignmentRoles,
	// 		{
	// 			assignment: DomoEntityAssignment;
	// 			state: DomoEntityState;
	// 		}
	// 	>;

	// 	assignments.forEach((assignment) => {
	// 		if (!carRoles.includes(assignment.role)) return;

	// 		const entity = entities.find((e) => e.id === assignment.domo_entity_id);
	// 		if (!entity) return;

	// 		const state = states.find((s) => s.ha_entity_id === entity.ha_id);
	// 		if (!state) return;

	// 		ass[assignment.role as EntityAssignmentRoles] = {
	// 			assignment,
	// 			state,
	// 		};
	// 	});
	// 	return ass;
	// }, [assignments, entities, states]);

	// if (Object.keys(carAssignments).length === 0) {
	// 	return null;
	// }

	// const battery = carAssignments[EntityAssignmentRoles.RenaultBattery];
	// const autonomy = carAssignments[EntityAssignmentRoles.RenaultAutonomy];
	// const distance = carAssignments[EntityAssignmentRoles.RenaultTotalDistance];
	// const chargeLevelTarget =
	// 	carAssignments[EntityAssignmentRoles.RenaultChargeLevelTarget];
	// const chargingState =
	// 	carAssignments[EntityAssignmentRoles.RenaultChargingState];
	// const remainingChargingTime =
	// 	carAssignments[EntityAssignmentRoles.RenaultRemainingChargingTime];
	// const gpsTracker = carAssignments[EntityAssignmentRoles.RenaultGpsTracker];
	// const plugState = carAssignments[EntityAssignmentRoles.RenaultPlugState];

	return (
		<Card className="@container bg-linear-to-br from-car/15 to-transparent">
			<Card.Header
				title={
					<div className="flex justify-between items-center gap-4">
						<div className="flex gap-x-2 items-center">
							<img src="/renault_4_small.png" alt="Renault 4" className="w-10" />{" "}
							Renault 4
						</div>
						{/* {distance && (
							<span className="text-metric font-thin text-base">
								<RollingNumber number={+(distance.state.value ?? 0)} />
								{autonomy.state.attributes.unit_of_measurement as string}
							</span>
						)} */}
					</div>
				}
			></Card.Header>

			<Card.Body className=" space-y-2">
				{/* <div className="grid @xs:grid-cols-2 gap-1">
					{(battery || autonomy) && (
						<div className="flex items-center gap-x-2">
							<HugeiconsIcon icon={AutomotiveBattery02Icon} />
							<div className="flex items-center gap-1">
								{battery && (
									<span
										className={cn(
											"font-semibold text-lg",
											getBatteryLevelColor(+(battery.state.value ?? 0)),
										)}
									>
										<RollingNumber number={+(battery.state.value ?? 0)} />
										<span>
											{(battery.state.attributes.unit_of_measurement as string) ?? ""}
										</span>
									</span>
								)}
								{battery && autonomy && (
									<HugeiconsIcon icon={ArrowRight04Icon} size="1.25rem" />
								)}
								{autonomy && (
									<span className="text-sm">
										<RollingNumber number={+(autonomy.state.value ?? 0)} />
										<span>
											{(autonomy.state.attributes.unit_of_measurement as string) ?? ""}
										</span>
									</span>
								)}
							</div>
						</div>
					)}
					{(plugState || chargingState) && (
						<div className="flex items-center gap-x-2">
							{(() => {
								switch (plugState?.state.value) {
									case "plugged":
										return <HugeiconsIcon icon={ElectricPlugsIcon} />;
									case "unplugged":
										return <HugeiconsIcon icon={PlugSocketIcon} />;
									default:
										return <HugeiconsIcon icon={CableIcon} />;
								}
							})()}
							<div>
								<div className="flex flex-col">
									{plugState && (
										<div className="text-xs">
											{getPlugStateLabel(plugState?.state.value ?? "")}
										</div>
									)}
									{chargingState && (
										<>
											{chargingState.state.value !== "charge_in_progress" && (
												<div className="text-xs">
													<span>
														{getChargingStateLabel(chargingState.state.value ?? "")}
													</span>
												</div>
											)}
											{chargingState.state.value === "charge_in_progress" && (
												<div className="text-xs flex gap-x-1 items-center">
													<span>{`${chargeLevelTarget?.state.value ?? "?"}%`}</span>
													<HugeiconsIcon icon={ArrowRight04Icon} size="1.25rem" />
													<span>
														{(() => {
															if (!remainingChargingTime) return "???";

															const chargingTime = getChargingTime(
																+(remainingChargingTime.state.value ?? 0),
															);

															return (
																<span className="font-semibold">
																	<RollingNumber number={chargingTime.hours} />h
																	<RollingNumber number={chargingTime.minutes} />m
																</span>
															);
														})()}
													</span>
												</div>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					)}
				</div>
				{gpsTracker && (
					<div className="col-span-2 aspect-video">
						<MapContainer
							center={[
								+(gpsTracker.state.attributes.latitude ?? 0),
								+(gpsTracker.state.attributes.longitude ?? 0),
							]}
							zoom={16}
							scrollWheelZoom={false}
							dragging={false}
							zoomControl={false}
							attributionControl
							className="h-full w-full"
						>
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
								url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
							/>
							<RecenterMap
								latitude={+(gpsTracker.state.attributes.latitude ?? 0)}
								longitude={+(gpsTracker.state.attributes.longitude ?? 0)}
							/>
							<Marker
								position={[
									+(gpsTracker.state.attributes.latitude ?? 0),
									+(gpsTracker.state.attributes.longitude ?? 0),
								]}
							/>
						</MapContainer>
					</div>
				)} */}
			</Card.Body>
		</Card>
	);
}

function RecenterMap({
	latitude,
	longitude,
}: {
	latitude: number;
	longitude: number;
}) {
	const map = useMap();

	useEffect(() => {
		map.setView([latitude, longitude]);
	}, [map, latitude, longitude]);

	return null;
}

export { CarCard };
