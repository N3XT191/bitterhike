import Link from "next/link";
import { Container, Navbar, Nav } from "react-bootstrap";
import useIsMobile from "./isMobile";

const Header = () => {
	return (
		<>
			<Navbar expand="lg" style={{ marginBottom: 20 }}>
				<Container fluid style={{ padding: 0 }}>
					<Link href="/">
						<img
							src="/logo.jpg"
							width={150}
							height={40}
							style={{ marginRight: 30, cursor: "pointer" }}
						/>
					</Link>
					{useIsMobile() ? undefined : (
						<Navbar.Brand style={{ fontSize: 40 }} href="/">
							BitterHike
						</Navbar.Brand>
					)}
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav" style={{ textAlign: "right" }}>
						<Nav
							style={{ display: "flex", justifyContent: "end", width: "100%" }}
						>
							<Link href="/wanderungen" passHref>
								<div
									style={{
										cursor: "pointer",
										marginTop: 10,
										fontSize: 20,
									}}
								>
									Wanderungen
								</div>
							</Link>
							<Link href="/bio" passHref>
								<div
									style={{
										cursor: "pointer",
										marginLeft: 20,
										marginTop: 10,
										fontSize: 20,
									}}
								>
									Über Mich
								</div>
							</Link>
							<Link href="/live" passHref>
								<div
									style={{
										cursor: "pointer",
										marginLeft: 20,
										marginTop: 10,
										fontSize: 20,
									}}
								>
									Live
								</div>
							</Link>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<div
				style={{
					width: "100%",
					height: "1px",
					backgroundColor: "black",
					marginTop: useIsMobile() ? "-20px" : "-40px",
					marginBottom: "20px",
				}}
			/>
		</>
	);
};
export default Header;
