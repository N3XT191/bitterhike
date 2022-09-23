import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { NextSeo } from "next-seo";

import { Container, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import React from "react";
import RemoveTagFilter from "../components/RemoveTagFilter";
import PostCard from "../components/PostCard";

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

export default function Blog({ posts }: { posts: any[] }) {
	const router = useRouter();
	const { tag } = router.query;

	const filteredPosts = tag
		? posts.filter((p) => p.frontMatter.tags.findIndex((t) => t === tag) !== -1)
		: posts;
	return (
		<Container fluid>
			<NextSeo
				title="BitterHike - Marc's Wanderblog"
				description="BitterHike - Mein Blog in dem ich über meine Wandererlebnisse schreibe."
			/>

			<div style={{ display: "flex", alignItems: "center" }}>
				<h1>Blog{tag ? ": " + tag : ""}</h1>
				{tag ? <RemoveTagFilter /> : undefined}
			</div>
			<Row xs={1} sm={1} md={2} lg={2} xl={2} xxl={2}>
				{filteredPosts.length > 0 ? (
					filteredPosts
						.sort((a, b) => (a.frontMatter.date < b.frontMatter.date ? 1 : -1))
						.map((post, index) => <PostCard post={post} key={index} />)
				) : (
					<div>no posts found</div>
				)}
			</Row>
		</Container>
	);
}
