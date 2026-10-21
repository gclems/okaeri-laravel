import { useEffect, useMemo, useState } from "react";

import {
	LightbulbIcon,
	LightbulbOffFreeIcons,
	PowerOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHttp } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import {
	type Color,
	ColorArea,
	ColorPicker,
	ColorSlider,
	ColorThumb,
	ColorWheel,
	ColorWheelTrack,
	parseColor,
	SliderTrack,
} from "react-aria-components";
import { Button, Card, cn, Dialog, Switch } from "shanty-ui";

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

function LightingCard({ className }: { className?: string }) {
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
			LightingController.toggleRooms.url({
				query: {
					rooms_ids: [vm.room.id],
					target_state: vm.isOn ? "off" : "on",
				},
			}),
		);
	};

	const handleTurnOffAll = () => {
		post(
			LightingController.toggleRooms.url({
				query: {
					rooms_ids: viewModels.map((vm) => vm.room.id),
					target_state: "off",
				},
			}),
		);
	};

	return (
		<Card className={className}>
			<Card.Header
				title={
					<>
						<img src="/images/lightbulb_small.png" alt="Lightbulb" className="h-6" />
						Éclairage
					</>
				}
			/>
			<Card.Body>
				<ul className="space-y-4">
					{viewModels.map((vm) => (
						<li className="border-muted pb-2" key={vm.room.id}>
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
	const { post } = useHttp();

	const handle = Dialog.createHandle();

	const toggleBulb = async (bulb: LightBulb) => {
		// Native toggle is fine for a single bulb: it adapts on its own to the
		// Natural Light state of its room.
		post(
			LightingController.toggle.url({
				query: {
					entities_ids: [bulb.light.id],
					target_state: bulb.light.isOn ? "off" : "on",
				},
			}),
		);
	};

	return (
		<>
			<div className="flex items-stretch gap-x-1.5">
				<button
					type="button"
					className="appearance-none text-left block flex-1 truncate"
					onClick={() => handle.open(vm.room.name)}
				>
					<div>{vm.room.name}</div>
					<AnimatePresence>
						{vm.isOn && (
							<motion.div
								className="flex gap-x-2"
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
							>
								{vm.bulbs.map((bulb) => {
									return (
										<div key={bulb.id} className="flex items-center gap-x-0.5">
											<div
												className={"size-3 rounded-full border-2"}
												style={{
													background: bulb.light.rgb ?? "transparent",
													borderColor: "var(--primary)",
												}}
											/>
											<div className="text-xs text-metric">
												<AnimatedNumber
													number={(bulb.light.brightness ?? 0) * 100}
													formatter={(n) => n.toFixed(0)}
												/>
												%
											</div>
										</div>
									);
								})}
							</motion.div>
						)}
					</AnimatePresence>
				</button>

				<Switch
					checked={vm.isOn}
					onCheckedChange={() => {
						onToggle(vm);
					}}
				/>
			</div>

			<Dialog handle={handle}>
				<Dialog.Popup size="xl">
					<Dialog.Header title={`Éclairage - ${vm.room.name}`} />
					<Dialog.Body className="@container">
						<div className="w-full flex justify-center flex-col @xl:flex-row">
							<AnimatePresence>
								{vm.isOn && (
									<motion.ul
										className="overflow-hidden flex-wrap flex gap-4"
										initial={{ width: 0, height: 0, opacity: 0, flex: 0 }}
										animate={{ width: "auto", height: "auto", opacity: 1, flex: 1 }}
										exit={{ width: 0, height: 0, opacity: 0, flex: 0 }}
									>
										{vm.bulbs.map((bulb) => {
											const brightness = (bulb.light.brightness ?? 0) * 100;
											return (
												<li key={bulb.id} className="flex items-center flex-col gap-y-4">
													<div className="text-metric text-center">{bulb.name}</div>
													<button
														type="button"
														className={cn(
															"appearance-none rounded-full size-10 border-2 border-primary flex items-center justify-center",
															{
																"text-white": brightness < 50,
															},
														)}
														style={{
															backgroundColor: bulb.light.rgb ?? "transparent",
														}}
														onClick={() => toggleBulb(bulb)}
													>
														<div className="text-metric font-semibold">
															{brightness.toFixed(0)}%
														</div>
													</button>

													{bulb.light.isOn && <BulbColorPicker bulb={bulb} />}
												</li>
											);
										})}
									</motion.ul>
								)}
							</AnimatePresence>
							<div className="shrink-0 grow-0 flex flex-col items-center justify-center">
								<button
									type="button"
									className="appearance-none block text-4xl text-muted p-8"
									onClick={() => onToggle(vm)}
								>
									<HugeiconsIcon
										icon={vm.isOn ? LightbulbOffFreeIcons : LightbulbIcon}
										size="4em"
									/>
									<div>{vm.isOn ? "Éteindre" : "Allumer"}</div>
								</button>
							</div>
						</div>
					</Dialog.Body>
				</Dialog.Popup>
			</Dialog>
		</>
	);
}

const THUMB_CLASS_NAME =
	"size-5 rounded-full border-2 border-white shadow-[0_0_0_1px_black,inset_0_0_0_1px_black] data-focus-visible:size-6";

function BulbColorPicker({ bulb }: { bulb: LightBulb }) {
	const { post } = useHttp();

	const entity = useDomoStore((state) =>
		state.domoEntitiesMap.get(bulb.light.id),
	);
	const { rgb, brightness, supportsColor } = bulb.light;

	const [color, setColor] = useState<Color>(() => toHSB(rgb, brightness));

	useEffect(() => {
		setColor(toHSB(rgb, brightness));
	}, [rgb, brightness]);

	const commit = (picked: Color) => {
		if (!entity) {
			return;
		}

		// The bulb brightness is sent on its own: the color is sent at full brightness.
		const fullBrightness = picked.withChannelValue("brightness", 100).toFormat("rgb");

		post(
			LightingController.changeLightBulbColor.url({
				query: {
					ha_entity_id: entity.ha_id,
					...(supportsColor && {
						red: fullBrightness.getChannelValue("red"),
						green: fullBrightness.getChannelValue("green"),
						blue: fullBrightness.getChannelValue("blue"),
					}),
					// A brightness of 0 is ignored by the script, so it would leave the bulb unchanged.
					brightness: Math.max(
						1,
						Math.round((picked.getChannelValue("brightness") / 100) * 255),
					),
				},
			}),
		);
	};

	return (
		<ColorPicker value={color} onChange={setColor}>
			{supportsColor ? (
				<div className="relative">
					<ColorWheel
						aria-label="Teinte"
						outerRadius={100}
						innerRadius={74}
						onChangeEnd={commit}
					>
						<ColorWheelTrack />
						<ColorThumb className={THUMB_CLASS_NAME} />
					</ColorWheel>
					<ColorArea
						aria-label="Saturation et luminosité"
						colorSpace="hsb"
						xChannel="saturation"
						yChannel="brightness"
						className="absolute inset-0 m-auto size-24 rounded-md"
						onChangeEnd={commit}
					>
						<ColorThumb className={THUMB_CLASS_NAME} />
					</ColorArea>
				</div>
			) : (
				<ColorSlider
					aria-label="Luminosité"
					colorSpace="hsb"
					channel="brightness"
					className="w-48"
					onChangeEnd={commit}
				>
					<SliderTrack className="h-7 rounded-md">
						<ColorThumb className={cn(THUMB_CLASS_NAME, "top-1/2")} />
					</SliderTrack>
				</ColorSlider>
			)}
		</ColorPicker>
	);
}

/**
 * The bulb color, with its brightness (0-1) as the HSB brightness channel.
 */
function toHSB(rgb: string | null, brightness: number | null): Color {
	return parseColor(rgb ?? "rgb(255, 255, 255)")
		.toFormat("hsb")
		.withChannelValue("brightness", (brightness ?? 1) * 100);
}

export { LightingCard };
