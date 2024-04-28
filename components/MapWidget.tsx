import React, { useState, useEffect, useRef } from "react";
import {
	MapContainer,
	TileLayer,
	GeoJSON,
	Pane,
	Polyline,
	Popup,
} from "react-leaflet";
import Marker from "./MyMarker";

import { gpx } from "@tmcw/togeojson";

import { LatLngTuple, Map, polyline, Browser, CRS } from "leaflet";

import bbox from "turf-bbox";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css"; // Re-uses images from ~leaflet package
import "leaflet-defaulticon-compatibility";

import "leaflet-gpx";

// some other code

async function fetchGPX(path: string) {
	try {
		return await fetch(path).then((response) => response.text());
	} catch (e) {}
}

function useFetcher(fetchSomethingAPI: () => Promise<any>) {
	const [data, setData] = useState<any>();

	useEffect(() => {
		fetchSomethingAPI().then((response) => {
			setData(response);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return data;
}

function useFetcherMany(fetchMany: (() => Promise<any>)[]) {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		Promise.all(fetchMany.map((f) => f())).then((response) =>
			setData(response)
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return data;
}

const renderMarker = (label) => {
	const markerStyle = {};
	return (
		<div style={markerStyle} className="pin">
			{label}
		</div>
	);
};

interface MapWidgetProps {
	sectionGPXUrl?: string;
	fullGPXUrl?: string;
	height: number;
	sectionLabel?: string;
	fullLabel?: string;
	focusOn?: "section" | "full" | "live" | "all";
	live?: boolean;
	livePoints?: { lat: number; lng: number; age: string }[][];
	routeListUrls?: string[];
	global?: boolean;
	onToggleFullScreen?: (fullScreen: boolean) => void;
	markers?: { position: [number, number]; label: string }[];
}

const MapWidget: React.FC<MapWidgetProps> = ({
	sectionGPXUrl,
	fullGPXUrl,
	height,
	sectionLabel,
	fullLabel,
	focusOn,
	live,
	livePoints,
	routeListUrls,
	global,
	onToggleFullScreen,
	markers,
}) => {
	const [fullScreen, setFullScreen] = useState(false);

	let mapRef = useRef<Map>();

	const [wholeRoute, setWholeRoute] = useState<any>();
	const [partRoute, setPartRoute] = useState<any>();
	const [routeList, setRouteList] = useState<any[]>([undefined]);

	const wholeRouteGPX = fullGPXUrl
		? useFetcher(() => fetchGPX(fullGPXUrl))
		: undefined;
	const partRouteGPX = sectionGPXUrl
		? useFetcher(() => fetchGPX(sectionGPXUrl))
		: undefined;
	const routeListGPXs =
		routeListUrls?.length > 0
			? JSON.stringify(
					useFetcherMany(routeListUrls.map((url) => () => fetchGPX(url)))
			  )
			: undefined;

	let polyLine;
	if (livePoints?.length > 0) {
		polyLine = polyline(livePoints.flat(), {
			lineJoin: "round",
		});
	}

	useEffect(() => {
		if (wholeRouteGPX) {
			setWholeRoute(
				gpx(new DOMParser().parseFromString(wholeRouteGPX, "text/xml"))
			);
		}
	}, [mapRef.current, wholeRouteGPX]);

	useEffect(() => {
		if (partRouteGPX) {
			setPartRoute(
				gpx(new DOMParser().parseFromString(partRouteGPX, "text/xml"))
			);
		}
	}, [mapRef.current, partRouteGPX]);

	useEffect(() => {
		if (routeListGPXs) {
			const routeListGPXsArray = JSON.parse(routeListGPXs);
			setRouteList(
				routeListGPXsArray.map((gpxString: string) =>
					gpx(new DOMParser().parseFromString(gpxString, "text/xml"))
				)
			);
		}
	}, [mapRef.current, routeListGPXs]);

	useEffect(() => {
		if (focusOn === "live" && polyLine) {
			mapRef.current?.fitBounds(polyLine.getBounds());
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
				const corner1 = [bboxArray[1], bboxArray[0]] as LatLngTuple;
				const corner2 = [bboxArray[3], bboxArray[2]] as LatLngTuple;
				mapRef.current?.fitBounds([corner1, corner2]);
			}
		}
	}, [mapRef.current, partRoute, wholeRoute, routeList, focusOn, polyLine]);

	useEffect(() => {
		mapRef.current?.invalidateSize();
		if (focusOn === "live" && polyLine) {
			mapRef.current?.fitBounds(polyLine.getBounds());
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
				const corner1 = [bboxArray[1], bboxArray[0]] as LatLngTuple;
				const corner2 = [bboxArray[3], bboxArray[2]] as LatLngTuple;
				mapRef.current.fitBounds([corner1, corner2]);
			}
		}
	}, [fullScreen]);

	const keys = [
		"o7cZVRPphCemlW1RkLto", //nxt
		"Li3zsMRF2YsO6iSNBdTs", //@b.li
		"vBVR7FsoukrtPkMK1tcT", //bluewin
		"F0iOF2FVWQb0y7bTfUcl", //mbi
		"uuvwmcKSJPIIH0MuBlw9", //m.b@a
	];
	const key = keys[Math.floor(Math.random() * keys.length)];

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
					onToggleFullScreen?.(!fullScreen);
					setFullScreen(!fullScreen);
				}}
			/>
			<MapContainer
				center={[46.57591, 7.84956]}
				zoom={9}
				tap={Browser.safari && Browser.mobile}
				minZoom={global ? 5 : 7}
				style={{ height: "100%", width: "100%", transform: "scale(1)" }}
				crs={CRS.EPSG3857}
				worldCopyJump={false}
				whenCreated={(mapInstance) => {
					mapRef.current = mapInstance;
				}}
			>
				<TileLayer
					//url="https://wmts10.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
					//url="https://tile.tracestrack.com/topo__/{z}/{x}/{y}.png?key=c6dfcc3433a0b2347e354f6b557cae06"
					url={
						global
							? "https://api.maptiler.com/maps/topo-v2/{z}/{x}/{y}.png?key=" +
							  key
							: //"https://tile.tracestrack.com/topo__/{z}/{x}/{y}.png?key=c6dfcc3433a0b2347e354f6b557cae06"
							  "https://wmts10.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
					}
				/>
				{!global && (
					<TileLayer
						url="https://wmts10.geo.admin.ch/1.0.0/ch.swisstopo.swisstlm3d-wanderwege/default/current/3857/{z}/{x}/{y}.png"
						opacity={0.5}
					/>
				)}

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
								weight: 3,
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
				{live && livePoints?.length > 0 && (
					<Pane name="live" className="live">
						{livePoints.map((section, i) => (
							<Polyline
								pathOptions={{ color: "#D33D17", weight: 7 }}
								positions={section}
								key={i}
							/>
						))}
						{livePoints?.[0] && (
							<>
								<Marker
									position={livePoints[0][0]}
									iconSize={[0, 22]}
									iconAnchor={[16, 45]}
									popupAnchor={[0, -22]}
									icon={renderMarker("")}
									children={<Popup>{"vor " + livePoints[0][0].age}</Popup>}
								/>
							</>
						)}
					</Pane>
				)}
				{markers && markers?.length > 0 && (
					<Pane name="markers" className="markers">
						{markers.map((marker, i) => (
							<Marker
								position={marker.position}
								iconSize={[0, 22]}
								iconAnchor={[16, 45]}
								popupAnchor={[0, -22]}
								icon={renderMarker(marker.label)}
								children={<div />}
							/>
						))}
					</Pane>
				)}
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
				{fullGPXUrl && (
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
				)}
				{sectionGPXUrl && (
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
				)}
				{live && (
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
								backgroundColor: "#D33D17",
								margin: "0 10px",
							}}
						/>
						<div>{"Letzte 7 Tage (Live)"}</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default MapWidget;
