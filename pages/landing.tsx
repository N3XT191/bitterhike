import { useEffect, useRef, useState } from "react";
import SwitzerlandMap from "../components/SwitzerlandMap";
import { NextSeo } from "next-seo";
import matter from "gray-matter";
import fs from "fs";
import path from "path";

export const getStaticProps = async () => {
	const files = fs.readdirSync(path.join("data", "posts"));
	const posts = files
		.map((filename) => {
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
		})
		.filter((p) => p && p.frontMatter.tags.includes("Sonstige Wanderungen"));
	const longDistanceHikeFiles = fs.readdirSync(
		path.join("data", "long-distance-hikes")
	);
	const longDistanceHikes = longDistanceHikeFiles
		.map((filename) => {
			if (filename.slice(filename.length - 3) !== "mdx") {
				return;
			}
			const markdownWithMeta = fs.readFileSync(
				path.join("data", "long-distance-hikes", filename),
				"utf-8"
			);
			const { data: frontMatter } = matter(markdownWithMeta);
			return frontMatter;
		})
		.filter((h) => h);

	const gpxUrls = posts
		.map((post) => post.frontMatter.sectionGPXUrl)
		.concat(longDistanceHikes.map((hike) => hike.fullGPXUrl))
		.sort(() => Math.random() - 0.5);
	return {
		props: {
			gpxUrls,
		},
	};
};

const Landing = ({ gpxUrls }) => {
	const gpxIndexRef = useRef(0);
	const [gpxUrl, setGpxUrl] = useState(gpxUrls[0]);

	useEffect(() => {
		const intervalId = setInterval(() => {
			gpxIndexRef.current = (gpxIndexRef.current + 1) % gpxUrls.length;
			setGpxUrl(gpxUrls[gpxIndexRef.current]);
		}, 10000);

		return () => clearInterval(intervalId);
	}, [gpxUrls]);

	return (
		<div className="mt-3">
			<NextSeo title="BitterHike" description="" />

			<SwitzerlandMap gpxUrl={gpxUrl} />
		</div>
	);
};

export default Landing;
