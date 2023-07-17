import Link from "next/link";
import { Card } from "react-bootstrap";
import { Post } from "../interfaces/interfaces";
import useIsMobile from "./isMobile";
import PostCardData from "./PostCardData";

const PostCard = ({ post }: { post: Post }) => {
	const mobile = useIsMobile();
	return (
		<>
			<Link href={"/blog/" + post.slug + "/"} passHref>
				<a style={{ color: "black", textDecoration: "none" }}>
					<Card style={{ marginBottom: 20, cursor: "pointer" }}>
						<div style={{ height: mobile ? 150 : 300 }}>
							<Card.Img
								variant="top"
								src={post.frontMatter.thumbnailUrl}
								height={"100%"}
								style={{ objectFit: "cover" }}
							/>
						</div>
						<Card.Body>
							<Card.Title style={{ fontSize: mobile ? 20 : undefined }}>
								{post.frontMatter.title}
							</Card.Title>
							<Card.Text style={{ fontSize: mobile ? 14 : undefined }}>
								{post.frontMatter.description}
							</Card.Text>

							<PostCardData frontMatter={post.frontMatter} short={true} />
						</Card.Body>
					</Card>
				</a>
			</Link>
		</>
	);
};
export default PostCard;
