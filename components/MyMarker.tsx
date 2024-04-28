import { Marker } from "react-leaflet";
import L from "leaflet";
import React from "react";
import ReactDOMServer from "react-dom/server";

export default ({
	iconSize,
	iconAnchor,
	popupAnchor,
	icon,
	children,
	position,
	...props
}) => {
	return (
		<Marker
			icon={L.divIcon({
				className: "custom icon",
				iconSize,
				iconAnchor,
				popupAnchor,
				html: ReactDOMServer.renderToString(icon),
			})}
			position={position}
			{...props}
		>
			{children}
		</Marker>
	);
};
