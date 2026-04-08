import { useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import menuVideo from "./assets/Mainn.optimized.mp4";
import main2 from "./assets/main2.optimized.mp4";
import P3Menu from "./P3Menu";
import ResumePage from "./ResumePage";
import PageTransition from "./PageTransition";
import Socials from "./Socials";
import AboutMe from "./AboutMe";
import BackgroundVideo from "./components/BackgroundVideo";
import MediaControls from "./components/MediaControls";
import "./App.css";

function MenuScreen({ mediaMuted, sfxMuted }) {
	const navigate = useNavigate();
	return (
		<div id="menu-screen">
			<BackgroundVideo src={menuVideo} muted={mediaMuted} />
			<P3Menu onNavigate={(page) => navigate(`/${page}`)} sfxMuted={sfxMuted} />
		</div>
	);
}

function AnimatedRoutes({ mediaMuted, sfxMuted }) {
	const location = useLocation();
	return (
		<AnimatePresence mode="wait">
			<Routes location={location} key={location.pathname}>
				<Route
					path="/"
					element={
						<PageTransition>
							<MenuScreen mediaMuted={mediaMuted} sfxMuted={sfxMuted} />
						</PageTransition>
					}
				/>
				<Route
					path="/about"
					element={
						<PageTransition variant="about">
							<AboutMe mediaMuted={mediaMuted} sfxMuted={sfxMuted} />
						</PageTransition>
					}
				/>
				<Route
					path="/resume"
					element={
						<PageTransition>
							<ResumePage
								src={main2}
								mediaMuted={mediaMuted}
								sfxMuted={sfxMuted}
							/>
						</PageTransition>
					}
				/>
				<Route
					path="/socials"
					element={
						<PageTransition variant="socials">
							<Socials mediaMuted={mediaMuted} sfxMuted={sfxMuted} />
						</PageTransition>
					}
				/>
			</Routes>
		</AnimatePresence>
	);
}

export default function App() {
	const [mediaMuted, setMediaMuted] = useState(false);

	return (
		<>
			<MediaControls
				muted={mediaMuted}
				onToggleMuted={() => setMediaMuted((value) => !value)}
			/>
			<AnimatedRoutes mediaMuted={mediaMuted} sfxMuted={mediaMuted} />
		</>
	);
}
