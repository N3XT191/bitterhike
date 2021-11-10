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

	return (
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
		>
			<img
				width={Math.min(876, width)}
				style={{ objectFit: "contain", maxHeight: 600 }}
				src={src}
				alt="image"
			/>
			<div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
				<div style={{ maxWidth: "90%", color: "#888" }}>{d}</div>
			</div>
		</div>
	);
};
export default Img;
