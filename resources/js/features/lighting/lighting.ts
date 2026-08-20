import type { DomoEntityState } from "@/types/models";

export function getLightColorCode(state: DomoEntityState): string {
	if (state.value !== "on") return "rgba(0, 0, 0, 0)";

	const brightness = state.attributes.brightness as number | undefined | null;
	if (!brightness) return "rgba(0, 0, 0, 0)";

	if (brightness === 0) return "rgba(0, 0, 0, 0)";

	const rgbColor = state.attributes.rgb_color as
		| [number, number, number]
		| undefined
		| null;

	if (rgbColor) {
		const [r, g, b] = rgbColor;
		return `rgb(${r}, ${g}, ${b})`;
	}

	return "rgb(255, 255, 0)"; // a default "yellow" light if no color is specified but the light is on
}
