import { type ReactNode, useMemo } from "react";

import { motion } from "motion/react";
import { ShantyRoot } from "shanty-ui";

import { AppScreensaver } from "@/components/app-screensaver";
import { AppSidebar } from "@/components/app-sidebar";
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

function Layout({ children }: { children: ReactNode }) {
	useTheme();
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
			<ShantyRoot toast tooltip sidebar={{ defaultOpen: false }}>
				<motion.div
					className="w-screen h-screen flex relative bg-cover"
					initial={{ filter: "blur(10px)" }}
					animate={{ filter: "blur(0px)" }}
					style={{
						backgroundImage: `url(${bgImage})`,
					}}
				>
					<div className="w-fit h-full min-h-full max-h-full overflow-auto">
						<AppSidebar />
					</div>
					<main className="flex-1 h-full min-h-full max-h-full overflow-auto flex flex-col p-2 gap-y-2">
						<AppTopBar />
						<div>{children}</div>
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
