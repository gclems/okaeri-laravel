"use client";

import * as React from "react";

import useEmblaCarousel, {
	type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button, cn } from "shanty-ui";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
	opts?: CarouselOptions;
	plugins?: CarouselPlugin;
	orientation?: "horizontal" | "vertical";
	setApi?: (api: CarouselApi) => void;
	autoplay?: boolean;
};

const AUTOPLAY_DELAY_MS = 5000;

type CarouselContextProps = {
	carouselRef: ReturnType<typeof useEmblaCarousel>[0];
	api: ReturnType<typeof useEmblaCarousel>[1];
	scrollPrev: () => void;
	scrollNext: () => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
	itemsCount: number;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
	const context = React.useContext(CarouselContext);

	if (!context) {
		throw new Error("useCarousel must be used within a <Carousel />");
	}

	return context;
}

function Carousel({
	orientation = "horizontal",
	opts,
	setApi,
	plugins,
	autoplay = false,
	className,
	children,
	...props
}: React.ComponentProps<"div"> & CarouselProps) {
	const [carouselRef, api] = useEmblaCarousel(
		{
			...opts,
			axis: orientation === "horizontal" ? "x" : "y",
		},
		plugins,
	);
	const [canScrollPrev, setCanScrollPrev] = React.useState(false);
	const [canScrollNext, setCanScrollNext] = React.useState(false);

	const onSelect = React.useCallback((api: CarouselApi) => {
		if (!api) return;
		setCanScrollPrev(api.canScrollPrev());
		setCanScrollNext(api.canScrollNext());
	}, []);

	const scrollPrev = React.useCallback(() => {
		api?.scrollPrev();
	}, [api]);

	const scrollNext = React.useCallback(() => {
		api?.scrollNext();
	}, [api]);

	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				scrollPrev();
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				scrollNext();
			}
		},
		[scrollPrev, scrollNext],
	);

	React.useEffect(() => {
		if (!api || !setApi) return;
		setApi(api);
	}, [api, setApi]);

	React.useEffect(() => {
		if (!api) return;
		onSelect(api);
		api.on("reInit", onSelect);
		api.on("select", onSelect);

		return () => {
			api?.off("select", onSelect);
		};
	}, [api, onSelect]);

	React.useEffect(() => {
		if (!api || !autoplay) return;

		let timeout: ReturnType<typeof setTimeout>;

		const scheduleNext = () => {
			timeout = setTimeout(() => {
				api.scrollNext();
			}, AUTOPLAY_DELAY_MS);
		};

		const resetTimer = () => {
			clearTimeout(timeout);
			scheduleNext();
		};

		scheduleNext();
		api.on("select", resetTimer);

		return () => {
			clearTimeout(timeout);
			api.off("select", resetTimer);
		};
	}, [api, autoplay]);

	return (
		<CarouselContext.Provider
			value={{
				carouselRef,
				api: api,
				opts,
				orientation:
					orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
				scrollPrev,
				scrollNext,
				canScrollPrev,
				canScrollNext,
				itemsCount: api?.scrollSnapList().length ?? 0,
			}}
		>
			<section
				onKeyDownCapture={handleKeyDown}
				className={cn("relative", className)}
				role="region"
				aria-roledescription="carousel"
				data-slot="carousel"
				{...props}
			>
				{children}
			</section>
		</CarouselContext.Provider>
	);
}

const useDotButton = (emblaApi: ReturnType<typeof useEmblaCarousel>[1]) => {
	const [selectedIndex, setSelectedIndex] = React.useState(0);
	const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

	const onDotButtonClick = React.useCallback(
		(index: number) => {
			if (!emblaApi) return;
			emblaApi.scrollTo(index);
		},
		[emblaApi],
	);

	const onInit = React.useCallback(
		(emblaApi: ReturnType<typeof useEmblaCarousel>[1]) => {
			setScrollSnaps(emblaApi?.scrollSnapList() ?? []);
		},
		[],
	);

	const onSelect = React.useCallback(
		(emblaApi: ReturnType<typeof useEmblaCarousel>[1]) => {
			setSelectedIndex(emblaApi?.selectedScrollSnap() ?? 0);
		},
		[],
	);

	React.useEffect(() => {
		if (!emblaApi) return;

		onInit(emblaApi);
		onSelect(emblaApi);

		emblaApi
			.on("init", onInit)
			.on("reInit", onInit)
			.on("init", onSelect)
			.on("reInit", onSelect)
			.on("select", onSelect);
	}, [emblaApi, onInit, onSelect]);

	return {
		selectedIndex,
		scrollSnaps,
		onDotButtonClick,
	};
};

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
	const { carouselRef, orientation } = useCarousel();

	return (
		<div
			ref={carouselRef}
			className="overflow-hidden"
			data-slot="carousel-content"
		>
			<div
				className={cn(
					"flex",
					orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
	const { orientation } = useCarousel();

	return (
		// biome-ignore lint/a11y/useSemanticElements: need.a div here
		<div
			role="group"
			aria-roledescription="slide"
			data-slot="carousel-item"
			className={cn(
				"min-w-0 shrink-0 grow-0 basis-full",
				orientation === "horizontal" ? "pl-4" : "pt-4",
				className,
			)}
			{...props}
		/>
	);
}

function CarouselPrevious({
	className,
	variant = "ghost",
	size = "sm",
	...props
}: React.ComponentProps<typeof Button>) {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel();

	return (
		<Button
			data-slot="carousel-previous"
			variant={variant}
			size={size}
			square
			className={cn(
				"absolute touch-manipulation rounded-full",
				orientation === "horizontal"
					? "inset-y-0 -left-12 my-auto"
					: "-top-12 left-1/2 -translate-x-1/2 rotate-90",
				className,
			)}
			disabled={!canScrollPrev}
			onClick={scrollPrev}
			{...props}
		>
			<ChevronLeftIcon className="cn-rtl-flip" />
			<span className="sr-only">Previous slide</span>
		</Button>
	);
}

function CarouselNext({
	className,
	variant = "ghost",
	size = "sm",
	...props
}: React.ComponentProps<typeof Button>) {
	const { orientation, scrollNext, canScrollNext } = useCarousel();

	return (
		<Button
			data-slot="carousel-next"
			variant={variant}
			size={size}
			square
			className={cn(
				"absolute touch-manipulation rounded-full",
				orientation === "horizontal"
					? "inset-y-0 -right-12 my-auto"
					: "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
				className,
			)}
			disabled={!canScrollNext}
			onClick={scrollNext}
			{...props}
		>
			<ChevronRightIcon className="cn-rtl-flip" />
			<span className="sr-only">Next slide</span>
		</Button>
	);
}

function CarouselDots() {
	const { api } = useCarousel();
	const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

	return (
		<div className="flex gap-x-1 justify-center">
			{scrollSnaps.map((_, index) => (
				<button
					type="button"
					// biome-ignore lint/suspicious/noArrayIndexKey: needed here
					key={index}
					className={cn(
						"appearance-none size-2 border-2 border-primary rounded-full",
						{
							"bg-primary": selectedIndex === index,
						},
					)}
					onClick={() => onDotButtonClick(index)}
				/>
			))}
		</div>
	);
}

export {
	Carousel,
	type CarouselApi,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	useCarousel,
};
