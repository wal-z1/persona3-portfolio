import { useEffect } from "react";
import BackgroundVideo from "./components/BackgroundVideo";
import MobileBackButton from "./components/MobileBackButton";
import { usePersonaSfx } from "./lib/usePersonaSfx";
import { useSafeBackNavigation } from "./lib/useSafeBackNavigation";

export default function VideoPage({ src, mediaMuted = true, sfxMuted = true }) {
	const { goBack } = useSafeBackNavigation("/");
	const { playBack } = usePersonaSfx({ muted: sfxMuted });

	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "ArrowLeft") {
				playBack();
				goBack();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [goBack, playBack]);

	return (
		<div id="menu-screen">
			<BackgroundVideo src={src} muted={mediaMuted} />
			<MobileBackButton onBeforeBack={playBack} label="Back" />
		</div>
	);
}
