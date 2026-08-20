export function getBatteryLevelColor(batteryLevel: number) {
	if (batteryLevel >= 80) {
		return "text-success";
	} else if (batteryLevel >= 50) {
		return "text-info";
	} else if (batteryLevel >= 20) {
		return "text-warning";
	} else {
		return "text-destructive";
	}
}
