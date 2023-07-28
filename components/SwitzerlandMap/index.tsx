import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
import { gpx } from "@tmcw/togeojson";
import { geoDistance } from "d3-geo";
import {
	landmarks,
	width,
	height,
	drawCantons,
	drawCountry,
	drawLakes,
	drawHeightProfile,
	drawLandmark,
	drawGpx,
} from "./util";

function SwitzerlandMap({ gpxUrl }) {
	const projectionRef = useRef();

	useEffect(() => {
		renderSvg();
	}, []);

	useEffect(() => {
		const loadMapAndGpxData = async () => {
			const gpxResponse = await axios.get(gpxUrl);

			const parser = new DOMParser();
			const gpxDOM = parser.parseFromString(
				gpxResponse.data,
				"application/xml"
			);
			const gpxData = gpx(gpxDOM) as any;
			const originalCoordinates = gpxData.features[0].geometry.coordinates;
			if (originalCoordinates) {
				const filteredCoordinates = originalCoordinates.filter(
					(coordinate, i) =>
						i % Math.floor(originalCoordinates.length / 200) === 0 ||
						i === originalCoordinates.length - 1
				);
				gpxData.features[0].geometry.coordinates = filteredCoordinates;
				makeHeightProfile(gpxData.features[0]);

				animateGpx(gpxData);
			}
		};

		loadMapAndGpxData();
	}, [gpxUrl]);

	const makeHeightProfile = (feature) => {
		const svgContainer = d3.select("svg");
		svgContainer.select("#heightProfileGroup").remove();
		const heightProfileGroup = svgContainer
			.append("g")
			.attr("id", "heightProfileGroup")
			.attr("transform", "translate(0, 865)");

		drawHeightProfile(heightProfileGroup, feature);
	};
	const renderSvg = () => {
		const svgContainer = d3.select("svg");
		svgContainer.html("");

		const projection = d3
			.geoMercator()
			.translate([width / 2, height / 2])
			.rotate([-7.43864, -46.95108, -0])
			.center([0.56, -0.14])
			.scale(23000);

		const path = d3.geoPath().projection(projection);

		const cantonGroup = svgContainer.append("g").attr("id", "cantonGroup");
		const countryGroup = svgContainer.append("g").attr("id", "countryGroup");
		const lakeGroup = svgContainer.append("g").attr("id", "lakeGroup");

		Promise.all([
			d3.json("/ch.geojson"),
			d3.json("/ch-lakes.geojson"),
			d3.json("/ch-cantons.geojson"),
		]).then(([chData, chLakesData, chCantonsData]) => {
			drawCantons(cantonGroup, path, chCantonsData.features);
			drawCountry(countryGroup, path, chData.features);
			drawLakes(lakeGroup, path, chLakesData.features);
		});

		projectionRef.current = projection;
	};

	const animateGpx = (gpxData) => {
		const svgContainer = d3.select("svg");
		svgContainer.select("#gpxGroup").remove();
		svgContainer.select("#landmarkGroup").remove();
		const gpxGroup = svgContainer.append("g").raise().attr("id", "gpxGroup");

		gpxData.features = gpxData.features.filter(
			(feature) => feature.geometry.type === "LineString"
		);

		const pathGenerator = d3.geoPath().projection(projectionRef.current);

		const pathElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"path"
		);
		pathElement.setAttribute("d", pathGenerator(gpxData));

		drawGpx(gpxGroup, pathElement);

		drawClosestLandmark(gpxData.features[0].geometry.coordinates, landmarks);
	};
	const drawClosestLandmark = (path, landmarks, skipPoints = 10) => {
		const svgContainer = d3.select("svg");
		const landmarkGroup = svgContainer.append("g").attr("id", "landmarkGroup");

		const projection = projectionRef.current as any;

		let minDistance = Infinity;
		let closestLandmark = null;
		landmarks.forEach((landmark) => {
			const [landmarkLon, landmarkLat] = landmark.coordinates;
			for (let i = 0; i < path.length; i += skipPoints) {
				const [pathLon, pathLat] = path[i];
				const distance = geoDistance(
					[landmarkLon, landmarkLat],
					[pathLon, pathLat]
				);
				if (distance < minDistance) {
					minDistance = distance;
					closestLandmark = landmark;
				}
			}
		});

		if (closestLandmark) {
			drawLandmark(landmarkGroup, closestLandmark, projection);
		}
	};

	return (
		<svg
			style={{ display: "block", maxWidth: "100%", height: "auto" }}
			viewBox={`0 0 ${width} ${height + 180}`}
			preserveAspectRatio="xMidYMid meet"
		></svg>
	);
}

export default SwitzerlandMap;
