import type { ComponentProps } from "react";

import { cn } from "shanty-ui";

/**
 * Meteocons ship with ~25% transparent padding on each side of their viewBox.
 * Scaling the image up while clipping the wrapper compensates for it so the
 * visible glyph fills the requested size.
 */
const METEOCON_PADDING_RATIO = 0.25;
const METEOCON_SCALE = 1 / (1 - METEOCON_PADDING_RATIO * 2);

export function Meteocon({
	className,
	...props
}: Omit<ComponentProps<"img">, "alt"> & {
	alt: string;
}) {
	return (
		<span className={cn("inline-block", className)}>
			{/* biome-ignore lint/a11y/useAltText: managed by props */}
			<img
				className="size-full"
				style={{ transform: `scale(${METEOCON_SCALE})` }}
				{...props}
			/>
		</span>
	);
}
