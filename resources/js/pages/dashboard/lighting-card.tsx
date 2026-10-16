import { useEffect, useMemo, useRef, useState } from "react";

import {
	LightbulbIcon,
	LightbulbOffFreeIcons,
	PowerOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useHttp } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import { type RgbaColor, RgbaColorPicker } from "react-colorful";
import { Button, Card, cn, Dialog, Switch } from "shanty-ui";

import LightingController from "@/actions/App/Http/Controllers/LightingController";
import { AnimatedNumber } from "@/components/animated-number";
import { useDomoStore } from "@/features/domo/domo-store";
import { decomposeRGB } from "@/helpers/colors";
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

/**
 * Minimum delay between two commands sent while dragging the picker.
 */
const COLOR_COMMAND_THROTTLE_MS = 300;

/**
 * Bulbs without color support are locked to white: only the alpha slider is shown.
 */
const WHITE = { r: 255, g: 255, b: 255 } as const;

const isSameRGBA = (a: RgbaColor | null, b: RgbaColor) =>
	a !== null && a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;

function BulbColorPicker({ bulb }: { bulb: LightBulb }) {
	const { post } = useHttp();

	const entity = useDomoStore((state) =>
		state.domoEntitiesMap.get(bulb.light.id),
	);
	const supportsColor = bulb.light.supportsColor;

	// While the user drags, the picker is not driven by the bulb state anymore, so that
	// broadcasted intermediate states don't make the handles jump back.
	const [isPicking, setIsPicking] = useState(false);

	const pickedRGBA = useRef<RgbaColor | null>(null);
	const lastSentRGBA = useRef<RgbaColor | null>(null);
	const throttleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (throttleTimeout.current) {
				clearTimeout(throttleTimeout.current);
			}
		};
	}, []);

	const bulbRGBA = useMemo((): RgbaColor => {
		const [r, g, b] = decomposeRGB(bulb.light.rgb ?? "rgb(255,255,255)");
		return {
			...(supportsColor ? { r, g, b } : WHITE),
			a: bulb.light.brightness ?? 1,
		};
	}, [bulb.light.rgb, bulb.light.brightness, supportsColor]);

	const sendPickedColor = () => {
		const rgba = pickedRGBA.current;
		if (!entity || !rgba || isSameRGBA(lastSentRGBA.current, rgba)) {
			return;
		}

		lastSentRGBA.current = rgba;

		post(
			LightingController.changeLightBulbColor.url({
				query: {
					ha_entity_id: entity.ha_id,
					...(supportsColor && { red: rgba.r, green: rgba.g, blue: rgba.b }),
					// A brightness of 0 is ignored by the script, so it would leave the bulb unchanged.
					brightness: Math.max(1, Math.round(rgba.a * 255)),
				},
			}),
		);
	};

	const handleChange = (rgba: RgbaColor) => {
		pickedRGBA.current = supportsColor ? rgba : { ...WHITE, a: rgba.a };

		if (throttleTimeout.current) {
			return;
		}

		sendPickedColor();
		throttleTimeout.current = setTimeout(() => {
			throttleTimeout.current = null;
			sendPickedColor();
		}, COLOR_COMMAND_THROTTLE_MS);
	};

	const handlePickEnd = () => {
		setIsPicking(false);
		sendPickedColor();
	};

	return (
		<div
			onPointerDownCapture={() => setIsPicking(true)}
			onPointerUp={handlePickEnd}
			onPointerCancel={handlePickEnd}
		>
			<RgbaColorPicker
				className={supportsColor ? undefined : "brightness-only"}
				color={isPicking ? (pickedRGBA.current ?? bulbRGBA) : bulbRGBA}
				onChange={handleChange}
			/>
		</div>
	);
}

export { LightingCard };
