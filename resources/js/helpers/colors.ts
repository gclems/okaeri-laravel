const decomposeRGB = (rgb: string): [number, number, number] => {
	const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgb);
	if (!result) {
		return [255, 255, 255];
	}
	const [, r, g, b] = result;
	return [parseInt(r, 10), parseInt(g, 10), parseInt(b, 10)];
};

/**
 * Converts an sRGB channel (0-255) to linear light (0-1).
 */
const toLinear = (channel: number): number => {
	const value = channel / 255;
	return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
};

/**
 * Converts linear light (0-1) back to an sRGB channel (0-255).
 */
const toSRGB = (value: number): number =>
	Math.round(255 * (value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055));

/**
 * Visible color of a bulb: the amount of emitted light is scaled by its brightness (0-1)
 * in linear light, then gamma-encoded back, which matches how dimming is perceived.
 * A floor keeps dim bulbs from looking off.
 */
const getVisibleBulbColor = (
	rgb: string | null,
	brightness: number | null,
	minLevel = 0.1,
): string => {
	const level = minLevel + (1 - minLevel) * Math.min(1, Math.max(0, brightness ?? 1));
	const [r, g, b] = decomposeRGB(rgb ?? "rgb(255,255,255)").map((channel) =>
		toSRGB(toLinear(channel) * level),
	);

	return `rgb(${r}, ${g}, ${b})`;
};

export { decomposeRGB, getVisibleBulbColor };
