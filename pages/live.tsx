import React, { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import useIsMobile from "../components/isMobile";

const getFeed = async () => {
	const res = await fetch(
		"https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0kTzoEfP9BNlirS95A8s97CjqJFExtMeD/message.json"
	);
	const data = await res.json();
	return data;
};

const Live = () => {
	const MapWidget = React.useMemo(
		() =>
			dynamic(() => import("../components/MapWidget"), {
				loading: () => <p>A map is loading</p>,
				ssr: false,
			}),
		[]
	);

	const [liveData, setLiveData] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const result = await getFeed();

			if (result?.response?.errors?.error?.code === "E-0195") {
				setLiveData([]);
			} else if (
				result?.response?.feedMessageResponse?.messages?.message.length > 0
			) {
				const messages = result.response.feedMessageResponse.messages.message;
				const points = messages.map((m) => {
					return { lat: m.latitude, lng: m.longitude };
				});
				setLiveData(points);
			}
		};

		fetchData();

		const intervalId = setInterval(fetchData, 60000);

		return () => clearInterval(intervalId);
	}, []);

	const mobile = useIsMobile();

	return (
		<div className="mt-3">
			<NextSeo
				title="BitterHike - Live"
				description="Verfolge mich live auf meinen Wanderungen"
			/>
			<p className="display-4 text-center">Live Tracking</p>
			{liveData.length > 0 ? (
				<MapWidget
					height={mobile ? 470 : 600}
					sectionGPXUrl=""
					fullGPXUrl="/HRP/gpx/HRP_todo.gpx"
					fullLabel="Geplante Route"
					sectionLabel="Letzte 7 Tage"
					live={true}
					focusOn="live"
					livePoints={liveData}
					global={true}
				/>
			) : (
				<div>Momentan sind keine Live-Daten vorhanden.</div>
			)}
		</div>
	);
};

export default Live;
