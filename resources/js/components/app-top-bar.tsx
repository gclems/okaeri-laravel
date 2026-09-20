import { RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, cn, useSidebar } from "shanty-ui";

function AppTopBar() {
	const { open, setOpen } = useSidebar();

	return (
		<div className="flex gap-x-2">
			<Button variant="ghost" color="primary" onClick={() => setOpen(!open)}>
				<img src="/images/logo_image.png" alt="Logo" className="size-8" />
			</Button>
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
