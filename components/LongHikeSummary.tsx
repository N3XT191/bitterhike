import Link from "next/link";
import MapWidget from "./MapWidget";

interface Props {
	id: string;
	title: string;
	sectionGPXUrl: string;
	fullGPXUrl: string;
	posts: any[];
	description: string[];
	focus?: boolean;
}

const LongHikeSummary = ({
	id,
	title,
	sectionGPXUrl,
	fullGPXUrl,
	posts,
	description,
	focus,
}: Props) => {
	return (
		<>
			<h3 id={id}>{title}</h3>
			<div
				style={{
					width: 450,
					maxWidth: "100%",
					height: 300,
					float: "right",
					marginBottom: 10,
					marginLeft: 10,
				}}
			>
				<MapWidget
					sectionGPXUrl={sectionGPXUrl}
					fullGPXUrl={fullGPXUrl}
					height={295}
					sectionLabel="Gewandert"
					fullLabel="Ganze Route"
					focusOn={focus ? "full" : undefined}
				/>
			</div>
			<div>
				{description.map((paragraph) => (
					<p>{paragraph}</p>
				))}
				<ul>
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
				</ul>
			</div>
		</>
	);
};

export default LongHikeSummary;
