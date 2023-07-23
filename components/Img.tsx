import React, { useRef, useState, useLayoutEffect } from "react";

interface ImgProps {
	description: string;
	imageUrl: string;
}

const Img: React.FC<ImgProps> = ({ description, imageUrl }) => {
	const containerRef = useRef<HTMLDivElement>(null);

	function useWindowSize(): [number, number] {
		const [windowSize, setWindowSize] = useState<[number, number]>([0, 0]);

		useLayoutEffect(() => {
			function updateSize() {
				if (containerRef.current) {
					setWindowSize([
						containerRef.current.offsetWidth,
						containerRef.current.offsetHeight,
					]);
				}
			}

			window.addEventListener("resize", updateSize);
			updateSize();

			return () => window.removeEventListener("resize", updateSize);
		}, []);

		return windowSize;
	}

	const [windowWidth] = useWindowSize();
	const [isFullScreen, setIsFullScreen] = useState(false);

	return (
		<div>
			{isFullScreen && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100vh",
						backgroundColor: "rgba(0, 0, 0, 0.9)",
						zIndex: 9999999,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
					onClick={() => setIsFullScreen(false)}
				>
					<img
						style={{
							maxWidth: "100%",
							maxHeight: "100%",
							objectFit: "contain",
							margin: "auto",
						}}
						src={imageUrl}
						alt="image"
					/>
				</div>
			)}
			<div
				ref={containerRef}
				style={{
					marginTop: 30,
					marginBottom: 30,
					width: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					objectPosition: "center",
				}}
				onClick={() => setIsFullScreen(true)}
			>
				<img
					width={Math.min(876, windowWidth)}
					style={{ objectFit: "contain", maxHeight: 600 }}
					src={imageUrl}
					alt="image"
				/>
				<div
					style={{ width: "100%", display: "flex", justifyContent: "center" }}
				>
					<div style={{ maxWidth: "90%", color: "#888", fontSize: 16 }}>
						{description}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Img;
