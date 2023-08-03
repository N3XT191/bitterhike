import React, { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import useIsMobile from "../components/isMobile";

const getFeed = async (start) => {
	const res = await fetch(
		"https://api.findmespot.com/spot-main-web/consumer/rest-api/2.0/public/feed/0kTzoEfP9BNlirS95A8s97CjqJFExtMeD/message.json?start=" +
			start
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

	const fetchDataPage = async (start) => {
		const result = await getFeed(start);

		if (result?.response?.feedMessageResponse?.messages?.message.length > 0) {
			const messages = result.response.feedMessageResponse.messages.message;
			const points = messages.map((m) => {
				return { lat: m.latitude, lng: m.longitude };
			});
			return points;
		}
		return [];
	};

	useEffect(() => {
		const fetchData = async () => {
			let data = [];

			let lastPage = false;
			let start = 0;

			while (!lastPage) {
				const points = await fetchDataPage(start);
				start += 50;
				data = [...data, ...points];
				console.log(points.length);
				if (points.length !== 51) {
					lastPage = true;
				}
			}

			setLiveData(data);
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
			{true || liveData.length > 0 ? (
				<MapWidget
					height={mobile ? 470 : 600}
					sectionGPXUrl=""
					fullGPXUrl="/fluebrig/gpx/fluebrig.gpx"
					fullLabel="Geplante Route"
					sectionLabel="Letzte 7 Tage"
					live={true}
					focusOn="live"
					livePoints={liveData}
					global={false}
				/>
			) : (
				<div>Momentan sind keine Live-Daten vorhanden.</div>
			)}
		</div>
	);
};

export default Live;
