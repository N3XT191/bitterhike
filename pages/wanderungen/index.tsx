import matter from "gray-matter";
import dynamic from "next/dynamic";
import path from "path";
import React, { useState } from "react";
import Img from "../../components/Img";
import fs from "fs";
import Link from "next/link";
import { Card } from "react-bootstrap";
import useIsMobile from "../../components/isMobile";
import { NextSeo } from "next-seo";
const LongHikeSummary = dynamic(
	() => import("../../components/LongHikeSummary"),
	{
		ssr: false,
	}
);

export const getStaticProps = async () => {
	const files = fs.readdirSync(path.join("data", "posts"));
	const posts = files.map((filename) => {
		if (filename.slice(filename.length - 3) !== "mdx") {
			return;
		}
		const markdownWithMeta = fs.readFileSync(
			path.join("data", "posts", filename),
			"utf-8"
		);
		const { data: frontMatter } = matter(markdownWithMeta);
		return {
			frontMatter,
			slug: filename.split(".")[0],
		};
	});
	const longDistanceHikeFiles = fs.readdirSync(
		path.join("data", "long-distance-hikes")
	);
	const longDistanceHikes = longDistanceHikeFiles.map((filename) => {
		if (filename.slice(filename.length - 3) !== "mdx") {
			return;
		}
		const markdownWithMeta = fs.readFileSync(
			path.join("data", "long-distance-hikes", filename),
			"utf-8"
		);
		const { data: frontMatter } = matter(markdownWithMeta);
		return frontMatter;
	});
	return {
		props: {
			posts: posts.filter((p) => p),
			longDistanceHikes: longDistanceHikes
				.filter((h) => h)
				.sort((a, b) => (a.order > b.order ? 1 : -1)),
		},
	};
};

const Wanderungen = ({ posts, longDistanceHikes }) => {
	const MapWidget = React.useMemo(
		() =>
			dynamic(() => import("../../components/MapWidget"), {
				loading: () => <p>A map is loading</p>,
				ssr: false,
			}),
		[]
	);

	const getFilteredPosts = (tag) => {
		return posts.filter((p) => p.frontMatter.tags?.includes(tag));
	};

	const [fullScreen, setFullScreen] = useState("");

	const renderLink = (slug, title) => (
		<li>
			<Link href={"/blog/" + slug}>
				<div
					style={{
						marginBottom: 10,
						color: "#0d6efd",
						fontSize: 20,
						cursor: "pointer",
						textDecoration: "underline",
					}}
				>
					{title}
				</div>
			</Link>
		</li>
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
							{longDistanceHikes.map((hike) => (
								<li>
									<a href={"#" + hike.id}>
										{hike.title +
											(hike.finished ? " (Abgeschlossen)" : " (Aktiv)")}
									</a>
								</li>
							))}
							<li>
								<a href="#daytrips">Sonstige Wanderungen</a>
							</li>
						</ul>
					</Card.Body>
				</Card>
				{longDistanceHikes.map((hike) =>
					fullScreen === "" || fullScreen === hike.id ? (
						<LongHikeSummary
							id={hike.id}
							title={hike.title}
							description={hike.description}
							sectionGPXUrl={hike.doneGPXUrl}
							fullGPXUrl={hike.fullGPXUrl}
							posts={getFilteredPosts(hike.tag)}
							global={hike.global}
							finished={hike.finished}
							onToggleFullScreen={(fullScreen) =>
								setFullScreen(fullScreen ? hike.id : "")
							}
						/>
					) : null
				)}

				<div style={{ position: "relative" }}>
					<h3 id="daytrips">Sonstige Wanderungen</h3>
					<div>
						<div style={{ marginBottom: 20 }}>
							{fullScreen === "" || fullScreen === "all" ? (
								<MapWidget
									height={295}
									sectionLabel="Gewandert"
									fullLabel="Ganze Route"
									routeListUrls={getFilteredPosts("Sonstige Wanderungen").map(
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
							{getFilteredPosts("Sonstige Wanderungen")
								.sort((a, b) =>
									a.frontMatter.date < b.frontMatter.date ? 1 : -1
								)
								.map((p) => renderLink(p.slug, p.frontMatter.title))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Wanderungen;
