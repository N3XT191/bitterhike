import matter from "gray-matter";
import dynamic from "next/dynamic";
import path from "path";
import React from "react";
import Img from "../components/Img";
import fs from "fs";
import Link from "next/link";
import { Card } from "react-bootstrap";
import useIsMobile from "../components/isMobile";
import { NextSeo } from "next-seo";

export const getStaticProps = async () => {
	const files = fs.readdirSync(path.join("posts"));
	const posts = files.map((filename) => {
		const markdownWithMeta = fs.readFileSync(
			path.join("posts", filename),
			"utf-8"
		);
		const { data: frontMatter } = matter(markdownWithMeta);
		return {
			frontMatter,
			slug: filename.split(".")[0],
		};
	});
	return {
		props: {
			posts,
		},
	};
};
const Bio = ({ posts }: { posts: any[] }) => {
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
				title="BitterHike - Wanderungen"
				description="Eine Übersicht meiner Wanderungen in und um die Schweizer Alpen"
			/>
			<div
				style={{
					width: "100%",
					maxHeight: 250,
					overflow: "hidden",
					objectFit: "cover",
					marginBottom: 20,
				}}
			>
				<Img src="/NS/67.jpeg" d="" />
			</div>
			<p className="display-4 text-center">Wanderungen</p>
			<div style={{ position: "relative" }}>
				<Card
					style={{
						marginBottom: 20,
						padding: 20,
						paddingBottom: 0,
						zIndex: 1,
					}}
				>
					<Card.Title>Inhalt:</Card.Title>
					<Card.Body
						style={{
							fontSize: useIsMobile() ? 16 : undefined,
							padding: useIsMobile() ? 0 : undefined,
						}}
					>
						<ul style={{ paddingLeft: useIsMobile() ? 20 : undefined }}>
							<li>
								<a href="#nswest">Schweiz Nord-Süd Querung 2.0 (Aktiv)</a>
							</li>
							<li>
								<a href="#ns">Schweiz Nord-Süd Querung (Abgeschlossen)</a>
							</li>
							<li>
								<a href="#daytrips">Tageswanderungen</a>
							</li>
						</ul>
					</Card.Body>
				</Card>
				<h3 id="nswest">Schweiz Nord-Süd Querung 2.0 (Aktiv)</h3>
				<div
					style={{
						width: 450,
						maxWidth: "100%",
						height: 300,
						float: "right",
						marginBottom: 10,
						marginLeft: 10,
					}}
				>
					<MapWidget
						sectionGPXUrl="/NSWest/gpx/nswest1.gpx"
						fullGPXUrl="/NSWest/gpx/nswest.gpx"
						height={300}
						sectionLabel="Gewandert"
						fullLabel="Ganze Route"
						focusOn="full"
					/>
				</div>
				<div>
					<p>
						Seit Beginn der Planungsphase meiner Nord-Süd Querung habe ich mit
						einer alternativen Route geliebäugelt die im Tessin der Via Alta
						Verzasca folgt und dann auf "meiner" Seite des Zürichsees
						vorbeikommt.
					</p>
					<p>
						In 5 Tagesetappen habe ich in den letzten 2-3 Jahren schon einen
						Teil der Route schon gewandert, der Grossteil steht aber noch aus.
						Die Route ist mit 410 km etwas länger als die erste Querung, und hat
						mit über 29'000 Hm deutlich mehr Höhe!
					</p>

					<p>Unten aufgelistet sind alle Abschnitte die dazu gehören.</p>
					<ul>
						{posts
							.filter(
								(p) =>
									p.frontMatter.tags.findIndex((t) => t === "Nord-Süd-2.0") !==
									-1
							)
							.sort((a, b) =>
								a.frontMatter.date > b.frontMatter.date ? 1 : -1
							)
							.map((p) => (
								<li>
									<Link href={"/blog/" + p.slug}>
										<div
											style={{
												marginBottom: 10,
												color: "#0d6efd",
												fontSize: 20,
												cursor: "pointer",
												textDecoration: "underline",
											}}
										>
											{p.frontMatter.title}
										</div>
									</Link>
								</li>
							))}
					</ul>
				</div>
				<h3 id="ns">Schweiz Nord-Süd Querung (Abgeschlossen)</h3>
				<div
					style={{
						width: 450,
						maxWidth: "100%",
						height: 300,
						float: "right",
						marginBottom: 10,
						marginLeft: 10,
					}}
				>
					<MapWidget
						sectionGPXUrl="/NS/gpx/ns.gpx"
						fullGPXUrl=""
						height={300}
						sectionLabel="Route"
					/>
				</div>
				<div>
					<p>
						In 2019, 2020 und 2021 durchquerte ich die Schweiz vom südlichsten
						Punkt im Tessin zum nördlichsten Punkt im Kanton Schaffhausen in
						insgesamt 16 Tagesettapen in 5 Abschnitten. Grösstenteils alleine
						und mit Zelt, im Norden mit kleinem Rucksack in Tagesettappen. Die
						Route ist insgesamt fast 400km lang und hat 24'500 Hm. Das gibt pro
						Tag im Schnitt rund 24 km und über 1500 Hm!
					</p>
					<p>
						Im Juni mehrfach vom letzten Schnee noch aufgehalten, im August und
						September aber auch teilweise vom ersten Schnee im Herbst
						überrascht... Von Alpinen Gratwanderungen bis gemütlichen
						Waldspaziergang hat diese Route für alle etwas.
					</p>
					<div
						style={{
							width: "100%",
							maxHeight: 320,
							overflow: "hidden",
							objectFit: "cover",
							marginBottom: 20,
						}}
					>
						<Img src="/NS/168.jpeg" d="" />
					</div>

					<p>Unten aufgelistet sind alle Abschnitte die dazu gehören.</p>
					<ul>
						{posts
							.filter(
								(p) =>
									p.frontMatter.tags.findIndex((t) => t === "Nord-Süd") !== -1
							)
							.sort((a, b) =>
								a.frontMatter.date > b.frontMatter.date ? 1 : -1
							)
							.map((p) => (
								<li>
									<Link href={"/blog/" + p.slug}>
										<div
											style={{
												marginBottom: 10,
												color: "#0d6efd",
												fontSize: 20,
												cursor: "pointer",
												textDecoration: "underline",
											}}
										>
											{p.frontMatter.title}
										</div>
									</Link>
								</li>
							))}
					</ul>
				</div>
				<div style={{ position: "relative" }}>
					<h3 id="daytrips">Sonstige Wanderungen</h3>
					<div>
						<p>Eine Liste aller meiner Tageswanderungen:</p>
						<ul>
							{posts
								.filter(
									(p) =>
										p.frontMatter.tags?.findIndex(
											(t) => t === "Sonstige Wanderungen"
										) !== -1
								)
								.sort((a, b) =>
									a.frontMatter.date < b.frontMatter.date ? 1 : -1
								)
								.map((p) => (
									<li>
										<Link href={"/blog/" + p.slug}>
											<div
												style={{
													marginBottom: 10,
													color: "#0d6efd",
													fontSize: 20,
													cursor: "pointer",
													textDecoration: "underline",
												}}
											>
												{p.frontMatter.title}
											</div>
										</Link>
									</li>
								))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Bio;
