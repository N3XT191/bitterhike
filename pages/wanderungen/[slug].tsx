import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import Img from "../../components/Img";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import useIsMobile from "../../components/isMobile";

import { NextSeo } from "next-seo";
import { Carousel, CarouselItem } from "../../components/ImageCarousel";
import { Card } from "react-bootstrap";
import Link from "next/link";
import Separator from "../../components/Separator";

export const getStaticPaths = async () => {
	const files = fs.readdirSync(path.join("data", "long-distance-hikes"));
	const paths = files.map((filename) => ({
		params: {
			slug: filename.replace(".mdx", ""),
		},
	}));
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps = async ({
	params: { slug },
}: {
	params: { slug: string };
}) => {
	const markdownWithMeta = fs.readFileSync(
		path.join("data", "long-distance-hikes", slug + ".mdx"),
		"utf-8"
	);
	const { data: frontMatter, content } = matter(markdownWithMeta);
	const mdxSource = await serialize(content);
	const photos = fs.readdirSync(path.join("public", frontMatter.images));
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
	const sorting = (slug) => {
		if (slug === "utah") return (a, b) => (a > b ? 1 : -1);
		else return (a, b) => (parseInt(a) > parseInt(b) ? 1 : -1);
	};
	const imageUrls = photos
		.map((filename) => {
			if (
				["jpeg", ".png", ".jpg", ".JPG", "JPEG"].includes(
					filename.slice(filename.length - 4)
				)
			) {
				return filename;
			} else {
				return null;
			}
		})
		.sort(sorting(slug))
		.filter((e) => e && !e.includes("thumb"))
		.map((e) => frontMatter.images + e);
	return {
		props: {
			frontMatter,
			slug,
			mdxSource,
			posts: posts.filter((p) => p.frontMatter.tags?.includes(frontMatter.tag)),
			imageUrls: imageUrls.filter((p) => p),
		},
	};
};

interface Props {
	frontMatter: {
		[key: string]: any;
	};
	posts: any[];
	mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
	imageUrls: string[];
}
const PostPage: React.FC<Props> = ({
	frontMatter,
	mdxSource,
	posts,
	imageUrls,
}) => {
	const MapWidget = React.useMemo(
		() =>
			dynamic(() => import("../../components/MapWidget"), {
				loading: () => <p>A map is loading</p>,
				ssr: false,
			}),
		[
			/* list variables which should trigger a re-render here */
		]
	);
	const useMobile = useIsMobile();
	const items = imageUrls.map((url, i) => {
		return {
			id: i,
			src: url,
		};
	});
	const [fullScreen, setFullScreen] = useState("");

	return (
		<div className="mt-4" style={{ width: "100%", position: "relative" }}>
			<NextSeo
				title={"BitterHike - " + frontMatter.title}
				description={frontMatter.description}
			/>
			<h1>{frontMatter.title}</h1>
			<Separator />
			<Carousel
				items={useMobile ? items : items.slice(0, items.length)}
				renderItem={({ item, isSnapPoint }) => (
					<>
						<CarouselItem
							key={item.id}
							isSnapPoint={isSnapPoint}
							size={useMobile ? 150 : 250}
						>
							<img
								src={item.src}
								width={useMobile ? 150 : 250}
								height={useMobile ? 150 : 250}
								alt=""
								style={{ objectFit: "cover" }}
								onClick={() => setFullScreen(item.src)}
							/>
						</CarouselItem>
					</>
				)}
			/>
			<Separator />
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					width: "100%",
					flexDirection: useMobile ? "column-reverse" : "row",
					flexGrow: "unset",
				}}
			>
				<div>
					<b style={{ fontSize: 24 }}>Blog Posts:</b>
					<ul>
						{posts
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
				<Card
					style={{
						margin: 10,
						marginBottom: 30,
						zIndex: 1,
						height: "100%",
					}}
				>
					<Card.Body>
						<div style={{ display: "flex" }}>
							<b style={{ marginRight: 7 }}>Wann: </b>
							<div>{frontMatter.when}</div>
						</div>
						<div style={{ display: "flex" }}>
							<b style={{ marginRight: 7 }}>Länge: </b>
							<div>{frontMatter.distance + "km"}</div>
						</div>
						<div style={{ display: "flex" }}>
							<b style={{ marginRight: 7 }}>Höhe: </b>
							<div>
								{frontMatter.ascent.toLocaleString("de-CH") +
									"m ↗ " +
									frontMatter.descent.toLocaleString("de-CH") +
									"m ↘ "}
							</div>
						</div>
						<div style={{ display: "flex" }}>
							<b style={{ marginRight: 7 }}>Anzahl Tage: </b>
							<div>{frontMatter.days}</div>
						</div>
					</Card.Body>
				</Card>
			</div>
			<Separator />
			<div>
				{frontMatter.description.map((line) => (
					<p>{line}</p>
				))}
			</div>
			<Separator />
			{frontMatter.fullGPXUrl ? (
				<div
					style={{
						width: "100%",
						marginBottom: 10,
						height: useMobile ? 400 : 650,
					}}
				>
					<MapWidget
						sectionGPXUrl={frontMatter.doneGPXUrl}
						fullGPXUrl={frontMatter.fullGPXUrl}
						height={useMobile ? 400 : 650}
						global={frontMatter.global}
						sectionLabel="Gewandert"
						fullLabel="Ganze Route"
						focusOn={"full"}
						markers={frontMatter.markers}
						startEndMarkers="whole"
					/>
				</div>
			) : (
				<div />
			)}
			<Separator />
			<div>
				<MDXRemote
					{...mdxSource}
					components={{
						Img,
						tr: (props) => (
							<tr
								style={{
									borderBottom: "1px solid black",
								}}
							>
								{props.children}
							</tr>
						),
					}}
				/>
			</div>
			{fullScreen ? (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100vh",
						backgroundColor: "rgba(0,0,0,0.9)",
						zIndex: 9999999,
						display: "flex",
						justifyItems: "center",
						alignItems: "center",
					}}
					onClick={() => setFullScreen("")}
				>
					<img
						style={{
							maxWidth: "100%",
							maxHeight: "100%",
							objectFit: "contain",
							margin: "auto",
						}}
						src={fullScreen}
						alt="image"
					/>
				</div>
			) : undefined}
		</div>
	);
};
export default PostPage;
