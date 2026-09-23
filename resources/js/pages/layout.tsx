import { type ReactNode, useMemo } from "react";

import { motion } from "motion/react";
import { ShantyRoot } from "shanty-ui";

import { AppScreensaver } from "@/components/app-screensaver";
import { AppTopBar } from "@/components/app-top-bar";
import { DomoDevicesUpdater } from "@/components/domo-store/domo-devices-updater";
import { DomoEntitiesUpdater } from "@/components/domo-store/domo-entities-updater";
import { DomoEntityAssignmentsUpdater } from "@/components/domo-store/domo-entity-assignments-updater";
import { DomoEntityStatesUpdater } from "@/components/domo-store/domo-entity-states-updater";
import { DomoRoomsUpdater } from "@/components/domo-store/domo-rooms-updater";
import { NetworkUpdater } from "@/components/domo-store/network-updater";
import { ProjectionsUpdater } from "@/components/domo-store/projections-updater";
import { SunPhaseUpdater } from "@/components/domo-store/sun-phase-updater";
import { useClock } from "@/features/clock/use-clock";
import { useDomoStore } from "@/features/domo/domo-store";
import { useTheme } from "@/features/use-theme";
import { getWeatherConditionBackground } from "@/features/weather/weather-condition";
import { useAppUpdated } from "@/features/websocket/use-app-restarted";

function Layout({ children }: { children: ReactNode }) {
	useTheme();
	useAppUpdated();
	const now = useClock();

	const weatherForecastsMap = useDomoStore((state) => state.weatherForecastsMap);
	const weatherForecast = useMemo(
		() => Array.from(weatherForecastsMap.values())[0],
		[weatherForecastsMap],
	);

	const bgImage = getWeatherConditionBackground(
		weatherForecast?.condition?.condition ?? null,
		now,
	);

	return (
		<>
			<ShantyRoot toast tooltip>
				<motion.div
					className="w-screen h-screen flex bg-cover"
					initial={{ filter: "blur(10px)" }}
					animate={{ filter: "blur(0px)" }}
					style={{
						backgroundImage: `url(${bgImage})`,
					}}
				>
					<main className="relative flex-1 h-full min-h-full max-h-full overflow-auto flex flex-col p-2 gap-y-2">
						{children}
						<AppTopBar />
					</main>
				</motion.div>
			</ShantyRoot>
			<AppScreensaver />

			<DomoRoomsUpdater />
			<DomoDevicesUpdater />
			<DomoEntitiesUpdater />
			<DomoEntityAssignmentsUpdater />
			<DomoEntityStatesUpdater />

			<SunPhaseUpdater />
			<ProjectionsUpdater />
			<NetworkUpdater />
		</>
	);
}

export { Layout };
