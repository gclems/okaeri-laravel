import { useMemo } from "react";

import { PowerOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHttp } from "@inertiajs/react";
import { Button, Card, cn, Switch } from "shanty-ui";

import LightingController from "@/actions/App/Http/Controllers/LightingController";
import { AnimatedNumber } from "@/components/animated-number";
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
		<Card>
			<Card.Header
				title={
					<div className="flex gap-x-2 items-center">
						<img src="/images/lightbulb_small.png" alt="Lightbulb" className="h-6" />
						Éclairage
					</div>
				}
			/>
			<Card.Body>
				<ul className="space-y-2">
					{viewModels.map((vm) => (
						<li key={vm.room.id}>
							<ViewModelItem vm={vm} onToggle={handleGroupToggle} />
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

function ViewModelItem({
	vm,
	onToggle,
}: {
	vm: RoomViewModel;
	onToggle: (vm: RoomViewModel) => void;
}) {
	return (
		<div>
			<div className="flex items-stretch gap-x-1.5">
				<div className="flex-1 truncate">{vm.room.name}</div>

				<Switch
					checked={vm.isOn}
					onCheckedChange={() => {
						onToggle(vm);
					}}
				/>
			</div>
			<div className="flex gap-x-2">
				{vm.bulbs.map((bulb) => {
					const safeRGB = bulb.light.rgb ?? "white";
					const percent = (bulb.light.brightness ?? 0) * 100;
					return (
						<div key={bulb.id} className="flex items-center gap-x-0.5">
							<div
								className={"size-3 rounded-full border-2"}
								style={{
									background: bulb.light.isOn ? safeRGB : "transparent",
									borderColor: bulb.light.isOn ? "var(--foreground)" : "var(--border)",
								}}
							/>
							<div
								className={cn("text-xs text-metric", {
									"opacity-30": !bulb.light.isOn,
								})}
							>
								<AnimatedNumber number={percent} formatter={(n) => n.toFixed(0)} />%
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

export { LightingCard };
