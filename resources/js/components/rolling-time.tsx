import { motion } from "motion/react";
import { cn } from "shanty-ui";

import { RollingNumber } from "@/components/rolling-number";

export function RollingTime({
	className,
	date,
}: {
	className?: string;
	date: Date;
}) {
	return (
		<time className={cn("text-metric", className)}>
			<RollingNumber
				number={date.getHours()}
				formatter={(value) => Math.round(value).toString().padStart(2, "0")}
			/>
			<motion.span
				animate={{ opacity: [1, 1, 0, 0] }}
				transition={{
					duration: 2,
					times: [0, 0.5, 0.5, 1],
					repeat: Infinity,
					ease: "linear",
				}}
			>
				:
			</motion.span>
			<RollingNumber
				number={date.getMinutes()}
				formatter={(value) => Math.round(value).toString().padStart(2, "0")}
			/>
		</time>
	);
}
