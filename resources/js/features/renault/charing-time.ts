export function getChargingTime(chargingTimeInMinutes: number) {
	const hours = Math.floor(chargingTimeInMinutes / 60);
	const minutes = chargingTimeInMinutes % 60;
	return { hours, minutes };
}

export function getEndOfChargeDate(chargingTimeInMinutes: number) {
	const now = new Date();
	const endOfChargeDate = new Date(
		now.getTime() + chargingTimeInMinutes * 60 * 1000,
	);

	return endOfChargeDate;
}
