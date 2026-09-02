import { useEffect, useState } from "react";

const getToday = () => {
	const today = new Date();
	today.setUTCHours(0, 0, 0, 0);
	return today;
};

export function useToday(): Date {
	const [today, setToday] = useState<Date>(() => getToday());

	useEffect(() => {
		const tomorrow = new Date();
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setHours(0, 0, 0, 0);

		const timeUntilMidnight = tomorrow.getTime() - Date.now();

		const interval = window.setInterval(
			() => setToday(getToday()),
			timeUntilMidnight,
		);

		return () => window.clearInterval(interval);
	}, []);

	return today;
}
