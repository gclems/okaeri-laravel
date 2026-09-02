import type { ReactNode } from "react";

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
import { useTheme } from "@/features/use-theme";

function Layout({ children }: { children: ReactNode }) {
	useTheme();

	return (
		<>
			<ShantyRoot toast tooltip sidebar={{ defaultOpen: false }}>
				<motion.div
					className="w-screen h-screen flex relative"
					initial={{ filter: "blur(10px)" }}
					animate={{ filter: "blur(0px)" }}
				>
					<div className="w-fit h-full min-h-full max-h-full overflow-auto">
						<AppSidebar />
					</div>
					<main className="flex-1 h-full min-h-full max-h-full overflow-auto flex flex-col px-6 py-6 gap-y-6">
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
