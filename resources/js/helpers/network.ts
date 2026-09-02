export function bitsToString(bits: number): string {
	const toBytes = bits / 8;
	const toKB = toBytes / 1024;
	const toMB = toKB / 1024;
	const toGB = toMB / 1024;

	if (toGB >= 1) {
		return `${toGB.toFixed(2)} Go/s`;
	}
	if (toMB >= 1) {
		return `${toMB.toFixed(2)} Mo/s`;
	}
	if (toKB >= 1) {
		return `${toKB.toFixed(2)} Ko/s`;
	}

	return `${toBytes.toFixed(2)} o/s`;
}
