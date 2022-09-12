import Link from "next/link";
import { Card } from "react-bootstrap";
import { Post } from "../interfaces/interfaces";
import useIsMobile from "./isMobile";

const PostCard = ({ post }: { post: Post }) => {
	var dateOptions = {
		year: "numeric" as "numeric",
		month: "long" as "long",
		day: "numeric" as "numeric",
	};
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
							<Card.Text
								className={"text-muted"}
								style={{ fontSize: mobile ? 14 : undefined }}
							>
								{new Date(post.frontMatter.date).toLocaleDateString(
									"de-CH",
									dateOptions
								)}
							</Card.Text>
						</Card.Body>
					</Card>
				</a>
			</Link>
		</>
	);
};
export default PostCard;
