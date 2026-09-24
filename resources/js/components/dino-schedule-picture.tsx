import type { ComponentProps } from "react";

import { useClock } from "@/features/clock/use-clock";

const dinoSources = [
	{
		src: "/images/animations/sleeping-dino-night.png",
		from: 0, // midnight
		to: 8 * 60, // 8 AM in minutes
	},
	{
		src: "/images/animations/dino-washing.png",
		from: 8 * 60, // 8 AM in minutes
		to: 8.5 * 60, // 8:30 AM in minutes
	},
	{
		src: "/images/animations/dino-computing.png",
		from: 8.5 * 60, // 8:30 AM in minutes
		to: 12 * 60, // 12 PM in minutes
	},
	{
		src: "/images/animations/dino-cooking.png",
		from: 12 * 60, // 12 PM in minutes
		to: 13 * 60, // 1 PM in minutes
	},
	{
		src: "/images/animations/dino-vacuum.png",
		from: 13 * 60, // 1 PM in minutes
		to: 14 * 60, // 2 PM in minutes
	},
	{
		src: "/images/animations/dino-computing.png",
		from: 14 * 60, // 2 PM in minutes
		to: 17 * 60, // 5 PM in minutes
	},
	{
		src: "/images/animations/dino-workout.png",
		from: 17 * 60, // 5 PM in minutes
		to: 18 * 60, // 6 PM in minutes
	},
	{
		src: "/images/animations/dino-gaming.png",
		from: 18 * 60, // 6 PM in minutes
		to: 19 * 60, // 7 PM in minutes
	},
	{
		src: "/images/animations/dino-eating.png",
		from: 19 * 60, // 7 PM in minutes
		to: 20 * 60, // 8 PM in minutes
	},
	{
		src: "/images/animations/dino-movie.png",
		from: 20 * 60, // 8 PM in minutes
		to: 22 * 60, // 10 PM in minutes
	},
	{
		src: "/images/animations/dino-reading.png",
		from: 22 * 60, // 10 PM in minutes
		to: 23 * 60, // 11 PM in minutes
	},
	{
		src: "/images/animations/sleeping-dino-night.png",
		from: 23 * 60, // 11 PM in minutes
		to: 0, // midnight
	},
];

const fallbackSrc = "/images/animations/dino-look-up.png";

function DinoSchedulePicture({
	alt = "Dino Schedule",
	...props
}: ComponentProps<"img">) {
	const now = useClock();

	const currentMinutes = now.getHours() * 60 + now.getMinutes();
	const source = dinoSources.find(
		({ from, to }) =>
			(from <= to && currentMinutes >= from && currentMinutes < to) ||
			(from > to && (currentMinutes >= from || currentMinutes < to)),
	);

	return <img src={source?.src ?? fallbackSrc} alt={alt} {...props} />;
}

export { DinoSchedulePicture };
