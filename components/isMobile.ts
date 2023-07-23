import { useEffect, useState } from "react";

export default function useIsMobile(maxWidth?: number) {
	if (typeof window !== "undefined") {
		const getIsMobile = () => window.innerWidth <= (maxWidth || 700);
		const [isMobile, setIsMobile] = useState<boolean>(false);

		useEffect(() => {
			const handleResize = () => {
				setIsMobile(getIsMobile());
			};

			// Set the initial state
			setIsMobile(getIsMobile());

			// Add the event listener
			window.addEventListener("resize", handleResize);

			// Remove the event listener on cleanup
			return () => {
				window.removeEventListener("resize", handleResize);
			};
		}, []);

		return isMobile;
	} else {
		return false;
	}
}
