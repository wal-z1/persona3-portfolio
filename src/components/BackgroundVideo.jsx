import { useEffect, useRef, useState } from "react";

export default function BackgroundVideo({
	src,
	muted = true,
	className = "",
	style,
	placeholderSrc = "/og-image.jpg",
}) {
	const videoRef = useRef(null);
	const [isVideoReady, setIsVideoReady] = useState(false);

	useEffect(() => {
		setIsVideoReady(false);
	}, [src]);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		video.loop = true;
		video.playsInline = true;
		const markReady = () => setIsVideoReady(true);
		const markLoading = () => setIsVideoReady(false);

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
		video.addEventListener("loadeddata", markReady);
		video.addEventListener("canplay", markReady);
		video.addEventListener("error", markLoading);
		video.addEventListener("stalled", markLoading);
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
			video.removeEventListener("loadeddata", markReady);
			video.removeEventListener("canplay", markReady);
			video.removeEventListener("error", markLoading);
			video.removeEventListener("stalled", markLoading);
			video.removeEventListener("loadeddata", tryPlay);
			video.removeEventListener("ended", ensureLoopingPlayback);
			video.removeEventListener("pause", ensureLoopingPlayback);
			video.removeEventListener("stalled", ensureLoopingPlayback);
			document.removeEventListener("visibilitychange", onVisibilityChange);
		};
	}, [src, muted]);

	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				pointerEvents: "none",
				overflow: "hidden",
			}}>
			<img
				src={placeholderSrc}
				alt=""
				aria-hidden="true"
				style={{
					position: "absolute",
					inset: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
					opacity: isVideoReady ? 0 : 1,
					transition: "opacity 300ms ease",
				}}
			/>
			<video
				ref={videoRef}
				src={src}
				autoPlay
				loop
				muted={muted}
				playsInline
				preload="auto"
				poster={placeholderSrc}
				className={className}
				style={{
					pointerEvents: "none",
					opacity: isVideoReady ? 1 : 0,
					transition: "opacity 300ms ease",
					...style,
				}}
			/>
		</div>
	);
}
