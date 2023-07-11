import matter from "gray-matter";
import dynamic from "next/dynamic";
import path from "path";
import React, { useState } from "react";
import Img from "../components/Img";
import fs from "fs";
import Link from "next/link";
import { Card } from "react-bootstrap";
import useIsMobile from "../components/isMobile";
import { NextSeo } from "next-seo";
const LongHikeSummary = dynamic(() => import("../components/LongHikeSummary"), {
	ssr: false,
});

export const getStaticProps = async () => {
	const files = fs.readdirSync(path.join("posts"));
	const posts = files.map((filename) => {
		if (filename.slice(filename.length - 3) !== "mdx") {
			return;
		}
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
			posts: posts.filter((p) => p),
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

	const sonstigeWanderungenPosts = posts.filter(
		(p) =>
			p.frontMatter.tags?.findIndex((t) => t === "Sonstige Wanderungen") !== -1
	);

	const [fullScreen, setFullScreen] = useState("");
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
								<a href="#jura">Jura (Aktiv)</a>
							</li>
							<li>
								<a href="#nswest">Schweiz Nord-Süd Querung 2.0 (Aktiv)</a>
							</li>
							<li>
								<a href="#ns">Schweiz Nord-Süd Querung (Abgeschlossen)</a>
							</li>
							<li>
								<a href="#daytrips">Sonstige Wanderungen</a>
							</li>
						</ul>
					</Card.Body>
				</Card>
				{fullScreen === "" || fullScreen === "hrp" ? (
					<LongHikeSummary
						id="hrp"
						title="HRP - Haute Randonnée Pyrénéenne"
						description={Array(7).fill(".")}
						sectionGPXUrl="/HRP/gpx/HRP_done.gpx"
						fullGPXUrl="/HRP/gpx/HRP_ganz.gpx"
						posts={posts.filter(
							(p) => p.frontMatter.tags.findIndex((t) => t === "HRP") !== -1
						)}
						focus={true}
						global={true}
						onToggleFullScreen={(fullScreen: boolean) =>
							setFullScreen(fullScreen ? "hrp" : "")
						}
					/>
				) : undefined}
				{fullScreen === "" || fullScreen === "jura" ? (
					<LongHikeSummary
						id="jura"
						title="Jura (Aktiv)"
						description={[
							"Vom Kanton Zürich bis nach Nyon, dem ganzen Jura entlang. Das ist der Plan.",
							"Im Sommer 2021 war ich schon auf dem Lägern. Die weitere Route führt über den Hauenstein, Weissenstein, Chasseral und den Chasseron, so oft wie möglich auf der Krete bis zum Lac de Joux und von da runter nach Nyon",
							"Unten aufgelistet sind alle Abschnitte die dazu gehören.",
						]}
						sectionGPXUrl="/jura/gpx/jura-completed.gpx"
						fullGPXUrl="/jura/gpx/jura.gpx"
						posts={posts.filter(
							(p) => p.frontMatter.tags.findIndex((t) => t === "Jura") !== -1
						)}
						focus={true}
						onToggleFullScreen={(fullScreen: boolean) =>
							setFullScreen(fullScreen ? "jura" : "")
						}
					/>
				) : undefined}
				{fullScreen === "" || fullScreen === "nswest" ? (
					<LongHikeSummary
						id="nswest"
						title="Schweiz Nord-Süd Querung 2.0 (Aktiv)"
						description={[
							"Seit Beginn der Planungsphase meiner Nord-Süd Querung habe ich mit einer alternativen Route geliebäugelt die im Tessin der Via Alta Verzasca folgt und dann auf 'meiner' Seite des Zürichsees vorbeikommt.",
							"In 5 Tagesetappen habe ich in den letzten 2-3 Jahren schon einen Teil der Route schon gewandert, der Grossteil steht aber noch aus.  Die Route ist mit 410 km etwas länger als die erste Querung, und hat mit über 29'000 Hm deutlich mehr Höhe!",
							"Unten aufgelistet sind alle Abschnitte die dazu gehören.",
						]}
						sectionGPXUrl="/NSWest/gpx/nswest-completed.gpx"
						fullGPXUrl="/NSWest/gpx/nswest.gpx"
						posts={posts.filter(
							(p) =>
								p.frontMatter.tags.findIndex((t) => t === "Nord-Süd-2.0") !== -1
						)}
						focus={true}
						onToggleFullScreen={(fullScreen: boolean) =>
							setFullScreen(fullScreen ? "nswest" : "")
						}
					/>
				) : undefined}
				{fullScreen === "" || fullScreen === "ns" ? (
					<LongHikeSummary
						id="ns"
						title="Schweiz Nord-Süd Querung (Abgeschlossen)"
						description={[
							"In 2019, 2020 und 2021 durchquerte ich die Schweiz vom südlichsten Punkt im Tessin zum nördlichsten Punkt im Kanton Schaffhausen in insgesamt 16 Tagesettapen in 5 Abschnitten. Grösstenteils alleine und mit Zelt, im Norden mit kleinem Rucksack in Tagesettappen. Die Route ist insgesamt fast 400km lang und hat 24'500 Hm. Das gibt pro Tag im Schnitt rund 24 km und über 1500 Hm!",
							"Im Juni mehrfach vom letzten Schnee noch aufgehalten, im August und September aber auch teilweise vom ersten Schnee im Herbst überrascht... Von Alpinen Gratwanderungen bis gemütlichen Waldspaziergang hat diese Route für alle etwas.",
						]}
						sectionGPXUrl="/NS/gpx/ns.gpx"
						fullGPXUrl=""
						posts={posts.filter(
							(p) =>
								p.frontMatter.tags.findIndex((t) => t === "Nord-Süd") !== -1
						)}
						onToggleFullScreen={(fullScreen: boolean) =>
							setFullScreen(fullScreen ? "ns" : "")
						}
					/>
				) : undefined}

				<div style={{ position: "relative" }}>
					<h3 id="daytrips">Sonstige Wanderungen</h3>
					<div>
						<div style={{ marginBottom: 20 }}>
							{fullScreen === "" || fullScreen === "all" ? (
								<MapWidget
									height={295}
									sectionLabel="Gewandert"
									fullLabel="Ganze Route"
									routeListUrls={sonstigeWanderungenPosts.map(
										(post) => post.frontMatter.sectionGPXUrl
									)}
									focusOn="all"
									onToggleFullScreen={(fullScreen: boolean) =>
										setFullScreen(fullScreen ? "all" : "")
									}
								/>
							) : undefined}
						</div>
						<ul>
							{sonstigeWanderungenPosts
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
