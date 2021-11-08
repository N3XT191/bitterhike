import Link from "next/link";
import React from "react";
import Img from "./blog/Img";

const Bio = () => {
	return (
		<div className="mt-3">
			<p className="display-4 text-center">Marc Bitterli</p>
			<Img src="/marc/6.jpeg" d="" />
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
