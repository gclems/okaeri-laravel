import { useMemo, useState } from "react";

import {
	ChartAverageIcon,
	InternetAntenna02Icon,
	QrCodeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
	createHorizontalChart,
} from "recharts";
import { Button, Card } from "shanty-ui";

import WifiQrCodeController from "@/actions/App/Http/Controllers/WifiQrCodeController";
import { useClock } from "@/features/clock/use-clock";
import { type Network, useDomoStore } from "@/features/domo/domo-store";

import { bitsToString } from "../../helpers/network";

const Typed = createHorizontalChart<Network, Date, number>()({
	Area,
	AreaChart,
	XAxis,
	YAxis,
	Tooltip,
});

function NetworkCard() {
	const [mode, setMode] = useState<"monitoring" | "qrCode">("monitoring");

	function toggleMode() {
		setMode((current) => (current === "monitoring" ? "qrCode" : "monitoring"));
	}

	return (
		<Card className="bg-linear-to-tl from-lighting/20 to-transparent">
			<Card.Header
				title={
					<div className="flex items-center justify-between">
						<div className="flex gap-x-2 items-center">
							<HugeiconsIcon icon={InternetAntenna02Icon} />
							Réseau
						</div>

						<Button variant="ghost" onClick={toggleMode}>
							<HugeiconsIcon
								icon={mode === "monitoring" ? QrCodeIcon : ChartAverageIcon}
							/>
						</Button>
					</div>
				}
			/>
			<Card.Body className="grid overflow-hidden">
				<motion.div
					className="col-start-1 row-start-1"
					initial={false}
					animate={{
						x: mode === "monitoring" ? "0%" : "-100%",
						opacity: mode === "monitoring" ? 1 : 0,
					}}
					transition={{ duration: 0.15, ease: "easeInOut" }}
				>
					<Monitoring />
				</motion.div>
				<motion.div
					className="col-start-1 row-start-1"
					initial={false}
					animate={{
						x: mode === "qrCode" ? "0%" : "100%",
						opacity: mode === "qrCode" ? 1 : 0,
					}}
					transition={{ duration: 0.15, ease: "easeInOut" }}
				>
					<QrCode />
				</motion.div>
			</Card.Body>
		</Card>
	);
}

function Monitoring() {
	const network = useDomoStore((state) => state.network);
	const now = useClock();

	const firstValue = network[0];
	const lastValue = network[network.length - 1];

	const secondsSinceUpdate = Math.max(
		0,
		now.getTime() - (lastValue?.date.getTime() ?? 0),
	);
	const totalTime =
		(lastValue?.date.getTime() ?? 0) - (firstValue?.date.getTime() ?? 0);

	const dlAvg = useMemo(() => {
		if (network.length === 0) return 0;
		const total = network.reduce((sum, entry) => sum + (entry.rxRateBps ?? 0), 0);
		return total / network.length;
	}, [network]);

	const ulAvg = useMemo(() => {
		if (network.length === 0) return 0;
		const total = network.reduce((sum, entry) => sum + (entry.txRateBps ?? 0), 0);
		return total / network.length;
	}, [network]);

	return (
		<>
			{!network.length && (
				<div className="w-full h-full flex items-center justify-center text-muted">
					Pas de données
				</div>
			)}
			{network.length > 0 && (
				<>
					<Typed.AreaChart
						style={{
							width: "100%",
							maxWidth: "700px",
							maxHeight: "70vh",
							aspectRatio: 16 / 9,
						}}
						responsive
						data={network}
					>
						<defs>
							<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--download)" stopOpacity={0.8} />
								<stop offset="95%" stopColor="var(--download)" stopOpacity={0} />
							</linearGradient>
							<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--upload)" stopOpacity={0.8} />
								<stop offset="95%" stopColor="var(--upload)" stopOpacity={0} />
							</linearGradient>
						</defs>
						<CartesianGrid />
						<Typed.Area
							type="basis"
							dataKey="rxRateBps"
							stroke="var(--download)"
							activeDot={{ stroke: "var(--download)" }}
							fillOpacity={1}
							fill="url(#colorUv)"
							isAnimationActive
							animationBegin={200}
							animationDuration={1300}
						/>
						<Typed.Area
							type="basis"
							dataKey="txRateBps"
							stroke="var(--upload)"
							activeDot={{ stroke: "var(--upload)" }}
							fillOpacity={1}
							fill="url(#colorPv)"
							isAnimationActive
							animationBegin={200}
							animationDuration={1300}
						/>
					</Typed.AreaChart>
					<div className="text-xs">
						<div className="flex items-baseline">
							<span className="text-download">Descendant</span>
							<div className="flex-1 border-b border-dotted border-muted" />
							<span className="text-metric">
								{bitsToString(lastValue?.rxRateBps ?? 0)}
							</span>
						</div>
						<div className="text-muted text-xs text-right">
							<span className="">moy: </span>
							<span className="text-metric">{bitsToString(dlAvg)}</span>
						</div>
						<div className="flex items-baseline">
							<span className="text-upload">Montant</span>
							<div className="flex-1 border-b border-dotted border-muted" />
							<span className="text-metric">
								{bitsToString(lastValue?.txRateBps ?? 0)}
							</span>
						</div>
						<div className="text-muted text-xs text-right">
							<span className="">moy: </span>
							<span className="text-metric">{bitsToString(ulAvg)}</span>
						</div>
						<div className="text-muted text-xs text-right mt-4">
							<div>Moyennes sur environ {Math.floor(totalTime / 1000 / 60)}mins</div>
							<div>
								<span className="">Mis à jour il y a </span>
								<span className="text-metric">
									{secondsSinceUpdate != null
										? `${Math.floor(secondsSinceUpdate / 1000)}s`
										: "N/A"}
								</span>
							</div>
						</div>
					</div>
				</>
			)}
		</>
	);
}

function QrCode() {
	const [qrCodeLoaded, setQrCodeLoaded] = useState(false);
	const [qrCodeError, setQrCodeError] = useState(false);

	return (
		<div className="relative size-full">
			{!qrCodeLoaded && !qrCodeError && (
				<div className="absolute inset-0 flex items-center justify-center text-muted text-sm animate-pulse">
					Chargement...
				</div>
			)}
			{qrCodeError && (
				<div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
					Erreur de chargement
				</div>
			)}
			<img
				src={WifiQrCodeController.show.url()}
				alt="Qr Code"
				className={`max-h-full max-w-full aspect-square rounded-lg ${qrCodeLoaded ? "opacity-100" : "opacity-0"}`}
				onLoad={() => setQrCodeLoaded(true)}
				onError={() => setQrCodeError(true)}
			/>
		</div>
	);
}

export { NetworkCard };
