import { Pen02Icon, Tick03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Form } from "@inertiajs/react";
import { Button, Input, Label, Popover } from "shanty-ui";

import DomoRoomsController from "@/actions/App/Http/Controllers/DomoRoomsController";
import type { DomoRoom } from "@/types/models";

import { DeleteRoomButton } from "./delete-room-button";

function RenameRoomButton({ room }: { room: DomoRoom }) {
	const popHandle = Popover.createHandle();

	return (
		<Popover handle={popHandle}>
			<Popover.Trigger
				render={<Button size="sm" variant="light" color="warning" />}
				className="opacity-0 group-hover:opacity-100"
			>
				<HugeiconsIcon icon={Pen02Icon} />
			</Popover.Trigger>
			<Popover.Popup>
				<Form
					id="edit-room-form"
					action={DomoRoomsController.rename(room)}
					setDefaultsOnSuccess
					showProgress
					onSuccess={() => {
						popHandle.close();
					}}
				>
					<div className="space-y-0.5">
						<Label htmlFor="name">Nom de la pièce</Label>
						<div className="flex gap-x-2 items-end">
							<Input
								key={room.name}
								name="name"
								placeholder="Nom de la pièce"
								defaultValue={room.name}
								className="flex-1"
								ignorePasswordManagers
							/>
							<Button type="submit" size="sm" color="primary">
								<HugeiconsIcon icon={Tick03Icon} />
							</Button>
						</div>
					</div>
				</Form>
				<div className="mt-6 flex justify-end">
					<DeleteRoomButton room={room} />
				</div>
			</Popover.Popup>
		</Popover>
	);
}

export { RenameRoomButton };
