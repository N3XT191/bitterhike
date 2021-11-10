/* eslint-disable @next/next/no-css-tags */
import "../styles/globals.css";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import { Container } from "react-bootstrap";
import Script from "next/script";

function MyApp({ Component, pageProps }: { Component: any; pageProps: any }) {
	return (
		<>
			<Container style={{ maxWidth: 900 }}>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', 'G-NLCK29G8PX', 'auto');
          ga('send', 'pageview');
        `}
				</Script>
				<Head>
					<meta name="apple-mobile-web-app-title" content="BitterHike" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="black-translucent"
					/>
					<meta name="application-name" content="BitterHike" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="description" content="BitterHike - Marc's Wander-Blog" />
					<meta name="msapplication-TileColor" content="#2B5797" />
					<meta name="msapplication-tap-highlight" content="no" />
					<meta name="theme-color" content="#000000" />
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/icons2/180x180.png"
					/>
					<link
						rel="icon"
						type="image/x-icon"
						href="/icons2/favicon-32x32.ico"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/icons2/favicon-32x32.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="96x96"
						href="/icons2/favicon-96x96.png"
					/>
					<link rel="manifest" href="/manifest.json" />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
					/>
					<title>BitterHike - Marc's Wander-Blog</title>
				</Head>
				<div>
					<Nav />
					<main>
						<Component {...pageProps} />
					</main>
					<Footer />
				</div>
			</Container>
		</>
	);
}

export default MyApp;
