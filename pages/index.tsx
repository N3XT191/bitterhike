import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

import { NextSeo } from "next-seo";

import { Container, Row } from "react-bootstrap";
import React from "react";
import { Post } from "../interfaces/interfaces";
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

export default function Home({ posts }: { posts: Post[] }) {
	return (
		<Container fluid>
			<NextSeo
				title="BitterHike - Marc's Wanderblog"
				description="BitterHike - Mein Blog in dem ich über meine Wandererlebnisse schreibe."
			/>
			<h1>BitterHike - Mein Wanderblog</h1>
			<p>
				Hier schreibe ich ab und zu über meine Wanderungen in und um die
				Schweizer Alpen. Unten sind meine aktuellsten Posts und{" "}
				<Link href="/wanderungen/" passHref>
					<a>hier</a>
				</Link>{" "}
				findest du eine Liste aller meiner Wanderungen.
			</p>
			<p>
				Falls ich gerade unterwegs in den Bergen bin kannst du mich auf der{" "}
				<Link href="/live/" passHref>
					<a>Live</a>
				</Link>{" "}
				Seite verfolgen!
			</p>
			<h2>Neuste Posts</h2>
			<Row xs={1} sm={1} md={2} lg={2} xl={2} xxl={2}>
				{posts.length > 0 ? (
					posts
						.sort((a, b) => (a.frontMatter.date < b.frontMatter.date ? 1 : -1))
						.slice(0, 4)
						.map((post, index) => <PostCard post={post} key={index} />)
				) : (
					<div>no posts found</div>
				)}
				<Link href="/blog/" passHref>
					<a style={{ marginTop: -10, marginBottom: 10, fontSize: 26 }}>
						Mehr Posts...
					</a>
				</Link>
			</Row>
		</Container>
	);
}
