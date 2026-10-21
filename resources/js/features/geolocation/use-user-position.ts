import { useEffect, useState } from "react";

export type UserPosition = {
	latitude: number;
	longitude: number;
	accuracy: number;
};

/**
 * Watches the device position through the browser Geolocation API.
 * Requires a secure context (HTTPS or localhost) and the user's permission; stays `null` otherwise.
 */
export function useUserPosition() {
	const [position, setPosition] = useState<UserPosition | null>(null);

	useEffect(() => {
		if (!window.isSecureContext || !("geolocation" in navigator)) {
			return;
		}

		const watchId = navigator.geolocation.watchPosition(
			({ coords }) =>
				setPosition({
					latitude: coords.latitude,
					longitude: coords.longitude,
					accuracy: coords.accuracy,
				}),
			() => setPosition(null),
			{ enableHighAccuracy: true, maximumAge: 10_000, timeout: 20_000 },
		);

		return () => navigator.geolocation.clearWatch(watchId);
	}, []);

	return position;
}
