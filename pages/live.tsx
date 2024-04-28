import React, { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import useIsMobile from "../components/isMobile";
import { test } from "gray-matter";

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

	const [liveData, setLiveData] = useState<
		{ lat: number; lng: number; age: string }[][]
	>([]);

	const fetchDataPage = async (start) => {
		const result = await getFeed(start);

		if (result?.response?.feedMessageResponse?.messages?.message.length > 0) {
			const messages = result.response.feedMessageResponse.messages.message;
			const points = messages.map((m) => {
				const date = new Date(m.dateTime);
				const now = new Date();
				let delta = Math.abs(now.valueOf() - date.valueOf()) / 1000;
				const age = [
					["days", 24 * 60 * 60],
					["hours", 60 * 60],
					["minutes", 60],
					["seconds", 1],
				].reduce(
					(acc, [key, value]) => (
						(acc[key] = Math.floor(delta / (value as number))),
						(delta -= acc[key] * (value as number)),
						acc
					),
					{}
				) as any;
				return {
					lat: m.latitude,
					lng: m.longitude,
					age: age.days + "d " + age.hours + "h " + age.minutes + "m",
				};
			});

			return points;
		}
		const testPoints = [
			{ lat: 37.256536, lng: -112.910962, age: "0d 0h 0m" },
			{ lat: 36.1803, lng: -115.4456, age: "0d 0h 0m" },
		];
		return testPoints;
	};

	const closePoints = (a, b) => {
		const distanceInDeg = Math.sqrt(
			(a.lng - b.lng) ** 2 + (a.lat - b.lat) ** 2
		);
		const distanceInKm = distanceInDeg * 111;
		return distanceInKm < 5;
	};

	const splitData = (data) => {
		var pointIndex = 1;
		var splitData = [[data[0]]];

		while (pointIndex <= data.length - 1) {
			if (closePoints(data[pointIndex], data[pointIndex - 1])) {
				splitData[splitData.length - 1].push(data[pointIndex]);
			} else {
				splitData.push([data[pointIndex]]);
			}
			pointIndex++;
		}
		return splitData;
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
				if (points.length !== 51) {
					lastPage = true;
				}
			}

			data = splitData(data);
			console.log(data);

			setLiveData(data);
		};

		fetchData();

		const intervalId = setInterval(fetchData, 600000);

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
					fullGPXUrl="/utah/gpx/utah.gpx"
					sectionGPXUrl="/utah/gpx/utah_done.gpx"
					fullLabel="Auto"
					sectionLabel="Geplante Wanderungen"
					live={true}
					focusOn="live"
					livePoints={liveData}
					global={true}
					startEndMarkers="whole"
				/>
			) : (
				<div>Momentan sind keine Live-Daten vorhanden.</div>
			)}
		</div>
	);
};

export default Live;
