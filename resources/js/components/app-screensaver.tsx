import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { RollingTime } from "@/components/rolling-time";
import { useClock } from "@/features/clock/use-clock";

import { DinoSchedulePicture } from "./dino-schedule-picture";

const INACTIVITY_DELAY = 120_000;

function ScreensaverClock() {
	const now = useClock();

	return (
		<>
			<RollingTime
				date={now}
				className="text-[clamp(5rem,18vw,12rem)] leading-none text-primary"
			/>
			<p className="text-heading text-xl text-primary sm:text-2xl">
				{now.toLocaleDateString("fr-FR", {
					weekday: "long",
					day: "numeric",
					month: "long",
				})}
			</p>
		</>
	);
}

function AppScreensaver() {
	const [visible, setVisible] = useState(false);
	const timeoutRef = useRef<number>(undefined);
	const visibleRef = useRef(false);

	useEffect(() => {
		visibleRef.current = visible;
	}, [visible]);

	useEffect(() => {
		const scheduleScreensaver = () => {
			window.clearTimeout(timeoutRef.current);
			timeoutRef.current = window.setTimeout(() => {
				visibleRef.current = true;
				setVisible(true);
			}, INACTIVITY_DELAY);
		};

		const handleActivity = (event: Event) => {
			if (
				event instanceof KeyboardEvent &&
				event.key.toLowerCase() === "l" &&
				(event.ctrlKey || event.metaKey)
			) {
				event.preventDefault();
				window.clearTimeout(timeoutRef.current);
				const newVisible = !visibleRef.current;
				visibleRef.current = newVisible;
				setVisible(newVisible);
				return;
			}

			if (visibleRef.current) {
				if (event.type === "pointerdown") {
					visibleRef.current = false;
					setVisible(false);
					scheduleScreensaver();
				}
				return;
			}

			scheduleScreensaver();
		};

		const events = ["pointermove", "pointerdown", "keydown", "scroll"];

		for (const event of events) {
			window.addEventListener(event, handleActivity, { capture: true });
		}
		scheduleScreensaver();

		return () => {
			window.clearTimeout(timeoutRef.current);
			for (const event of events) {
				window.removeEventListener(event, handleActivity, { capture: true });
			}
		};
	}, []);

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					aria-label="Écran de veille. Cliquez pour revenir à l’application."
					data-slot="screensaver"
					className="fixed inset-0 z-99999 isolate flex cursor-pointer select-none flex-col items-center justify-center gap-5"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.4 }}
				>
					<div className="w-fit h-fit">
						<img
							src="/images/logo_image.png"
							alt="Logo"
							className="max-w-64 w-full"
						/>
						<DinoSchedulePicture className="w-40 absolute bottom-4 right-4" />
					</div>
					<ScreensaverClock />
					<p className="absolute bottom-10 text-sm text-primary/70">
						Cliquez pour continuer
					</p>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export { AppScreensaver };
