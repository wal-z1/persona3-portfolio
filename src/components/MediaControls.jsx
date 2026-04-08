export default function MediaControls({ muted, onToggleMuted }) {
	return (
		<button
			type="button"
			onClick={onToggleMuted}
			aria-pressed={!muted}
			aria-label={
				muted
					? "Unmute music and sound effects"
					: "Mute music and sound effects"
			}
			style={{
				position: "fixed",
				top: 18,
				right: 18,
				zIndex: 1000,
				border: "2px solid #ffffff",
				background: muted ? "rgba(15,18,28,0.75)" : "rgba(196,0,26,0.85)",
				color: "#fff",
				fontFamily: "'Bebas Neue', sans-serif",
				letterSpacing: "1.5px",
				fontSize: "16px",
				lineHeight: 1,
				padding: "10px 14px",
				clipPath: "polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)",
				cursor: "pointer",
				boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
			}}>
			{muted ? "SOUND: OFF" : "SOUND: ON"}
		</button>
	);
}
