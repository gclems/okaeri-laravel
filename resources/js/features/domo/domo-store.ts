import { create } from "zustand";

import type {
	DomoDevice,
	DomoEntity,
	DomoEntityAssignment,
	DomoEntityState,
	DomoRoom,
	SunPhase,
} from "@/types/models";
import type {
	Car,
	ClimateSensor,
	LightBulb,
	SwitchDevice,
	WeatherForecast,
} from "@/types/projections";

type Network = {
	txRateBps: number;
	rxRateBps: number;
	date: Date;
};

type DomoStore = {
	domoRoomsMap: Map<number, DomoRoom>;
	domoDevicesMap: Map<number, DomoDevice>;
	domoEntitiesMap: Map<number, DomoEntity>;
	domoStatesMap: Map<number, DomoEntityState>;
	domoAssignmentsMap: Map<number, DomoEntityAssignment>;

	sunPhasesMap: Map<string, SunPhase>;
	network: Network[];
	lightsMap: Map<number, LightBulb>;
	climateSensorsMap: Map<number, ClimateSensor>;
	carsMap: Map<number, Car>;
	switchesMap: Map<number, SwitchDevice>;
	weatherForecastsMap: Map<number, WeatherForecast>;

	updateDomoRooms: (domoRooms: DomoRoom[], mode: UpdateMode) => void;
	updateDomoDevices: (devices: DomoDevice[], mode: UpdateMode) => void;
	updateDomoEntities: (entities: DomoEntity[], mode: UpdateMode) => void;
	optimisticallyUpdateState: (stateId: number, value: string) => void;
	updateDomoStates: (states: DomoEntityState[], mode: UpdateMode) => void;

	updateDomoAssignments: (
		assignments: DomoEntityAssignment[],
		mode: UpdateMode,
	) => void;

	updateSunPhases: (sunPhases: SunPhase[], mode: UpdateMode) => void;
	addNetwork: (uplink: Network) => void;
	updateLights: (lights: LightBulb[], mode: UpdateMode) => void;
	updateClimateSensors: (
		climateSensors: ClimateSensor[],
		mode: UpdateMode,
	) => void;
	updateCars: (cars: Car[], mode: UpdateMode) => void;
	updateSwitches: (switches: SwitchDevice[], mode: UpdateMode) => void;
	updateWeatherForecasts: (
		weatherForecasts: WeatherForecast[],
		mode: UpdateMode,
	) => void;
};

enum UpdateMode {
	Replace = "replace",
	Merge = "merge",
}

type PendingOptimisticStateUpdate = {
	timeoutId: ReturnType<typeof setTimeout>;
	expectedValue: string;
	latestKnown: DomoEntityState;
};

const OPTIMISTIC_STATE_TIMEOUT_MS = 2000;

const pendingOptimisticStateUpdates = new Map<
	number,
	PendingOptimisticStateUpdate
>();

const MAX_NETWORK_MEASUREMENTS = 100;

