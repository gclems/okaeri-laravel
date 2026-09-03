import { useState } from "react";

import { Plus, Tick03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Form } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import { Button, Label, Popover, Select } from "shanty-ui";

import DomoEntityAssignmentsController from "@/actions/App/Http/Controllers/DomoEntityAssignmentsController";
import { getDomoEntityAssignmentRoleLabel } from "@/features/domo-entity-assignment-role";
import { type DomoRoom, EntityAssignmentRoles } from "@/types/models";

function AddAssignmentButton({ room }: { room?: DomoRoom | null }) {
	const [hovered, setHovered] = useState(false);

	// const entities = useDomoStore((state) => state.entitiesMap).values();

	// const devices = useDomoStore((state) => state.devicesMap).values();

	// const devicesByHaId = devices?.reduce(
	// 	(acc, device) => {
	// 		acc[device.ha_id] = device;
	// 		return acc;
	// 	},
	// 	{} as Record<string, DomoDevice>,
	// );

	// const sortedEntities = Array.from(entities).sort((a, b) =>
	// 	a.name.localeCompare(b.name),
	// );

	return (
		<Popover>
			<Popover.Trigger
				render={
					<Button
						type="submit"
						variant="light"
						size="sm"
						className="w-full flex items-center justify-center"
						onMouseEnter={() => setHovered(true)}
						onMouseLeave={() => setHovered(false)}
						onFocus={() => setHovered(true)}
						onBlur={() => setHovered(false)}
					/>
				}
			>
				<HugeiconsIcon icon={Plus} />
				<AnimatePresence>
					{hovered && (
						<motion.span
							className="overflow-hidden whitespace-nowrap"
							initial={{ width: 0 }}
							animate={{ width: "auto" }}
							exit={{ width: 0 }}
						>
							&nbsp;Assigner
						</motion.span>
					)}
				</AnimatePresence>
			</Popover.Trigger>
			<Popover.Popup>
				<Form
					action={DomoEntityAssignmentsController.store()}
					className="space-y-4 w-72"
					resetOnSuccess
					showProgress
				>
					<div className="space-y-0.5">
						<input type="hidden" name="room_id" value={room?.id} />
						<Label htmlFor="name">Rôle</Label>
						<Select
							items={Object.values(EntityAssignmentRoles).map((role) => ({
								value: role,
								label: getDomoEntityAssignmentRoleLabel(role),
							}))}
							name="role"
							placeholder="Rôle"
							className="flex-1"
						/>
					</div>
					<div className="space-y-0.5">
						<Label htmlFor="name">Entité</Label>
						{/* <Select
							items={sortedEntities.map((entity) => {
								const device = devicesByHaId[String(entity.ha_device_id)];

								return {
									value: String(entity.id),
									label: `${entity.name} (${device?.name ?? "Aucun appareil"})`,
								};
							})}
							name="entity_id"
							placeholder="Entité"
							className="flex-1"
						/> */}
					</div>
					<div className="flex justify-end">
						<Button type="submit" color="primary">
							<HugeiconsIcon icon={Tick03Icon} />
						</Button>
					</div>
				</Form>
			</Popover.Popup>
		</Popover>
	);
}

export { AddAssignmentButton };
