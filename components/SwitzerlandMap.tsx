import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
import { gpx } from "@tmcw/togeojson";
import { geoDistance } from "d3-geo";

function SwitzerlandMap({ svgUrl, gpxUrls }) {
	const projectionRef = useRef();

	const landmarks = [
		{ name: "Schloss Chillon", coordinates: [6.9271, 46.4142] },
		{ name: "Rheinfall", coordinates: [8.6124, 47.6779] },
		{ name: "Jet d'Eau", coordinates: [6.2082, 46.2044] },
		{ name: "Matterhorn", coordinates: [7.6314, 45.9763] },
		{ name: "Jungfraujoch", coordinates: [7.9613, 46.5475] },
		{ name: "Aletschgletscher", coordinates: [8.0522, 46.4892] },
		{ name: "Zytglogge", coordinates: [7.4481, 46.948] },
		{ name: "Löwendenkmal", coordinates: [8.3373, 47.0583] },
		{ name: "Zentrum Paul Klee", coordinates: [7.4667, 46.9386] },
		{ name: "Grossmünster", coordinates: [8.5434, 47.3702] },
		{ name: "Ballenberg", coordinates: [8.0636, 46.7415] },
		{ name: "Schloss Gruyères", coordinates: [7.1513, 46.5837] },
		{ name: "Stiftsbibliothek St. Gallen", coordinates: [9.3747, 47.4231] },
		{ name: "Laténium", coordinates: [6.9203, 47.0085] },
		{ name: "Olympisches Museum", coordinates: [6.6323, 46.5056] },
		{ name: "Augusta Raurica", coordinates: [7.722, 47.5222] },
		{ name: "Weinterrassen Lavaux", coordinates: [6.6774, 46.5022] },
		{ name: "Rigi Kulm", coordinates: [8.4853, 47.0563] },
	];

	useEffect(() => {
		const loadMapAndGpxData = async () => {
			const gpxResponses = await Promise.all(
				gpxUrls.map((url) => axios.get(url))
			);

			const gpxData = gpxResponses.map((response) => {
				const parser = new DOMParser();
				const gpxDOM = parser.parseFromString(response.data, "application/xml");
				return gpx(gpxDOM);
			});

			renderSvg(gpxData);
		};

		loadMapAndGpxData();
	}, [svgUrl, gpxUrls]);

	const renderSvg = (gpxData) => {
		const svgContainer = d3.select("svg");
		svgContainer.html("");

		const width = 1348.8688;
		const height = 865.04437;

		const projection = d3
			.geoMercator()
			.translate([width / 2, height / 2])
			.rotate([-7.43864, -46.95108, -0])
			.center([0.56, -0.14])
			.scale(23000);

		const path = d3.geoPath().projection(projection);

		Promise.all([
			d3.json("/ch.geojson"),
			d3.json("/ch-lakes.geojson"),
			d3.json("/ch-cantons.geojson"),
		]).then(([chData, chLakesData, chCantonsData]) => {
			// Append a new group for the map paths.
			const cantonGroup = svgContainer.append("g").attr("id", "cantonGroup");
			const countryGroup = svgContainer.append("g").attr("id", "countryGroup");
			const lakeGroup = svgContainer.append("g").attr("id", "lakeGroup");

			// Draw cantons
			cantonGroup
				.selectAll("path")
				.data(chCantonsData.features)
				.enter()
				.append("path")
				.attr("d", path)
				.attr("stroke-linejoin", "round")
				.attr("fill", "none")
				.attr("stroke", "#aaa")
				.attr("stroke-width", 1);
			//Draw country paths
			countryGroup
				.selectAll("path")
				.data(chData.features)
				.enter()
				.append("path")
				.attr("d", path)
				.attr("stroke-linejoin", "round")
				.attr("stroke", "#000")
				.attr("fill", "none")
				.attr("stroke-width", 2);

			// Draw lakes
			lakeGroup
				.selectAll("path")
				.data(chLakesData.features)
				.enter()
				.append("path")
				.attr("d", path)
				.attr("stroke-linejoin", "round")
				.attr("fill", "#0000ff");
			animateGpx(gpxData);
		});

		projectionRef.current = projection;
	};

	const animateGpx = (gpxData) => {
		const svgContainer = d3.select("svg");
		const gpxGroup = svgContainer.append("g").raise().attr("id", "gpxGroup");

		// Randomly select a GPX track.
		const gpx = gpxData[Math.floor(Math.random() * gpxData.length)];
		gpx.features = gpx.features.filter(
			(feature) => feature.geometry.type === "LineString"
		);
		console.log(gpx.features[0].geometry.coordinates.length);
		gpx.features[0].geometry.coordinates =
			gpx.features[0].geometry.coordinates.filter(
				(coordinate, i) =>
					i % Math.floor(gpx.features[0].geometry.coordinates.length / 220) ===
						0 || i === gpx.features[0].geometry.coordinates.length - 1
			);

		// Create a path generator.
		const pathGenerator = d3.geoPath().projection(projectionRef.current);

		// Create the path without adding it to the DOM.
		const pathElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"path"
		);
		pathElement.setAttribute("d", pathGenerator(gpx));

		// Calculate the path length.
		const pathLength = pathElement.getTotalLength();

		// Append the GPX track to the SVG and animate it.
		gpxGroup
			.raise()
			.append(() => pathElement)
			.attr("stroke", "red")
			.attr("fill", "none")
			.attr("stroke-width", 3)
			.attr("stroke-dasharray", pathLength)
			.attr("stroke-dashoffset", pathLength)
			.attr("stroke-linejoin", "round")
			.transition()
			.duration(5000)
			.ease(d3.easeLinear)
			.attr("stroke-dashoffset", 0)
			.attr("z-index", 10);

		drawClosestLandmark(gpx.features[0].geometry.coordinates, landmarks);
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
			const [lon, lat] = closestLandmark.coordinates;
			const [x, y] = projection([lon, lat]);

			const labelText = closestLandmark.name;
			const fontSize = 18;
			const padding = 10;

			const text = landmarkGroup
				.append("text")
				.attr("x", x)
				.attr("y", y - 25)
				.attr("font-family", "Arial, Helvetica, sans-serif")
				.attr("font-size", `${fontSize}px`)
				.attr("fill", "black")
				.text(labelText);

			const textWidth = text.node().getComputedTextLength();
			const textHeight = fontSize * 1.2; // approximately

			const rect = landmarkGroup
				.insert("rect", "text")
				.attr("x", x - padding / 2)
				.attr("y", y - 25 - textHeight)
				.attr("width", textWidth + padding)
				.attr("height", textHeight + padding)
				.attr("fill", "white")
				.attr("stroke", "black")
				.attr("rx", 5);

			landmarkGroup
				.append("circle")
				.attr("cx", x)
				.attr("cy", y)
				.attr("r", 0)
				.attr("fill", "#000")
				.transition()
				.delay(1000)
				.duration(3000)
				.attr("r", 20);
		}
	};

	return (
		<svg
			style={{ display: "block", maxWidth: "100%", height: "auto" }}
			viewBox="0 0 1348.8688 865.04437"
			preserveAspectRatio="xMidYMid meet"
		></svg>
	);
}

export default SwitzerlandMap;
