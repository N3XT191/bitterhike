import Link from "next/link";
import React from "react";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";

const Live = () => {
	const MapWidget = React.useMemo(
		() =>
			dynamic(() => import("../components/MapWidget"), {
				loading: () => <p>A map is loading</p>,
				ssr: false,
			}),
		[]
	);
	return (
		<div className="mt-3">
			<NextSeo
				title="BitterHike - Live"
				description="Verfolge mich live auf meinen Wanderungen"
			/>
			<p className="display-4 text-center">Live Tracking</p>
			<MapWidget
				height={600}
				sectionGPXUrl=""
				fullGPXUrl="/NSWest/gpx/nswest.gpx"
				fullLabel="Geplante Route"
				live={true}
				focusOn="live"
			/>
		</div>
	);
};
export default Live;
