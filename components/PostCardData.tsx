import { Card } from "react-bootstrap";
import useIsMobile from "./isMobile";
import Link from "next/link";

const PostCardData = ({ frontMatter, short }) => {
	const mobile = useIsMobile(800);
	const iconSize = mobile ? 16 : 20;

	var dateOptions = {
		year: "2-digit" as "2-digit",
		month: "numeric" as "numeric",
		day: "numeric" as "numeric",
	};
	const iconContainer = {
		display: "flex",
		alignItems: "flex-end",
		marginRight: short ? 5 : 15,
		marginBottom: 10,
	};

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
				}}
			>
				<div style={iconContainer}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						className="w-5 h-5"
						height={iconSize}
					>
						<path d="M5.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H6a.75.75 0 01-.75-.75V12zM6 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H6zM7.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H8a.75.75 0 01-.75-.75V12zM8 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H8zM9.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V10zM10 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H10zM9.25 14a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H10a.75.75 0 01-.75-.75V14zM12 9.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V10a.75.75 0 00-.75-.75H12zM11.25 12a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75V12zM12 13.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V14a.75.75 0 00-.75-.75H12zM13.25 10a.75.75 0 01.75-.75h.01a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75H14a.75.75 0 01-.75-.75V10zM14 11.25a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 00.75-.75V12a.75.75 0 00-.75-.75H14z" />
						<path
							fillRule="evenodd"
							d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
							clipRule="evenodd"
						/>
					</svg>
					<Card.Text
						style={{
							fontSize: iconSize,
							lineHeight: iconSize + "px",
							marginLeft: 5,
						}}
					>
						{new Date(frontMatter.date).toLocaleDateString(
							"de-CH",
							dateOptions
						)}
					</Card.Text>
				</div>
				{short ? undefined : (
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							marginRight: 15,
							marginBottom: 10,
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-5 h-5"
							height={iconSize}
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
								clipRule="evenodd"
							/>
						</svg>

						<Card.Text
							style={{
								fontSize: iconSize,
								lineHeight: iconSize + "px",
								marginLeft: 5,
							}}
						>
							{frontMatter.duration + "h"}
						</Card.Text>
					</div>
				)}
				<div style={iconContainer}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						className="w-5 h-5"
						height={iconSize}
					>
						<path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 15.657a.75.75 0 001.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 6.464a.75.75 0 001.06-1.06l-1.06-1.06a.75.75 0 10-1.061 1.06l1.06 1.06z" />
					</svg>

					<Card.Text
						style={{
							fontSize: iconSize,
							lineHeight: iconSize + "px",
							marginLeft: 5,
						}}
					>
						{frontMatter.days + " Tag" + (frontMatter.days > 1 ? "e" : "")}
					</Card.Text>
				</div>
				<div style={iconContainer}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						className="w-5 h-5"
						height={iconSize}
					>
						<path
							fillRule="evenodd"
							d="M13.2 2.24a.75.75 0 00.04 1.06l2.1 1.95H6.75a.75.75 0 000 1.5h8.59l-2.1 1.95a.75.75 0 101.02 1.1l3.5-3.25a.75.75 0 000-1.1l-3.5-3.25a.75.75 0 00-1.06.04zm-6.4 8a.75.75 0 00-1.06-.04l-3.5 3.25a.75.75 0 000 1.1l3.5 3.25a.75.75 0 101.02-1.1l-2.1-1.95h8.59a.75.75 0 000-1.5H4.66l2.1-1.95a.75.75 0 00.04-1.06z"
							clipRule="evenodd"
						/>
					</svg>

					<Card.Text
						style={{
							fontSize: iconSize,
							lineHeight: iconSize + "px",
							marginLeft: 5,
						}}
					>
						{frontMatter.distance + "km"}
					</Card.Text>
				</div>
				<div style={iconContainer}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						className="w-5 h-5"
						height={iconSize}
					>
						<path
							fillRule="evenodd"
							d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
							clipRule="evenodd"
						/>
					</svg>
					<Card.Text
						style={{
							fontSize: iconSize,
							lineHeight: iconSize + "px",
							marginLeft: 5,
						}}
					>
						{frontMatter.ascent + "Hm"}
					</Card.Text>
				</div>{" "}
				{short ? undefined : (
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							marginRight: 15,
							marginBottom: 10,
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-5 h-5"
							height={iconSize}
						>
							<path
								fillRule="evenodd"
								d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z"
								clipRule="evenodd"
							/>
						</svg>

						<Card.Text
							style={{
								fontSize: iconSize,
								lineHeight: iconSize + "px",
								marginLeft: 5,
							}}
						>
							{frontMatter.descent + "Hm"}
						</Card.Text>
					</div>
				)}
				{short ? undefined : (
					<div
						style={{
							display: "flex",
							alignItems: "flex-end",
							marginRight: 15,
							marginBottom: 10,
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-5 h-5"
							height={iconSize}
						>
							<path
								fillRule="evenodd"
								d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z"
								clipRule="evenodd"
							/>
						</svg>

						<Card.Text
							style={{
								fontSize: iconSize,
								lineHeight: iconSize + "px",
								marginLeft: 5,
							}}
						>
							{frontMatter.max + "M.ü.M."}
						</Card.Text>
					</div>
				)}
			</div>
			{short ? undefined : (
				<div
					style={{
						marginTop: 15,
						color: "#0d6efd",
						display: "flex",
						flexWrap: "wrap",
						fontSize: 16,
						marginBottom: -5,
					}}
				>
					{frontMatter.tags.map((tag) => (
						<Link key={tag} href={{ pathname: "/blog/", query: { tag } }}>
							<div
								style={{
									marginRight: 5,
									cursor: "pointer",
									textDecoration: "underline",
								}}
							>
								<a>{tag}</a>,
							</div>
						</Link>
					))}
				</div>
			)}
		</>
	);
};
export default PostCardData;
