import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, cn } from "shanty-ui";

import { AppSidebar } from "./app-sidebar";

function AppTopBar() {
	return (
		<div className="fixed top-4 left-4 flex gap-x-2">
			<AppSidebar />

			<div
				className={cn(
					"shrink-0 bg-white/20 bg-none! border-none! before:content-none!",
					"flex items-center justify-between gap-x-2",
				)}
			>
				<Button
					size="sm"
					variant="outlined"
					color="neutral"
					square
					onClick={() => window.location.reload()}
				>
					<HugeiconsIcon icon={RefreshIcon} />
				</Button>
			</div>
		</div>
	);
}

export { AppTopBar };
