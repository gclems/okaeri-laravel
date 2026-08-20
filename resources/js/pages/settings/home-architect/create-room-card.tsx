import { Plus, Tick03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Form } from "@inertiajs/react";
import { Button, Card, Input, Label, Popover } from "shanty-ui";

import DomoRoomsController from "@/actions/App/Http/Controllers/DomoRoomsController";

function CreateRoomCard() {
	const popHandle = Popover.createHandle();
	return (
		<Popover handle={popHandle}>
			<Popover.Trigger nativeButton={false} render={<div />}>
				<Card className="border-dashed w-full h-full">
					<Card.Body className="flex items-center justify-center">
						<HugeiconsIcon icon={Plus} />
					</Card.Body>
				</Card>
			</Popover.Trigger>
			<Popover.Popup>
				<Form
					id="edit-room-form"
					action={DomoRoomsController.store()}
					resetOnSuccess
					showProgress
					onSuccess={() => popHandle.close()}
				>
					<div className="space-y-0.5">
						<Label htmlFor="name">Nom de la pièce</Label>
						<div className="flex gap-x-2 items-end">
							<Input
								name="name"
								placeholder="Nom de la pièce"
								className="flex-1"
								ignorePasswordManagers
							/>
							<Button type="submit" size="sm" color="primary">
								<HugeiconsIcon icon={Tick03Icon} />
							</Button>
						</div>
					</div>
				</Form>
			</Popover.Popup>
		</Popover>
	);
}

export { CreateRoomCard };
