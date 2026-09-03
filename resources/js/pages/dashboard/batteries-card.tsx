import { BatteryMedium01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card } from "shanty-ui";

function BatteriesCard() {
	// const statesMap = useDomoStore((state) => state.statesMap);
	// const entitiesMap = useDomoStore((state) => state.entitiesMap);
	// const devicesMap = useDomoStore((state) => state.devicesMap);

	// const batteries = useMemo(() => {
	// 	const array = [];

	// 	for (const state of statesMap.values()) {
	// 		if (
	// 			state.attributes?.device_class === "battery" &&
	// 			!Number.isNaN(+state.value)
	// 		) {
	// 			array.push(state);
	// 		}
	// 	}

	// 	return array.sort((a, b) => +a.value - +b.value);
	// }, [statesMap]);

	// const deviceByEntityHaId = useMemo(() => {
	// 	const devicesByHaId = new Map<number, DomoDevice>();
	// 	for (const device of devicesMap.values()) {
	// 		devicesByHaId.set(device.ha_id, device);
	// 	}

	// 	const map = new Map<string, DomoDevice>();
	// 	for (const entity of entitiesMap.values()) {
	// 		const device = devicesByHaId.get(entity.ha_device_id);
	// 		if (!device) continue;

	// 		map.set(entity.ha_id, device);
	// 	}

	// 	return map;
	// }, [devicesMap, entitiesMap]);

	return (
		<Card className="bg-linear-to-tl from-transparent to-energy/20">
			<Card.Header
				title={
					<div className="flex items-center gap-x-2">
						<HugeiconsIcon icon={BatteryMedium01Icon} /> Batteries
					</div>
				}
			/>
			<Card.Body>
				{/* <ul>
					{batteries.map((battery) => {
						const device = deviceByEntityHaId.get(battery.ha_entity_id);
						if (!device) return null;

						let textColor = "text-current";
						if (+battery.value <= 20) {
							textColor = "text-destructive";
						} else if (+battery.value <= 50) {
							textColor = "text-warning";
						}

						return (
							<li
								key={battery.id}
								className={cn("flex items-center justify-between gap-x-2", textColor, {
									"font-semibold": +battery.value <= 50,
									"font-bold": +battery.value <= 20,
								})}
								style={{
									opacity: `${clamp(120 - +battery.value, 20, 100)}%`,
								}}
							>
								<span className="text-xs">{device.name}</span>
								<span className="text-metric text-sm">
									{(+battery.value).toFixed(0)}
									<span className="text-xs">%</span>
								</span>
							</li>
						);
					})}
				</ul> */}
			</Card.Body>
		</Card>
	);
}

export { BatteriesCard };
