import { useState } from "react";

import { Delete04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Form } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import { AlertDialog, Button } from "shanty-ui";

import DomoRoomsController from "@/actions/App/Http/Controllers/DomoRoomsController";
import type { DomoRoom } from "@/types/models";

function DeleteRoomButton({ room }: { room: DomoRoom }) {
	const [deleteButtonHovered, setDeleteButtonHovered] = useState(false);
	const delHandle = AlertDialog.createHandle();

	return (
		<AlertDialog handle={delHandle}>
			<AlertDialog.Trigger
				render={
					<Button
						type="submit"
						color="destructive"
						variant="light"
						size="sm"
						onMouseEnter={() => setDeleteButtonHovered(true)}
						onMouseLeave={() => setDeleteButtonHovered(false)}
						onFocus={() => setDeleteButtonHovered(true)}
						onBlur={() => setDeleteButtonHovered(false)}
					/>
				}
			>
				<AnimatePresence>
					{deleteButtonHovered && (
						<motion.span
							className="overflow-hidden whitespace-nowrap"
							initial={{ width: 0 }}
							animate={{ width: "auto" }}
							exit={{ width: 0 }}
						>
							Supprimer&nbsp;
						</motion.span>
					)}
				</AnimatePresence>
				<HugeiconsIcon icon={Delete04Icon} />
			</AlertDialog.Trigger>{" "}
			<AlertDialog.Popup>
				<AlertDialog.Title>Supprimer la pièce {room.name}</AlertDialog.Title>
				<AlertDialog.Body>
					Cette action est définitive. Les appareils seront déplacés dans "Autres
					appareils".
				</AlertDialog.Body>
				<AlertDialog.Footer>
					<AlertDialog.CloseButton>Annuler</AlertDialog.CloseButton>
					<Form
						action={DomoRoomsController.delete(room)}
						method="delete"
						showProgress
						onSuccess={() => delHandle.close()}
					>
						<Button type="submit" color="destructive">
							Supprimer
						</Button>
					</Form>
				</AlertDialog.Footer>
			</AlertDialog.Popup>
		</AlertDialog>
	);
}

export { DeleteRoomButton };
