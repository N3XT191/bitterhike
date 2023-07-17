/* eslint-disable @next/next/no-img-element */
import { useRef, useState, useLayoutEffect } from "react";
const Img = ({ d, src }: { d: string; src: string }) => {
	const ref = useRef<HTMLDivElement>(null);

	function useWindowSize() {
		const [size, setSize] = useState([0, 0]);
		useLayoutEffect(() => {
			function updateSize() {
				if (ref.current) {
					setSize([ref.current.offsetWidth, ref.current.offsetHeight]);
				}
			}
			window.addEventListener("resize", updateSize);
			updateSize();
			return () => window.removeEventListener("resize", updateSize);
		}, []);
		return size;
	}
	const [width] = useWindowSize();

	const [fullScreen, setFullScreen] = useState(false);

	return (
		<div>
			{fullScreen ? (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100vh",
						backgroundColor: "rgba(0,0,0,0.9)",
						zIndex: 9999999,
						display: "flex",
						justifyItems: "center",
						alignItems: "center",
					}}
					onClick={() => setFullScreen(false)}
				>
					<img
						style={{
							maxWidth: "100%",
							maxHeight: "100%",
							objectFit: "contain",
							margin: "auto",
						}}
						src={src}
						alt="image"
					/>
				</div>
			) : undefined}
			<div
				ref={ref}
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
				onClick={() => setFullScreen(true)}
			>
				<img
					width={Math.min(876, width)}
					style={{ objectFit: "contain", maxHeight: 600 }}
					src={src}
					alt="image"
				/>
				<div
					style={{ width: "100%", display: "flex", justifyContent: "center" }}
				>
					<div style={{ maxWidth: "90%", color: "#888", fontSize: 16 }}>
						{d}
					</div>
				</div>
			</div>
		</div>
	);
};
export default Img;
