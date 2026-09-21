import type { ComponentProps } from "react";

import { HomeWifiIcon, Menu01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, usePage } from "@inertiajs/react";
import { Button, cn, Drawer, ScrollArea } from "shanty-ui";

import { home } from "@/routes";

function AppSidebar() {
	return (
		<Drawer>
			<Drawer.Trigger
				render={<Button variant="ghost" />}
				className="bg-surface border-3 border-primary rounded-full"
			>
				<HugeiconsIcon icon={Menu01Icon} />
			</Drawer.Trigger>
			<Drawer.Popup size="sm" side="left" className="p-0 pt-4">
				<div className="h-full overflow-hidden w-full flex flex-col gap-y-4">
					<Drawer.Trigger
						render={<button type="button" />}
						className="appearance-none flex flex-col items-center gap-1 px-2 cursor-pointer shrink-0 grow-0"
					>
						<img
							src="/images/logo_image.png"
							alt="Logo"
							className="max-w-24 w-full"
						/>
						<img src="/images/logo_title_both.png" alt="Logo" className="max-w-36" />
					</Drawer.Trigger>

					<ScrollArea vertical className="flex-1 -mr-2">
						<ul>
							<MenuItem href={home()} routeName="home">
								<HugeiconsIcon icon={HomeWifiIcon} /> Dashboard
							</MenuItem>
						</ul>
					</ScrollArea>
				</div>
			</Drawer.Popup>
		</Drawer>
	);
}

function MenuItem({
	children,
	routeName,
	href,
}: {
	children: React.ReactNode;
	routeName: string;
	href: ComponentProps<typeof Link>["href"];
}) {
	const { currentRouteName } = usePage().props;

	return (
		<li className="w-full">
			<Link
				className={cn("flex gap-x-2 items-center py-2 px-4", {
					"bg-primary text-primary-foreground": routeName === currentRouteName,
				})}
				href={href}
			>
				{children}
			</Link>
		</li>
	);
}

export { AppSidebar };
