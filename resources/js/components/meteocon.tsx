import type { ComponentProps } from "react";

export function Meteocon(
	props: Omit<ComponentProps<"img">, "alt"> & {
		alt: string;
	},
) {
	// biome-ignore lint/a11y/useAltText: managed by props
	return <img {...props} />;
}
