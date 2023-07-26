import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";
import { gpx } from "@tmcw/togeojson";
import { geoDistance } from "d3-geo";

function SwitzerlandMap({ gpxUrl }) {
	const projectionRef = useRef();

	const landmarks = [
		{ name: "Matterhorn", coordinates: [7.6588, 45.9763] },
		{ name: "Jungfraujoch", coordinates: [7.9822, 46.5472] },
		{ name: "Kapellbrücke, Luzern", coordinates: [8.305, 47.0502] },
		{ name: "Genf", coordinates: [6.1481, 46.2044] },
		{ name: "Rheinfall", coordinates: [8.6124, 47.6779] },
		{ name: "Zytglogge, Bern", coordinates: [7.4474, 46.948] },
		{ name: "Château de Chillon, Montreux", coordinates: [6.9271, 46.4142] },
		{ name: "Grossmünster Zürich", coordinates: [8.5433, 47.3705] },
		{ name: "Lausanne Olympic Museum", coordinates: [6.6351, 46.5214] },
		{ name: "Rigi, Zug", coordinates: [8.5235, 47.0567] },
		{ name: "Trummelbach Falls", coordinates: [7.9087, 46.5877] },
		{ name: "Roche Towers", coordinates: [7.5909, 47.5601] },
		{ name: "Brienzer Rothorn Railway", coordinates: [8.0335, 46.7651] },
		{ name: "Lavertezzo", coordinates: [8.7582, 46.2326] },
		{ name: "St. Gallen Kathedrale", coordinates: [9.3703, 47.4235] },
		{ name: "Mythen, Schwyz", coordinates: [8.6477, 47.0335] },
		{ name: "Teufelsbrücke", coordinates: [8.7239, 46.6466] },
		{ name: "Creux du Van", coordinates: [6.6751, 46.9226] },
		{ name: "Aareschlucht", coordinates: [8.178, 46.7325] },
		{ name: "Bellinzona", coordinates: [9.0223, 46.1953] },
		{ name: "Locarno", coordinates: [8.7959, 46.1713] },
		{ name: "Gotthard", coordinates: [8.6454, 46.5755] },
		{ name: "Emmental", coordinates: [7.8391, 47.0742] },
		{ name: "Titlis", coordinates: [8.3964, 46.7727] },
		{ name: "Landwasser Viaduct", coordinates: [9.674, 46.7047] },
		{ name: "Kreisviadukt Brusio", coordinates: [10.0962, 46.2432] },
		{ name: "Giger Museum", coordinates: [7.0828, 46.5783] },
		{ name: "Hotel Belvedere", coordinates: [7.6673, 46.5443] },
		{ name: "Munot, Schaffhausen", coordinates: [8.6356, 47.6986] },
		{ name: "Papiliorama", coordinates: [7.1809, 46.9725] },
	];

	useEffect(() => {
		const loadMapAndGpxData = async () => {
			renderSvg();
		};

		loadMapAndGpxData();
	}, []);

	useEffect(() => {
		const loadMapAndGpxData = async () => {
			const gpxResponse = await axios.get(gpxUrl);

			const parser = new DOMParser();
			const gpxDOM = parser.parseFromString(
				gpxResponse.data,
				"application/xml"
			);
			const gpxData = gpx(gpxDOM);

			animateGpx(gpxData); // Animate once at the beginning
		};

		loadMapAndGpxData();
	}, [gpxUrl]);

	const renderSvg = () => {
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

		// Append a new group for the map paths.
		const cantonGroup = svgContainer.append("g").attr("id", "cantonGroup");
		const countryGroup = svgContainer.append("g").attr("id", "countryGroup");
		const lakeGroup = svgContainer.append("g").attr("id", "lakeGroup");

		Promise.all([
			d3.json("/ch.geojson"),
			d3.json("/ch-lakes.geojson"),
			d3.json("/ch-cantons.geojson"),
		]).then(([chData, chLakesData, chCantonsData]) => {
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
				.attr("stroke-width", 0);

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
		});

		projectionRef.current = projection;
	};

	const animateGpx = (gpxData) => {
		const svgContainer = d3.select("svg");
		svgContainer.select("#gpxGroup").remove();
		svgContainer.select("#landmarkGroup").remove();
		const gpxGroup = svgContainer.append("g").raise().attr("id", "gpxGroup");

		// Compute the new index

		gpxData.features = gpxData.features.filter(
			(feature) => feature.geometry.type === "LineString"
		);
		gpxData.features[0].geometry.coordinates =
			gpxData.features[0].geometry.coordinates.filter(
				(coordinate, i) =>
					i %
						Math.floor(
							gpxData.features[0].geometry.coordinates.length / 220
						) ===
						0 || i === gpxData.features[0].geometry.coordinates.length - 1
			);
		// Create a path generator.
		const pathGenerator = d3.geoPath().projection(projectionRef.current);

		// Create the path without adding it to the DOM.
		const pathElement = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"path"
		);
		pathElement.setAttribute("d", pathGenerator(gpxData));

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
			.transition() // added transition
			.delay(3500) //
			.duration(1000)
			.style("opacity", 0); // final opacity

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
				.text(labelText)
				.style("opacity", 0) // initially hidden
				.transition()
				.delay(1000)
				.duration(1000) // fade-in duration
				.style("opacity", 1) // final opacity
				.transition()
				.delay(6500) // delay before fade-out starts
				.duration(1000) // fade-out duration
				.style("opacity", 0); // final opacity

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
				.attr("rx", 5)
				.style("opacity", 0) // initially hidden
				.transition()
				.delay(1000)
				.duration(1000) // fade-in duration
				.style("opacity", 1) // final opacity
				.transition()
				.delay(6500) // delay before fade-out starts
				.duration(1000) // fade-out duration
				.style("opacity", 0); // final opacity

			landmarkGroup
				.append("circle")
				.attr("cx", x)
				.attr("cy", y)
				.attr("r", 0)
				.attr("fill", "#000")
				.transition()
				.delay(1000)
				.duration(2000)
				.attr("r", 20)
				.transition()
				.delay(5500) // delay before fade-out starts
				.duration(1000) // fade-out duration
				.style("opacity", 0); // final opacity
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
