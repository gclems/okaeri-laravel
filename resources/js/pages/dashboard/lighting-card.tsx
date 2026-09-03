import { useMemo } from "react";

import { Lightbulb, PowerOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHttp } from "@inertiajs/react";
import { Button, Card, Switch } from "shanty-ui";

import LightingController from "@/actions/App/Http/Controllers/LightingController";
import { useDomoStore } from "@/features/domo/domo-store";
import type { DomoRoom } from "@/types/models";
import type { LightBulb } from "@/types/projections";

type RoomViewModel = {
	room: DomoRoom;
	bulbs: LightBulb[];
	isOn: boolean;
};

function LightingCard() {
	const { post } = useHttp();

	const lightsMap = useDomoStore((state) => state.lightsMap);
	const roomsMap = useDomoStore((state) => state.domoRoomsMap);

	const viewModels: RoomViewModel[] = useMemo(() => {
		return Array.from(roomsMap.values())
			.map((room) => {
				const bulbs = Array.from(lightsMap.values()).filter(
					(bulb) => bulb.roomId === room.id,
				);

				return {
					room,
					bulbs: Array.from(lightsMap.values()).filter(
						(bulb) => bulb.roomId === room.id,
					),
					isOn: !!bulbs.find((b) => b.light.isOn),
				};
			})
			.filter((vm) => vm.bulbs.length > 0)
			.sort((a, b) => a.room.name.localeCompare(b.room.name));
	}, [lightsMap, roomsMap]);

	const handleGroupToggle = async (vm: RoomViewModel) => {
		post(
			LightingController.toggle.url({
				query: {
					entities_ids: vm.bulbs.map((bulb) => bulb.light.id),
					target_state: vm.isOn ? "off" : "on",
				},
			}),
		);
	};

	const handleTurnOffAll = () => {
		post(
			LightingController.toggle.url({
				query: {
					entities_ids: viewModels.flatMap((vm) =>
						vm.bulbs.map((bulb) => bulb.light.id),
					),
					target_state: "off",
				},
			}),
		);
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
					{viewModels.map((vm) => (
						<li key={vm.room.id}>
							<div className="flex items-center gap-x-1.5">
								<div className="flex-1 truncate">{vm.room.name}</div>
								<div className="flex gap-x-2">
									{vm.bulbs.map((bulb) => {
										const safeRGB = bulb.light.rgb ?? "white";
										return (
											<div
												key={bulb.id}
												className={"size-3 rounded-full border"}
												style={{
													background: bulb.light.isOn ? safeRGB : "transparent",
													borderColor: bulb.light.isOn
														? "var(--foreground)"
														: "var(--border)",
												}}
											/>
										);
									})}
								</div>
								<Switch
									checked={vm.isOn}
									onCheckedChange={() => {
										handleGroupToggle(vm);
									}}
								/>
							</div>
						</li>
					))}
				</ul>
			</Card.Body>
			<Card.Footer>
				<Button
					variant="light"
					color="destructive"
					className="w-full"
					size="sm"
					onClick={handleTurnOffAll}
				>
					<HugeiconsIcon icon={PowerOffIcon} />
					Tout éteindre
				</Button>
			</Card.Footer>
		</Card>
	);
}

export { LightingCard };
