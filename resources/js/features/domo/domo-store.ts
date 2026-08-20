import { create } from "zustand";

import type {
	DomoDevice,
	DomoEntity,
	DomoEntityAssignment,
	DomoEntityState,
	DomoRoom,
	SunPhase,
} from "@/types/models";

type DomoStore = {
	roomsMap: Map<number, DomoRoom>;
	devicesMap: Map<number, DomoDevice>;
	entitiesMap: Map<number, DomoEntity>;
	statesMap: Map<number, DomoEntityState>;
	assignmentsMap: Map<number, DomoEntityAssignment>;
	sunPhase: SunPhase | null;

	updateRooms: (rooms: DomoRoom[], mode: UpdateMode) => void;
	updateDevices: (devices: DomoDevice[], mode: UpdateMode) => void;
	updateEntities: (entities: DomoEntity[], mode: UpdateMode) => void;
	updateStates: (states: DomoEntityState[], mode: UpdateMode) => void;
	updateAssignments: (
		assignments: DomoEntityAssignment[],
		mode: UpdateMode,
	) => void;
	updateSunPhase: (sunPhase: SunPhase | null) => void;

	optimisticallyUpdateState: (stateId: number, value: string) => void;
};

enum UpdateMode {
	Replace = "replace",
	Merge = "merge",
}

type PendingOptimisticStateUpdate = {
	timeoutId: ReturnType<typeof setTimeout>;
	expectedValue: string;
	// Most recent value actually received from HA, tracked even when it's
	// ignored for display (transitional value that doesn't match expectedValue).
	// This is what we roll back to if the expected value never shows up.
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
	sunPhase: null,

	updateRooms: (rooms: DomoRoom[], mode: UpdateMode) =>
		set(() => ({
			roomsMap: updateMap(useDomoStore.getState().roomsMap, rooms, mode),
		})),
	updateDevices: (devices: DomoDevice[], mode: UpdateMode) =>
		set(() => ({
			devicesMap: updateMap(useDomoStore.getState().devicesMap, devices, mode),
		})),
	updateEntities: (entities: DomoEntity[], mode: UpdateMode) =>
		set(() => ({
			entitiesMap: updateMap(useDomoStore.getState().entitiesMap, entities, mode),
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
			statesMap: updateMap(useDomoStore.getState().statesMap, statesToApply, mode),
		}));
	},
	updateAssignments: (assignments: DomoEntityAssignment[], mode: UpdateMode) =>
		set(() => ({
			assignmentsMap: updateMap(
				useDomoStore.getState().assignmentsMap,
				assignments,
				mode,
			),
		})),
	updateSunPhase: (sunPhase: SunPhase | null) =>
		set(() => ({
			sunPhase: sunPhase,
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
				statesMap: updateMap(
					useDomoStore.getState().statesMap,
					[pending.latestKnown],
					UpdateMode.Merge,
				),
			}));
		}, OPTIMISTIC_STATE_TIMEOUT_MS);

		pendingOptimisticStateUpdates.set(stateId, {
			timeoutId,
			expectedValue: value,
			latestKnown,
		});

		set(() => ({
			statesMap: updateMap(statesMap, [{ ...current, value }], UpdateMode.Merge),
		}));
	},
}));

const updateMap = <T extends { id: number }>(
	map: Map<number, T>,
	items: T[],
	mode: UpdateMode,
) => {
	const newMap = new Map(mode === UpdateMode.Merge ? map : undefined);

	items.forEach((item) => {
		newMap.set(item.id, item);
	});

	return newMap;
};

export { UpdateMode, useDomoStore };
