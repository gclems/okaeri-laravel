import { useToday } from "@/features/clock/use-today";
import { useDomoStore } from "@/features/domo/domo-store";
import type {
	DomoDevice,
	DomoEntity,
	DomoEntityEvent,
	DomoRoom,
} from "@/types/models";

const valueFormatter = new Intl.NumberFormat("fr-FR", {
	maximumFractionDigits: 1,
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
	hour: "2-digit",
	minute: "2-digit",
});

const dayTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
	weekday: "short",
	hour: "2-digit",
	minute: "2-digit",
});

function Trace({ event }: { event: DomoEntityEvent }) {
	const entitiesMap = useDomoStore((state) => state.domoEntitiesMap);
	const devicesMap = useDomoStore((state) => state.domoDevicesMap);
	const roomsMap = useDomoStore((state) => state.domoRoomsMap);

	const entity = entitiesMap.get(event.domo_entity_id) ?? undefined;

	if (!entity) return null;

	const device = entity
		? devicesMap.values().find((d) => d.ha_id === entity.ha_device_id)
		: undefined;
	const room = device
		? roomsMap.values().find((r) => r.ha_id === device.ha_area_id)
		: undefined;

	return (
		<div className="w-full flex items-center text-sm gap-x-2 px-4">
			<TraceIcon domain={entityDomain(entity)} />
			<TraceLabel event={event} room={room} device={device} entity={entity} />
			<div className="flex-1 border-b border-current border-dotted " />
			<TraceDate event={event} />
		</div>
	);
}

function entityDomain(entity?: DomoEntity): string | undefined {
	return entity?.ha_id.split(".")[0];
}

const DOMAIN_ICONS: Record<string, { src: string; alt: string }> = {
	light: { src: "/images/lightbulb_small.png", alt: "Lightbulb" },
	sensor: { src: "/images/comfort_small.png", alt: "Sensor" },
};

function TraceIcon({ domain }: { domain?: string }) {
	const icon = domain ? DOMAIN_ICONS[domain] : undefined;

	return (
		<div className="size-4 rounded-full border-2 border-primary overflow-hidden shrink-0 grow-0">
			{icon && <img src={icon.src} alt={icon.alt} className="h-6" />}
		</div>
	);
}

function describe(event: DomoEntityEvent, domain?: string): string {
	const attributes = event.attributes ?? {};
	const valueChanged = event.changes.includes("value");
	const changedAttributes = event.changes.filter((key) => key !== "value");

	switch (domain) {
		case "light": {
			const brightness = Number(attributes.brightness);
			const percentage = Number.isFinite(brightness)
				? `${Math.round((brightness / 255) * 100)}%`
				: undefined;

			if (valueChanged) {
				if (event.value !== "on") {
					return "éteinte";
				}
				return percentage ? `allumée – ${percentage}` : "allumée";
			}
			if (changedAttributes.includes("brightness") && percentage) {
				return `luminosité ${percentage}`;
			}
			if (changedAttributes.includes("rgb_color")) {
				return "couleur modifiée";
			}
			break;
		}
		default: {
			if (valueChanged) {
				const value = Number(event.value);
				const unit = attributes.unit_of_measurement;
				const formatted = Number.isFinite(value)
					? valueFormatter.format(value)
					: event.value;
				return unit ? `${formatted}${unit}` : formatted;
			}
		}
	}

	return changedAttributes.join(", ");
}

function TraceLabel({
	event,
	room,
	device,
	entity,
}: {
	event: DomoEntityEvent;
	room?: DomoRoom;
	device?: DomoDevice;
	entity?: DomoEntity;
}) {
	return (
		<div className="truncate flex gap-x-1">
			{room && <div className="capitalize">{room.name}</div>}
			{device && <div className="capitalize">{device.name}</div>}
			<div className="capitalize text-muted">
				{entity?.name ?? "Entité inconnue"}
			</div>
			<div>{describe(event, entityDomain(entity))}</div>
		</div>
	);
}

function TraceDate({ event }: { event: DomoEntityEvent }) {
	const date = new Date(event.occurred_at);
	const today = useToday();
	const isToday = date.toDateString() === today.toDateString();

	return (
		<div className="text-xs text-muted-foreground shrink-0 grow-0">
			{(isToday ? timeFormatter : dayTimeFormatter).format(date)}
		</div>
	);
}

export { Trace };
