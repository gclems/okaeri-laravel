import { useEchoPublic } from "@laravel/echo-react";

import { useDomoStore } from "@/features/domo/domo-store";

type UnifyUplinkUpdatedEvent = {
	txRateBps: number;
	rxRateBps: number;
};

function NetworkUpdater() {
	const addNetwork = useDomoStore((state) => state.addNetwork);

	useEchoPublic(
		"unify",
		".UnifyUplinkUpdated",
		(event: UnifyUplinkUpdatedEvent) => {
			// if not, add the value
			addNetwork({
				txRateBps: event.txRateBps,
				rxRateBps: event.rxRateBps,
				date: new Date(),
			});
		},
	);

	return null;
}

export { NetworkUpdater };