const useDomoStore = create<DomoStore>((set) => ({
	domoRoomsMap: new Map<number, DomoRoom>(),
	domoDevicesMap: new Map<number, DomoDevice>(),
	domoEntitiesMap: new Map<number, DomoEntity>(),
	domoStatesMap: new Map<number, DomoEntityState>(),
	domoAssignmentsMap: new Map<number, DomoEntityAssignment>(),

	sunPhasesMap: new Map<string, SunPhase>(),
	network: [],
	lightsMap: new Map<number, LightBulb>(),
	climateSensorsMap: new Map<number, ClimateSensor>(),
	carsMap: new Map<number, Car>(),
	switchesMap: new Map<number, SwitchDevice>(),
	weatherForecastsMap: new Map<number, WeatherForecast>(),

	updateDomoRooms: (domoRooms: DomoRoom[], mode: UpdateMode) =>
		set(() => ({
			domoRoomsMap: updateMapFromArray(
				useDomoStore.getState().domoRoomsMap,
				domoRooms,
				mode,
				(room) => room.id,
			),
		})),
	updateDomoDevices: (devices: DomoDevice[], mode: UpdateMode) =>
		set(() => ({
			domoDevicesMap: updateMapFromArray(
				useDomoStore.getState().domoDevicesMap,
				devices,
				mode,
				(device) => device.id,
			),
		})),
	updateDomoEntities: (entities: DomoEntity[], mode: UpdateMode) =>
		set(() => ({
			domoEntitiesMap: updateMapFromArray(
				useDomoStore.getState().domoEntitiesMap,
				entities,
				mode,
				(entity) => entity.id,
			),
		})),
	updateDomoStates: (states: DomoEntityState[], mode: UpdateMode) => {
		const statesToApply = states.filter((state) => {
			const pending = pendingOptimisticStateUpdates.get(state.id);
			if (!pending) return true;

			pending.latestKnown = state;

			// While an optimistic update is pending, ignore transitional values
			// (e.g. HA briefly reporting "on" while a light group turns off)
			// and only accept the update once it matches the target value.
			if (state.value !== pending.expectedValue) return false;

			clearTimeout(pending.timeoutId);
			pendingOptimisticStateUpdates.delete(state.id);
			return true;
		});

		set(() => ({
			domoStatesMap: updateMapFromArray(
				useDomoStore.getState().domoStatesMap,
				statesToApply,
				mode,
				(state) => state.id,
			),
		}));
	},
	optimisticallyUpdateState: (stateId: number, value: string) => {
		const statesMap = useDomoStore.getState().domoStatesMap;
		const current = statesMap.get(stateId);
		if (!current) return;

		const existingPending = pendingOptimisticStateUpdates.get(stateId);
		if (existingPending) {
			clearTimeout(existingPending.timeoutId);
		}

		const latestKnown = existingPending ? existingPending.latestKnown : current;

		const timeoutId = setTimeout(() => {
			const pending = pendingOptimisticStateUpdates.get(stateId);
			pendingOptimisticStateUpdates.delete(stateId);
			if (!pending) return;

			set(() => ({
				domoStatesMap: updateMapFromArray<number, DomoEntityState>(
					useDomoStore.getState().domoStatesMap,
					[pending.latestKnown],
					UpdateMode.Merge,
					(state) => state.id,
				),
			}));
		}, OPTIMISTIC_STATE_TIMEOUT_MS);

		pendingOptimisticStateUpdates.set(stateId, {
			timeoutId,
			expectedValue: value,
			latestKnown,
		});
	},

	updateDomoAssignments: (
		assignments: DomoEntityAssignment[],
		mode: UpdateMode,
	) =>
		set(() => ({
			domoAssignmentsMap: updateMapFromArray(
				useDomoStore.getState().domoAssignmentsMap,
				assignments,
				mode,
				(assignment) => assignment.id,
			),
		})),

	updateSunPhases: (sunPhases: SunPhase[], mode: UpdateMode) =>
		set(() => ({
			sunPhasesMap: updateMapFromArray(
				useDomoStore.getState().sunPhasesMap,
				sunPhases,
				mode,
				(sunPhase) => new Date(sunPhase.date).toISOString(),
			),
		})),

	addNetwork: (network: Network) =>
		set((state) => {
			const lastEntry = state.network[state.network.length - 1];
			if (
				lastEntry &&
				lastEntry.txRateBps === network.txRateBps &&
				lastEntry.rxRateBps === network.rxRateBps
			) {
				return { network: state.network };
			}

			const newNetwork = [...state.network, network];
			while (newNetwork.length > MAX_NETWORK_MEASUREMENTS) {
				newNetwork.shift();
			}

			return {
				network: newNetwork,
			};
		}),

	updateLights: (lights: LightBulb[], mode: UpdateMode) =>
		set(() => ({
			lightsMap: updateMapFromArray(
				useDomoStore.getState().lightsMap,
				lights,
				mode,
				(light) => light.id,
			),
		})),

	updateClimateSensors: (climateSensors: ClimateSensor[], mode: UpdateMode) =>
		set(() => ({
			climateSensorsMap: updateMapFromArray(
				useDomoStore.getState().climateSensorsMap,
				climateSensors,
				mode,
				(climateSensor) => climateSensor.id,
			),
		})),

	updateCars: (cars: Car[], mode: UpdateMode) =>
		set(() => ({
			carsMap: updateMapFromArray(
				useDomoStore.getState().carsMap,
				cars,
				mode,
				(car) => car.id,
			),
		})),

	updateSwitches: (switches: SwitchDevice[], mode: UpdateMode) =>
		set(() => ({
			switchesMap: updateMapFromArray(
				useDomoStore.getState().switchesMap,
				switches,
				mode,
				(switchDevice) => switchDevice.id,
			),
		})),

	updateWeatherForecasts: (
		weatherForecasts: WeatherForecast[],
		mode: UpdateMode,
	) =>
		set(() => ({
			weatherForecastsMap: updateMapFromArray(
				useDomoStore.getState().weatherForecastsMap,
				weatherForecasts,
				mode,
				(weatherForecast) => weatherForecast.id,
			),
		})),
}));

const updateMapFromArray = <T, Y>(
	map: Map<T, Y>,
	items: Y[],
	mode: UpdateMode,
	getId: (item: Y) => T,
) => {
	const newMap = new Map(mode === UpdateMode.Merge ? map : undefined);

	items.forEach((item) => {
		newMap.set(getId(item), item);
	});

	return newMap;
};

export { UpdateMode, useDomoStore };
export type { Network };
