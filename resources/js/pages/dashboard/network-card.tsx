import { useEffect, useMemo, useState } from "react";

import {
	ChartAverageIcon,
	InternetAntenna02Icon,
	QrCodeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Tooltip,
	XAxis,
	YAxis,
	createHorizontalChart,
} from "recharts";
import { Button, Card, cn } from "shanty-ui";

import WifiQrCodeController from "@/actions/App/Http/Controllers/WifiQrCodeController";
import { useDomoStore } from "@/features/domo/domo-store";

import { bitsToString } from "../../helpers/network";

type ChartValue = {
	rxRateBps: number;
	txRateBps: number;
	date: Date;
};

const Typed = createHorizontalChart<ChartValue, Date, number>()({
	Area,
	AreaChart,
	XAxis,
	YAxis,
	Tooltip,
});

const MAX_MEASUREMENTS = 100;

function NetworkCard() {
	const [mode, setMode] = useState<"monitoring" | "qrCode">("monitoring");

	return (
		<Card className="bg-linear-to-tl from-lighting/20 to-transparent">
			<Card.Header
				title={
					<div className="flex items-center justify-between">
						<div className="flex gap-x-2 items-center">
							<HugeiconsIcon icon={InternetAntenna02Icon} />
							Réseau
						</div>

						<Button
							variant="ghost"
							onClick={() => {
								setMode((current) =>
									current === "monitoring" ? "qrCode" : "monitoring",
								);
							}}
						>
							<HugeiconsIcon
								icon={mode === "monitoring" ? QrCodeIcon : ChartAverageIcon}
							/>
						</Button>
					</div>
				}
			/>
			<Card.Body>
				<div
					className={cn({
						hidden: mode !== "monitoring",
					})}
				>
					<Monitoring />
				</div>
				<div
					className={cn({
						hidden: mode !== "qrCode",
					})}
				>
					<QrCode />
				</div>
			</Card.Body>
		</Card>
	);
}

function Monitoring() {
	const [chartValues, setChartValues] = useState<ChartValue[]>([]);

	const network = useDomoStore((state) => state.network);

	const currentValue = useMemo(
		() => chartValues[chartValues.length - 1],
		[chartValues],
	);

	useEffect(() => {
		if (!network) return;
		const lastMeasurement = currentValue;

		const networkDownload = network.rxRateBps;
		const networkUpload = network.txRateBps;

		if (
			lastMeasurement &&
			lastMeasurement.rxRateBps === networkDownload &&
			lastMeasurement.txRateBps === networkUpload
		) {
			return;
		}

		const measurement: ChartValue[] = [
			...chartValues,
			{ rxRateBps: networkDownload, txRateBps: networkUpload, date: new Date() },
		];

		while (measurement.length > MAX_MEASUREMENTS) {
			measurement.shift();
		}

		setChartValues(measurement);
	}, [network, chartValues, currentValue]);

	return (
		<>
			{!network && (
				<div className="w-full h-full flex items-center justify-center text-muted">
					Pas de données
				</div>
			)}
			{network && (
				<>
					<Typed.AreaChart
						style={{
							width: "100%",
							maxWidth: "700px",
							maxHeight: "70vh",
							aspectRatio: 16 / 9,
						}}
						responsive
						data={chartValues}
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
					<div className="text-sm">
						<div className="flex items-center justify-between">
							<span className="text-download">Descendant</span>
							<span className="text-metric">
								{bitsToString(currentValue?.rxRateBps ?? 0)}
							</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-upload">Montant</span>
							<span className="text-metric">
								{bitsToString(currentValue?.txRateBps ?? 0)}
							</span>
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
				className={`size-48 ${qrCodeLoaded ? "opacity-100" : "opacity-0"}`}
				onLoad={() => setQrCodeLoaded(true)}
				onError={() => setQrCodeError(true)}
			/>
		</div>
	);
}

export { NetworkCard };
