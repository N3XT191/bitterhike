import * as d3 from "d3";
import { geoLength } from "d3-geo";

export const width = 1348.8688;
export const height = 865.04437;

export const landmarks = [
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

export const drawCantons = (cantonGroup, path, features) =>
	cantonGroup
		.selectAll("path")
		.data(features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("stroke-linejoin", "round")
		.attr("fill", "none")
		.attr("stroke", "#aaa")
		.attr("stroke-width", 0);

export const drawCountry = (countryGroup, path, features) =>
	countryGroup
		.selectAll("path")
		.data(features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("stroke-linejoin", "round")
		.attr("stroke", "#000")
		.attr("fill", "none")
		.attr("stroke-width", 2);

export const drawLakes = (lakeGroup, path, features) =>
	lakeGroup
		.selectAll("path")
		.data(features)
		.enter()
		.append("path")
		.attr("d", path)
		.attr("stroke-linejoin", "round")
		.attr("fill", "#0000ff");

export const drawHeightProfile = (heightProfileGroup, feature) => {
	const path = feature.geometry.coordinates;

	const heightData = path.map((coords, i) => ({
		x: i,
		y: coords[2],
	}));

	const xScale = d3
		.scaleLinear()
		.range([100, width - 50])
		.domain([0, path.length - 1]);

	const yScale = d3
		.scaleLinear()
		.range([120, 0])
		.domain(d3.extent(heightData, (d) => d.y));

	const line = d3
		.line()
		.x((d) => xScale(d.x))
		.y((d) => yScale(d.y));

	const heightProfilePath = heightProfileGroup
		.append("path")
		.datum(heightData)
		.attr("d", line)
		.attr("stroke", "green")
		.attr("fill", "none")
		.attr("stroke-width", 2);

	const pathLength = heightProfilePath.node().getTotalLength();

	heightProfilePath
		.attr("fill", "none")
		.attr("stroke-width", 5)
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

	// Add x-axis for distance
	heightProfileGroup
		.append("g")
		.attr("transform", "translate(0, 120)")
		.call(
			d3
				.axisBottom(xScale)
				.ticks(6)
				.tickFormat(
					(d) =>
						`${
							Math.floor((d / path.length) * geoLength(feature) * 63710) / 10
						} km`
				)
		)
		.selectAll("text")
		.style("font-size", "25");

	// Add y-axis for elevation
	heightProfileGroup
		.append("g")
		.attr("transform", "translate(100, 0)")
		.call(
			d3
				.axisLeft(yScale)
				.tickFormat((d) => `${d} m`)
				.ticks(3)
		)
		.selectAll("text")
		.style("font-size", "25");
};

export const drawLandmark = (landmarkGroup, landmark, projection) => {
	const [lon, lat] = landmark.coordinates;
	const [x, y] = projection([lon, lat]);

	const labelText = landmark.name;
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
		.style("opacity", 0)
		.transition()
		.delay(1000)
		.duration(1000)
		.style("opacity", 1)
		.transition()
		.delay(6500)
		.duration(1000)
		.style("opacity", 0);

	const textWidth = text.node().getComputedTextLength();
	const textHeight = fontSize * 1.2;

	landmarkGroup
		.insert("rect", "text")
		.attr("x", x - padding / 2)
		.attr("y", y - 25 - textHeight)
		.attr("width", textWidth + padding)
		.attr("height", textHeight + padding)
		.attr("fill", "white")
		.attr("stroke", "black")
		.attr("rx", 5)
		.style("opacity", 0)
		.transition()
		.delay(1000)
		.duration(1000)
		.style("opacity", 1)
		.transition()
		.delay(6500)
		.duration(1000)
		.style("opacity", 0);

	landmarkGroup
		.append("circle")
		.attr("cx", x)
		.attr("cy", y)
		.attr("r", 0)
		.attr("fill", "#000")
		.transition()
		.delay(1000)
		.duration(2000)
		.attr("r", 10)
		.transition()
		.delay(5500)
		.duration(1000)
		.style("opacity", 0);
};

export const drawGpx = (gpxGroup, pathElement) => {
	const pathLength = pathElement.getTotalLength();

	gpxGroup
		.raise()
		.append(() => pathElement)
		.attr("stroke", "red")
		.attr("fill", "none")
		.attr("stroke-width", 5)
		.attr("stroke-dasharray", pathLength)
		.attr("stroke-dashoffset", pathLength)
		.attr("stroke-linejoin", "round")
		.transition()
		.duration(5000)
		.ease(d3.easeLinear)
		.attr("stroke-dashoffset", 0)
		.transition()
		.delay(3500)
		.duration(1000)
		.style("opacity", 0);
};
