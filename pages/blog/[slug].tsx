import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import Img from "../../components/Img";
import React from "react";
import dynamic from "next/dynamic";
import useIsMobile from "../../components/isMobile";
import PostNavigation from "../../components/PostNavigation";
import StatCard from "../../components/StatCard";

import { NextSeo } from "next-seo";
import { Card } from "react-bootstrap";
import PostCardData from "../../components/PostCardData";

export const getStaticPaths = async () => {
	const files = fs.readdirSync(path.join("data", "posts"));
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
		path.join("data", "posts", slug + ".mdx"),
		"utf-8"
	);
	const files = fs.readdirSync(path.join("data", "posts"));
	const slugs = files.map((filename) => filename.replace(".mdx", "")).sort();
	const slugIndex = slugs.findIndex((s) => s === slug);
	const { data: frontMatter, content } = matter(markdownWithMeta);
	const mdxSource = await serialize(content);
	return {
		props: {
			frontMatter,
			slug,
			nextSlug: slugIndex === slugs.length - 1 ? null : slugs[slugIndex + 1],
			previousSlug: slugIndex === 0 ? null : slugs[slugIndex - 1],
			mdxSource,
		},
	};
};

interface Props {
	frontMatter: {
		[key: string]: any;
	};
	nextSlug: string;
	previousSlug: string;
	mdxSource: MDXRemoteSerializeResult<Record<string, unknown>>;
}
const PostPage: React.FC<Props> = ({
	frontMatter,
	mdxSource,
	nextSlug,
	previousSlug,
}) => {
	const MapWidget = React.useMemo(
		() =>
			dynamic(() => import("../../components/MapWidget"), {
				loading: () => <p>A map is loading</p>,
				ssr: false,
			}),
		[]
	);
	const useMobile = useIsMobile();

	return (
		<div className="mt-4" style={{ width: "100%", position: "relative" }}>
			<NextSeo
				title={"BitterHike - " + frontMatter.title}
				description={frontMatter.description}
			/>
			<PostNavigation previousSlug={previousSlug} nextSlug={nextSlug} />
			<h1>{frontMatter.title}</h1>
			<Card style={{ marginBottom: 20, cursor: "pointer" }}>
				<Card.Body style={{ padding: 15 }}>
					<PostCardData frontMatter={frontMatter} short={false} />
				</Card.Body>
			</Card>
			{frontMatter.sectionGPXUrl ? (
				<div
					style={{
						width: "100%",
						maxWidth: "100%",
						marginBottom: 10,
						height: useMobile ? 200 : 400,
					}}
				>
					<MapWidget
						sectionGPXUrl={frontMatter.sectionGPXUrl}
						fullGPXUrl={frontMatter.fullGPXUrl}
						height={useMobile ? 200 : 400}
						global={frontMatter.global}
					/>
				</div>
			) : (
				<div />
			)}
			{
				//<StatCard data={frontMatter as any} />
			}
			<div style={{ fontSize: useMobile ? undefined : 24 }}>
				<MDXRemote {...mdxSource} components={{ Img }} />
			</div>
			<PostNavigation previousSlug={previousSlug} nextSlug={nextSlug} />
		</div>
	);
};
export default PostPage;
