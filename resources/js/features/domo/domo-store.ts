import { create } from "zustand";

import type {
	DomoDevice,
	DomoEntity,
	DomoEntityAssignment,
	DomoEntityState,
	DomoRoom,
	SunPhase,
} from "@/types/models";

type Network = {
	txRateBps: number;
	rxRateBps: number;
};

type DomoStore = {
	roomsMap: Map<number, DomoRoom>;
	devicesMap: Map<number, DomoDevice>;
	entitiesMap: Map<number, DomoEntity>;
	statesMap: Map<number, DomoEntityState>;
	assignmentsMap: Map<number, DomoEntityAssignment>;
	sunPhasesMap: Map<string, SunPhase>;
	network: Network | null;

	updateRooms: (rooms: DomoRoom[], mode: UpdateMode) => void;
	updateDevices: (devices: DomoDevice[], mode: UpdateMode) => void;
	updateEntities: (entities: DomoEntity[], mode: UpdateMode) => void;
	updateStates: (states: DomoEntityState[], mode: UpdateMode) => void;
	updateAssignments: (
		assignments: DomoEntityAssignment[],
		mode: UpdateMode,
	) => void;
	updateSunPhases: (sunPhases: SunPhase[], mode: UpdateMode) => void;
	updateNetwork: (uplink: Network) => void;

	optimisticallyUpdateState: (stateId: number, value: string) => void;
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

const useDomoStore = create<DomoStore>((set) => ({
	roomsMap: new Map<number, DomoRoom>(),
	devicesMap: new Map<number, DomoDevice>(),
	entitiesMap: new Map<number, DomoEntity>(),
	statesMap: new Map<number, DomoEntityState>(),
	assignmentsMap: new Map<number, DomoEntityAssignment>(),
	sunPhasesMap: new Map<string, SunPhase>(),
	network: null,

	updateRooms: (rooms: DomoRoom[], mode: UpdateMode) =>
		set(() => ({
			roomsMap: updateMapFromArray(
				useDomoStore.getState().roomsMap,
				rooms,
				mode,
				(room) => room.id,
			),
		})),
	updateDevices: (devices: DomoDevice[], mode: UpdateMode) =>
		set(() => ({
			devicesMap: updateMapFromArray(
				useDomoStore.getState().devicesMap,
				devices,
				mode,
				(device) => device.id,
			),
		})),
	updateEntities: (entities: DomoEntity[], mode: UpdateMode) =>
		set(() => ({
			entitiesMap: updateMapFromArray(
				useDomoStore.getState().entitiesMap,
				entities,
				mode,
				(entity) => entity.id,
			),
		})),
	updateStates: (states: DomoEntityState[], mode: UpdateMode) => {
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
			statesMap: updateMapFromArray(
				useDomoStore.getState().statesMap,
				statesToApply,
				mode,
				(state) => state.id,
			),
		}));
	},
	updateAssignments: (assignments: DomoEntityAssignment[], mode: UpdateMode) =>
		set(() => ({
			assignmentsMap: updateMapFromArray(
				useDomoStore.getState().assignmentsMap,
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

	updateNetwork: (network: Network) =>
		set(() => ({
			network: network,
		})),

	optimisticallyUpdateState: (stateId: number, value: string) => {
		const statesMap = useDomoStore.getState().statesMap;
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
				statesMap: updateMapFromArray<number, DomoEntityState>(
					useDomoStore.getState().statesMap,
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

		set(() => ({
			statesMap: updateMapFromArray(
				statesMap,
				[{ ...current, value }],
				UpdateMode.Merge,
				(state) => state.id,
			),
		}));
	},
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
