import { useEchoPublic } from "@laravel/echo-react";

import { useDomoStore } from "@/features/domo/domo-store";

type UnifyUplinkUpdatedEvent = {
	txRateBps: number;
	rxRateBps: number;
};

function NetworkUpdater() {
	const updateNetwork = useDomoStore((state) => state.updateNetwork);

	useEchoPublic(
		"unify",
		".UnifyUplinkUpdated",
		(event: UnifyUplinkUpdatedEvent) => {
			updateNetwork({
				txRateBps: event.txRateBps,
				rxRateBps: event.rxRateBps,
			});
		},
	);

	return null;
}

export { NetworkUpdater };
