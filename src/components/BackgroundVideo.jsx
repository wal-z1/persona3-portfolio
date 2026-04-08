import { useEffect, useRef } from "react";

export default function BackgroundVideo({
	src,
	muted = true,
	className = "",
	style,
}) {
	const videoRef = useRef(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		video.loop = true;
		video.playsInline = true;
		const tryPlay = () => {
			video.muted = true;
			video
				.play()
				.then(() => {
					if (!muted) {
						video.muted = false;
					}
				})
				.catch(() => {
					// Autoplay can be blocked on some browsers until user interaction.
				});
		};

		const ensureLoopingPlayback = () => {
			if (video.ended) {
				video.currentTime = 0;
				tryPlay();
				return;
			}
			if (video.paused && !document.hidden) {
				tryPlay();
			}
		};

		tryPlay();
		video.addEventListener("loadeddata", tryPlay);
		video.addEventListener("ended", ensureLoopingPlayback);
		video.addEventListener("pause", ensureLoopingPlayback);
		video.addEventListener("stalled", ensureLoopingPlayback);

		const onVisibilityChange = () => {
			if (!document.hidden) ensureLoopingPlayback();
		};

		const interval = window.setInterval(ensureLoopingPlayback, 2200);

		document.addEventListener("visibilitychange", onVisibilityChange);

		return () => {
			window.clearInterval(interval);
			video.removeEventListener("loadeddata", tryPlay);
			video.removeEventListener("ended", ensureLoopingPlayback);
			video.removeEventListener("pause", ensureLoopingPlayback);
			video.removeEventListener("stalled", ensureLoopingPlayback);
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, [src, muted]);

	return (
		<video
			ref={videoRef}
			src={src}
			autoPlay
			loop
			muted={muted}
			playsInline
			preload="auto"
			className={className}
			style={{ pointerEvents: "none", ...style }}
		/>
	);
}
