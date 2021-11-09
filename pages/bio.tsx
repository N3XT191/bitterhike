import Link from "next/link";
import React from "react";
import Img from "./blog/Img";

const Bio = () => {
	return (
		<div className="mt-3">
			<p className="display-4 text-center">Marc Bitterli</p>
			<img
				style={{
					objectFit: "cover",
					width: "100%",
					maxHeight: 400,
					marginBottom: 20,
				}}
				src="/marc/6.jpeg"
			/>
			<p className="text-center">
				Ich bin Marc. Ich gehe ab und zu wandern. Manchmal ganz alleine,
				manchmal mit Chiara, Freunden oder Familie. Oft in den Alpen, manchmal
				im Flachland. Teils von Hütte zu Hütte oder voll ausgerüstet mit Zelt,
				teils mit kleinem Gepäck nur für einen Tag.
			</p>

			<p className="text-center">
				In diesem Blog schreibe ich über meine Wander-Erlebnisse. Bei Fragen bin
				ich auf <a href="mailto:marc@bitter.li">marc@bitter.li</a> erreichbar.
			</p>
			<p className="text-center">
				<Link href={"/marc-pics"}>
					<div
						style={{
							marginBottom: 10,
							color: "#0d6efd",
							fontSize: 20,
							cursor: "pointer",
							textDecoration: "underline",
						}}
					>
						Mehr Fotos
					</div>
				</Link>
			</p>
		</div>
	);
};
export default Bio;
