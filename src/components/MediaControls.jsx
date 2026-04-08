export default function MediaControls({ muted, onToggleMuted }) {
	return (
		<>
			<button
				type="button"
				onClick={onToggleMuted}
				className="mc-toggle"
				aria-pressed={!muted}
				aria-label={
					muted
						? "Unmute music and sound effects"
						: "Mute music and sound effects"
				}
				style={{
					background: muted ? "rgba(15,18,28,0.75)" : "rgba(196,0,26,0.85)",
				}}>
				{muted ? "SOUND: OFF" : "SOUND: ON"}
			</button>
			<style>{`
        .mc-toggle {
          position: fixed;
          top: calc(env(safe-area-inset-top, 0px) + 12px);
          right: calc(env(safe-area-inset-right, 0px) + 12px);
          z-index: 1000;
          border: 2px solid #ffffff;
          color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1.5px;
          font-size: 16px;
          line-height: 1;
          padding: 10px 14px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(0,0,0,0.35);
        }

        @media (max-width: 900px) {
          .mc-toggle {
            font-size: 14px;
            letter-spacing: 1.2px;
            padding: 8px 10px;
            top: calc(env(safe-area-inset-top, 0px) + 10px);
            right: calc(env(safe-area-inset-right, 0px) + 10px);
          }
        }

        @media (max-height: 680px) {
          .mc-toggle {
            font-size: 12px;
            padding: 6px 8px;
            border-width: 1px;
          }
        }
      `}</style>
		</>
	);
}
