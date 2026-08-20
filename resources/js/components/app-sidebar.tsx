import { ElectricHome01Icon, HomeWifiIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, usePage } from "@inertiajs/react";
import { Separator, Sidebar, useSidebar } from "shanty-ui";

import { home } from "@/routes";
import homeArchitect from "@/routes/settings/home-architect";

function AppSidebar() {
	const { currentRouteName } = usePage().props;
	const sidebar = useSidebar();

	return (
		<Sidebar collapsible="icon">
			<Sidebar.Content className="flex-1">
				<button
					type="button"
					onClick={() => sidebar.setOpen(!sidebar.open)}
					className="flex flex-col items-center gap-1 mt-6 px-2 cursor-pointer"
				>
					<img src="/images/logo_image.png" alt="Logo" className="max-w-24 w-full" />
					{sidebar.open && (
						<img src="/images/logo_title_both.png" alt="Logo" className="max-w-36" />
					)}
				</button>
				<Separator className="my-4 bg-border" />
				<div className="flex-1">
					<Sidebar.Item
						render={<Link href={home()} />}
						isActive={currentRouteName === "home"}
					>
						<HugeiconsIcon icon={HomeWifiIcon} />
						Dashboard
					</Sidebar.Item>
				</div>

				<Separator className="bg-border my-4" />

				<Sidebar.Item
					render={<Link href={homeArchitect.index()} />}
					isActive={currentRouteName === "settings.home-architect.index"}
				>
					<HugeiconsIcon icon={ElectricHome01Icon} />
					Architecte
				</Sidebar.Item>
			</Sidebar.Content>
		</Sidebar>
	);
}

export { AppSidebar };
