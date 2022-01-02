const PostNavigation = ({
	previousSlug,
	nextSlug,
}: {
	previousSlug: string;
	nextSlug: string;
}) => {
	return (
		<div
			style={{
				width: "100%",
				display: "flex",
				justifyContent: "space-between",
			}}
		>
			<a href={"/blog/" + previousSlug + "/"}>
				{previousSlug ? "← Vorheriger Post" : ""}
			</a>
			<a href={"/blog/" + nextSlug + "/"}>
				{nextSlug ? "Nächster Post →" : ""}
			</a>
		</div>
	);
};
export default PostNavigation;
