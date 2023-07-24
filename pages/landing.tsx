import Link from "next/link";
import React from "react";
import { NextSeo } from "next-seo";
import SwitzerlandMap from "../components/SwitzerlandMap";

const Bio = () => {
	return (
		<div className="mt-3">
			<NextSeo
				title="BitterHike - Über Mich"
				description="Ich in Marc, der Autor dieses Blogs..."
			/>

			<SwitzerlandMap
				svgUrl={"/ch.svg"}
				gpxUrls={[
					"/ns/gpx/ns.gpx",
					"/nswest/gpx/nswest.gpx",
					"/jura/gpx/jura.gpx",
					"/cadlimo/gpx/cadlimo.gpx",
					"/fionnay/gpx/fionnay.gpx",
				]}
			/>
		</div>
	);
};
export default Bio;
