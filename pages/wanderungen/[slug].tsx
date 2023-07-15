import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import Img from "../../components/Img";
import React from "react";
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
	console.log(frontMatter);
	const mdxSource = await serialize(content);
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

	return {
		props: {
			frontMatter,
			slug,
			mdxSource,
			posts: posts.filter((p) => p.frontMatter.tags?.includes(frontMatter.id)),
		},
	};
};

interface Props {
	frontMatter: {
		[key: string]: any;
	};
	posts: any[];
	mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
}
const PostPage: React.FC<Props> = ({ frontMatter, mdxSource, posts }) => {
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
	const items = Array.from({ length: 17 }).map((_, i) => ({
		id: i,
		src: `${frontMatter.images}${i + 1}.jpeg`,
	}));
	return (
		<div className="mt-4" style={{ width: "100%", position: "relative" }}>
			<NextSeo
				title={"BitterHike - " + frontMatter.title}
				description={frontMatter.description}
			/>
			<h1>{frontMatter.title}</h1>
			<Separator />
			<Carousel
				items={items}
				renderItem={({ item, isSnapPoint }) => (
					<CarouselItem key={item.id} isSnapPoint={isSnapPoint}>
						<img
							src={item.src}
							width="250"
							height="250"
							alt=""
							style={{ objectFit: "cover" }}
						/>
					</CarouselItem>
				)}
			/>
			<Separator />
			<div style={{ display: "flex" }}>
				<Card
					style={{
						margin: 10,
						marginBottom: 30,
						maxWidth: "100%",
						zIndex: 1,
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
								{frontMatter.ascent + "m ↗ " + frontMatter.descent + "m ↘ "}
							</div>
						</div>
						<div style={{ display: "flex" }}>
							<b style={{ marginRight: 7 }}>Anzahl Tage: </b>
							<div>{frontMatter.days}</div>
						</div>
					</Card.Body>
				</Card>
				<div>
					<b>Posts:</b>
					{posts
						.sort((a, b) => (a.frontMatter.date > b.frontMatter.date ? 1 : -1))
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
				</div>
			</div>
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
					/>
				</div>
			) : (
				<div />
			)}
			<Separator />
			<div>
				<MDXRemote {...mdxSource} components={{ Img }} />
			</div>
		</div>
	);
};
export default PostPage;
