import { useEffect, useState } from "react";

export default function useIsMobile() {
	if (typeof window !== "undefined") {
		const getIsMobile = () => window.innerWidth <= 600;
		const [isMobile, setIsMobile] = useState(false);
		setTimeout(() => setIsMobile(getIsMobile()), 10);
		useEffect(() => {
			const onResize = () => {
				setIsMobile(getIsMobile());
			};

			window.addEventListener("resize", onResize);

			return () => {
				window.removeEventListener("resize", onResize);
			};
		}, []);

		return isMobile;
	} else {
		return false;
	}
}
