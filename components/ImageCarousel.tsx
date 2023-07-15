// Carousel.tsx
import React, { CSSProperties } from "react";
import { useSnapCarousel } from "react-snap-carousel";

const styles = {
	root: { marginBottom: 20 },
	scroll: {
		position: "relative",
		display: "flex",
		overflow: "auto",
		scrollSnapType: "x mandatory",
		listStyleType: "none",
		marginBlockEnd: 0,
	},
	item: {
		width: "250px",
		height: "250px",
		flexShrink: 0,
	},
	itemSnapPoint: {
		scrollSnapAlign: "start",
	},
	controls: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	nextPrevButton: { margin: "10px", all: "unset", cursor: "pointer" },
	nextPrevButtonDisabled: { opacity: 0.3 },
	pagination: {
		display: "flex",
	},
	paginationButton: {
		all: "unset",
		cursor: "pointer",
		width: 5,
		height: 5,
		borderRadius: 5,
		border: "1px solid black",
		margin: 10,
	},
	paginationButtonActive: { opacity: 0.3 },
} as any;

interface CarouselProps<T> {
	readonly items: T[];
	readonly renderItem: (
		props: CarouselRenderItemProps<T>
	) => React.ReactElement<CarouselItemProps>;
}

interface CarouselRenderItemProps<T> {
	readonly item: T;
	readonly isSnapPoint: boolean;
}

export const Carousel = <T extends any>({
	items,
	renderItem,
}: CarouselProps<T>) => {
	const {
		scrollRef,
		pages,
		activePageIndex,
		prev,
		next,
		goTo,
		snapPointIndexes,
	} = useSnapCarousel();
	return (
		<div style={styles.root}>
			<ul style={styles.scroll} ref={scrollRef}>
				{items.map((item, i) =>
					renderItem({
						item,
						isSnapPoint: snapPointIndexes.has(i),
					})
				)}
			</ul>
			<div style={styles.controls} aria-hidden>
				<button
					style={{
						...styles.nextPrevButton,
						...(activePageIndex <= 0 ? styles.nextPrevButtonDisabled : {}),
					}}
					onClick={() => prev()}
				>
					←
				</button>
				{pages.map((_, i) => (
					<button
						key={i}
						style={{
							...styles.paginationButton,
							...(activePageIndex === i ? styles.paginationButtonActive : {}),
						}}
						onClick={() => goTo(i)}
					/>
				))}
				<button
					style={{
						...styles.nextPrevButton,
						...(activePageIndex === pages.length - 1
							? styles.nextPrevButtonDisabled
							: {}),
					}}
					onClick={() => next()}
				>
					→
				</button>
			</div>
		</div>
	);
};

interface CarouselItemProps {
	readonly isSnapPoint: boolean;
	readonly children?: React.ReactNode;
}

export const CarouselItem = ({ isSnapPoint, children }: CarouselItemProps) => (
	<li
		style={{
			...styles.item,
			...(isSnapPoint ? styles.itemSnapPoint : {}),
		}}
	>
		{children}
	</li>
);
