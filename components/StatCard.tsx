import Link from "next/link";
import React from "react";
import { Card } from "react-bootstrap";

const dateOptions = {
	year: "numeric" as "numeric",
	month: "long" as "long",
	day: "numeric" as "numeric",
};

const StatCard = ({
	data,
}: {
	data: {
		date: string;
		distance: number;
		ascent: number;
		descent: number;
		max: number;
		duration: number;
		days: number;
		tags: string[];
	};
}) => {
	return (
		<Card
			style={{
				marginBottom: 20,
				cursor: "pointer",
				width: 350,
				maxWidth: "100%",
				zIndex: 1,
			}}
		>
			<Card.Body>
				<div>
					<b>Datum:</b>{" "}
					{new Date(data.date).toLocaleDateString("de-CH", dateOptions)}
				</div>
				<div>
					<b>Länge:</b> {data.distance} km
				</div>
				<div>
					<b>Auf-/Abstieg:</b> {data.ascent}m/{data.descent}m
				</div>
				<div>
					<b>Höchster Punkt:</b> {data.max} M.ü.M.
				</div>{" "}
				<div>
					<b>Dauer:</b> {data.duration}h
				</div>
				{data.days ? (
					<div>
						<b>Tage:</b> {data.days}
					</div>
				) : undefined}
				<div
					style={{
						marginTop: 10,
						color: "#0d6efd",
						display: "flex",
						flexWrap: "wrap",
						fontSize: 14,
					}}
				>
					<div>Tags:&nbsp;</div>
					{data.tags.map((tag) => (
						<Link key={tag} href={{ pathname: "/blog/", query: { tag } }}>
							<div
								style={{
									marginRight: 5,
									cursor: "pointer",
									textDecoration: "underline",
								}}
							>
								<a>{tag}</a>,
							</div>
						</Link>
					))}
				</div>
			</Card.Body>
		</Card>
	);
};
export default StatCard;
