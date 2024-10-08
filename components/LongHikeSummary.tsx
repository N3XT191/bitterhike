import React from "react";
import Link from "next/link";
import MapWidget from "./MapWidget";

interface LongHikeSummaryProps {
	id: string;
	title: string;
	sectionGPXUrl: string;
	fullGPXUrl: string;
	posts: any[]; // Replace 'any' with the actual type for 'posts' if possible
	description: string[];
	finished?: boolean;
	global?: boolean;
	onToggleFullScreen?: (fullScreen: boolean) => void;
}

const LongHikeSummary: React.FC<LongHikeSummaryProps> = ({
	id,
	title,
	sectionGPXUrl,
	fullGPXUrl,
	posts,
	description,
	global,
	finished,
	onToggleFullScreen,
}) => {
	return (
		<>
			<Link href={"/wanderungen/" + id.toLowerCase()}>
				<h3 id={id}>{title + (finished ? " (Abgeschlossen)" : " (Aktiv)")}</h3>
			</Link>
			<div
				style={{
					width: 405,
					maxWidth: "100%",
					height: 405,
					float: "right",
					marginBottom: 10,
					marginLeft: 10,
				}}
			>
				<MapWidget
					sectionGPXUrl={sectionGPXUrl}
					fullGPXUrl={fullGPXUrl}
					height={400}
					sectionLabel={id === "utah" ? "Geplante Wanderungen" : "Gewandert"}
					fullLabel={id === "utah" ? "Auto" : "To Do"}
					focusOn="full"
					global={global}
					onToggleFullScreen={onToggleFullScreen}
					startEndMarkers={"whole"}
				/>
			</div>
			<div>
				{description.map((paragraph, index) => (
					<p key={index}>{paragraph}&nbsp;</p>
				))}

				{posts && posts.length > 0 && (
					<div style={{ fontSize: 22, marginBottom: 10 }}>
						<b>Blog Posts:</b>
					</div>
				)}
				<ul>
					{posts
						.sort((a, b) => (a.frontMatter.date > b.frontMatter.date ? 1 : -1))
						.map((p) => (
							<li key={p.slug}>
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
				<div>
					<Link href={"/wanderungen/" + id}>Mehr Informationen...</Link>
				</div>
				<hr
					style={{
						color: "black",
						backgroundColor: "black",
						height: 2,
					}}
				/>
			</div>
		</>
	);
};

export default LongHikeSummary;
