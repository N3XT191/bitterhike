import Link from "next/link";
import React, { useEffect, useState } from "react";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import useIsMobile from "../components/isMobile";

const testFeed = {
	response: {
		feedMessageResponse: {
			count: "10",
			feed: {
				id: "03XHH0sPyTiYUsYD2TVJ4q7CzEH89HBhG",
				name: "OneAtATime",
				description: "OneAtATime",
				status: "ACTIVE",
				usage: "0",
				daysRange: "7",
				detailedMessageShown: "true",
			},
			totalCount: "10",
			activityCount: "0",
			messages: [
				{
					"@clientUnixTime": "0",
					id: "4937065",
					messengerId: "0-8356068",
					messengerName: "Spot2",
					unixTime: "1364909292",
					messageType: "HELP-CANCEL",
					latitude: "47.3769",
					longitude: "8.54179",
					modelId: "SPOT2",
					showCustomMsg: "Y",
					dateTime: "2013-04-02T06:28:12-0700",
					hidden: "0",
					messageContent: "The help message has been cancelled",
				},
				{
					"@clientUnixTime": "0",
					id: "4937064",
					messengerId: "0-8356068",
					messengerName: "Spot2",
					unixTime: "1364909283",
					messageType: "HELP",
					latitude: "47.3669",
					longitude: "8.54179",
					modelId: "SPOT2",
					showCustomMsg: "Y",
					dateTime: "2013-04-02T06:28:03-0700",
					hidden: "0",
					messageContent: "This is the default HELP message. Please update.",
				},
				{
					"@clientUnixTime": "0",
					id: "4937060",
					messengerId: "0-8356068",
					messengerName: "Spot2",
					unixTime: "1364908774",
					messageType: "CUSTOM",
					latitude: "47.3669",
					longitude: "8.55179",
					modelId: "SPOT2",
					showCustomMsg: "Y",
					dateTime: "2013-04-02T06:19:34-0700",
					hidden: "0",
					messageContent: "This is a custom message",
				},
				{
					"@clientUnixTime": "0",
					id: "4937059",
					messengerId: "0-8356068",
					messengerName: "Spot2",
					unixTime: "1364908765",
					messageType: "OK",
					latitude: "47.3469",
					longitude: "8.53179",
					modelId: "SPOT2",
					showCustomMsg: "Y",
					dateTime: "2013-04-02T06:19:25-0700",
					hidden: "0",
					messageContent:
						"This is the default SPOT Check-in/OK message. Please update.",
				},
				{
					"@clientUnixTime": "0",
					id: "4937057",
					messengerId: "0-8356068",
					messengerName: "Spot2",
					unixTime: "1364908512",
					messageType: "TRACK",
					latitude: "47.3269",
					longitude: "8.52179",
					modelId: "SPOT2",
					showCustomMsg: "Y",
					dateTime: "2013-04-02T06:15:12-0700",
					hidden: "0",
				},
			],
		},
	},
} as any;

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
			const result = testFeed;
			//const result = await getFeed();

			console.log(result.response);
			if (result?.response?.errors?.error?.code === "E-0195") {
				setLiveData([]);
			} else if (result?.response?.feedMessageResponse?.messages?.length > 0) {
				const messages = result.response.feedMessageResponse.messages;
				const points = messages.map((m) => {
					return { lat: m.latitude, lng: m.longitude };
				});
				setLiveData(points);
				console.log(points);
			}
		};

		fetchData();
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
					height={mobile ? 380 : 600}
					sectionGPXUrl=""
					fullGPXUrl="/NSWest/gpx/nswest.gpx"
					fullLabel="Geplante Route"
					sectionLabel="Letzte 7 Tage"
					live={true}
					focusOn="live"
					livePoints={liveData}
				/>
			) : (
				<div>Momentan sind keine Live-Daten vorhanden.</div>
			)}
		</div>
	);
};
export default Live;
