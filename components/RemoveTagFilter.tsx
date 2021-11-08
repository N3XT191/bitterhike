import Link from "next/link";

const RemoveTagFilter = () => {
	return (
		<Link href="/">
			<div
				className="cross"
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					paddingBottom: 4,
					marginBottom: 5,
					fontSize: 25,
					fontWeight: 500,
					marginLeft: 10,
					border: "3px solid gray",
					height: 30,
					width: 30,
					borderRadius: 3,
					cursor: "pointer",
				}}
			>
				&#215;
			</div>
		</Link>
	);
};
export default RemoveTagFilter;
