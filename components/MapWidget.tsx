import React, { useState, useEffect, useRef } from "react";
import {
	MapContainer,
	TileLayer,
	GeoJSON,
	Pane,
	Tooltip,
	Polyline,
} from "react-leaflet";
import toGeoJSON from "./togeojson";

import L from "leaflet";

import bbox from "turf-bbox";

import "leaflet/dist/leaflet.css";
import "leaflet-gpx";

async function getGPX(path) {
	try {
		return await fetch(path).then((response) => response.text());
	} catch (e) {}
}
const coordinates = [
	{ lat: 47.3769, lng: 8.54179 },
	{ lat: 47.4769, lng: 8.54179 },
	{ lat: 47.3769, lng: 8.44179 },
];

let polyline = L.polyline(coordinates, {
	lineJoin: "round",
});

function useFetcher(fetchSomethingAPI) {
	const [data, setData] = useState();

	useEffect(() => {
		fetchSomethingAPI().then((response) => {
			setData(response);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return data;
}
function useFetcherMany(fetchMany) {
	const [data, setData] = useState([]);

	useEffect(() => {
		Promise.all(fetchMany.map((f) => f())).then((response) =>
			setData(response)
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return data;
}
// eslint-disable-next-line react-hooks/rules-of-hooks

interface Props {
	sectionGPXUrl?: string;
	fullGPXUrl?: string;
	height: number;
	sectionLabel?: string;
	fullLabel?: string;
	focusOn?: "section" | "full" | "live" | "all";
	live?: boolean;
	livePoints?: { lng: number; lat: number }[];
	routeListUrls?: string[];
}
const MapWidget = ({
	sectionGPXUrl,
	fullGPXUrl,
	height,
	sectionLabel,
	fullLabel,
	focusOn,
	live,
	livePoints,
	routeListUrls,
}: Props) => {
	const [fullScreen, setFullScreen] = useState(false);

	let mapRef = useRef<any>();

	const [wholeRoute, setWholeRoute] = useState(undefined);
	const [partRoute, setPartRoute] = useState(undefined);
	const [routeList, setRouteList] = useState([undefined]);
	const wholeRouteGPX = fullGPXUrl
		? useFetcher(() => getGPX(fullGPXUrl))
		: undefined;
	const partRouteGPX = sectionGPXUrl
		? useFetcher(() => getGPX(sectionGPXUrl))
		: undefined;
	const routeListGPXs =
		routeListUrls?.length > 0
			? JSON.stringify(
					useFetcherMany(routeListUrls.map((url) => () => getGPX(url)))
			  )
			: undefined;

	if (livePoints?.length > 0) {
		polyline = L.polyline(livePoints, {
			lineJoin: "round",
		});
	}

	useEffect(() => {
		if (wholeRouteGPX) {
			setWholeRoute(
				toGeoJSON.gpx(
					new DOMParser().parseFromString(wholeRouteGPX, "text/xml")
				)
			);
		}
	}, [mapRef.current, wholeRouteGPX]);

	useEffect(() => {
		if (partRouteGPX) {
			setPartRoute(
				toGeoJSON.gpx(new DOMParser().parseFromString(partRouteGPX, "text/xml"))
			);
		}
	}, [mapRef.current, partRouteGPX]);

	useEffect(() => {
		if (routeListGPXs) {
			const routeListGPXsArray = JSON.parse(routeListGPXs);
			setRouteList(
				routeListGPXsArray.map((gpx) =>
					toGeoJSON.gpx(new DOMParser().parseFromString(gpx, "text/xml"))
				)
			);
		}
	}, [mapRef.current, routeListGPXs]);

	useEffect(() => {
		if (focusOn === "live") {
			mapRef.current?.fitBounds(polyline.getBounds());
		} else {
			const routeToFocusOn =
				focusOn === "full" ? wholeRoute : focusOn === "all" ? "all" : partRoute;
			if (routeToFocusOn === "all") {
				mapRef?.current?.fitBounds([
					[45.775246, 10.541811],
					[47.894305, 5.81769],
				]);
				return;
			}
			if (routeToFocusOn) {
				const bboxArray = bbox(routeToFocusOn);
				const corner1 = [bboxArray[1], bboxArray[0]];
				const corner2 = [bboxArray[3], bboxArray[2]];
				mapRef.current.fitBounds([corner1, corner2]);
			}
		}
	}, [mapRef.current, partRoute, wholeRoute, routeList, focusOn]);

	useEffect(() => {
		mapRef.current?.invalidateSize();
		if (focusOn === "live") {
			mapRef.current?.fitBounds(polyline.getBounds());
		} else {
			const routeToFocusOn =
				focusOn === "full" ? wholeRoute : focusOn === "all" ? "all" : partRoute;
			if (routeToFocusOn === "all") {
				mapRef?.current?.fitBounds([
					[45.775246, 10.541811],
					[47.894305, 5.81769],
				]);
				return;
			}
			if (routeToFocusOn) {
				const bboxArray = bbox(routeToFocusOn);
				const corner1 = [bboxArray[1], bboxArray[0]];
				const corner2 = [bboxArray[3], bboxArray[2]];
				mapRef.current.fitBounds([corner1, corner2]);
			}
		}
	}, [fullScreen]);

	return (
		<div
			style={{
				position: fullScreen ? "fixed" : "relative",
				width: fullScreen ? "100vw" : undefined,
				top: fullScreen ? 0 : undefined,
				left: fullScreen ? 0 : undefined,
				height: fullScreen ? "100vh" : height,
				zIndex: 2,
			}}
		>
			<div
				style={{
					backgroundColor: "white",
					width: 30,
					height: 30,
					background:
						"#fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAA0CAYAAACU7CiIAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAACoSURBVFiF7ZZhDoAgCIWxdbF3suxkHM3+1FaOmNqyIr6fiHuJTyKklKgHQxcVF7rCKAUBiA5h5tCSR/T0iTakL9PWz05IZNEM3YSCt6BvCgFI2ps4Q9v3k9Ldgdrr8nrX9LYc7wwu5EIu9KCQT6rq+r8mVbV0ewBEIpqy8MzMsWR/8f+oxmES9u7olZPqLKQeYtqkWuy61V2xND/H3h35pNqMPTPYE1oAnZZStKN8jj8AAAAASUVORK5CYII=) no-repeat 0 0",
					backgroundSize: "26px 52px",
					backgroundPosition: fullScreen ? "0 -26px" : undefined,
					cursor: "pointer",
					position: "absolute",
					top: 10,
					right: 10,
					zIndex: 999,
					border: "2px solid rgba(0,0,0,0.2)",
					borderRadius: 4,
				}}
				onClick={() => {
					setFullScreen(!fullScreen);
				}}
			/>
			<MapContainer
				center={[46.57591, 7.84956]}
				zoom={9}
				minZoom={7}
				style={{ height: "100%", width: "100%" }}
				crs={L.CRS.EPSG3857}
				worldCopyJump={false}
				whenCreated={(mapInstance) => {
					mapRef.current = mapInstance;
				}}
			>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://wmts10.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
				/>
				<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://wmts10.geo.admin.ch/1.0.0/ch.swisstopo.swisstlm3d-wanderwege/default/current/3857/{z}/{x}/{y}.png"
					opacity={0.5}
				/>
				<Pane name="partRoute" className="partRoute">
					{partRoute ? (
						<GeoJSON
							key={1}
							data={partRoute}
							style={{
								color: "#0ea800",
								weight: 7,
								opacity: 1,
							}}
						/>
					) : (
						<div />
					)}
				</Pane>
				<Pane name="wholeRoute" className="wholeRoute">
					{wholeRoute ? (
						<GeoJSON
							key={2}
							data={wholeRoute}
							style={{
								color: "#0095ff",
								weight: 5,
								opacity: 1,
							}}
						/>
					) : (
						<div />
					)}
				</Pane>
				<Pane name={"route"}>
					{routeList?.length > 1 ? (
						routeList.map((route2, i) => {
							return (
								<GeoJSON
									key={i + 100}
									data={route2}
									style={{
										color: "#0095ff",
										weight: 5,
										opacity: 1,
									}}
								/>
							);
						})
					) : (
						<div />
					)}
				</Pane>
				{live ? (
					<Pane name="live" className="live">
						<Polyline
							pathOptions={{ color: "lime", weight: 7 }}
							positions={livePoints}
						/>
					</Pane>
				) : undefined}
			</MapContainer>
			<div
				style={{
					position: "absolute",
					top: 10,
					left: 60,
					zIndex: 1000,
					backgroundColor: "white",
					borderRadius: 5,
					fontSize: 14,
					padding: 5,
					paddingRight: 10,
				}}
			>
				{sectionGPXUrl ? (
					<div
						style={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<div
							style={{
								width: 20,
								height: 7,
								backgroundColor: "#0ea800",
								margin: "0 10px",
							}}
						/>
						<div>{sectionLabel ? sectionLabel : "Current Section"}</div>
					</div>
				) : undefined}
				{fullGPXUrl ? (
					<div
						style={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<div
							style={{
								width: 20,
								height: 5,
								backgroundColor: "#0095ff",
								margin: "0 10px",
							}}
						/>
						<div>{fullLabel ? fullLabel : "Complete Route"}</div>
					</div>
				) : undefined}
				{live ? (
					<div
						style={{
							display: "flex",
							alignItems: "center",
						}}
					>
						<div
							style={{
								width: 20,
								height: 7,
								backgroundColor: "lime",
								margin: "0 10px",
							}}
						/>
						<div>{"Letzte 7 Tage"}</div>
					</div>
				) : undefined}
			</div>
		</div>
	);
};

export default MapWidget;
