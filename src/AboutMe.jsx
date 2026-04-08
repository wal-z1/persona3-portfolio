import { useEffect } from "react";
import bgVideo from "./assets/main1.optimized.mp4";
import mainm from "./assets/mainm.jpeg";
import BackgroundVideo from "./components/BackgroundVideo";
import MobileBackButton from "./components/MobileBackButton";
import { PROFILE, SOCIAL_LINKS } from "./data/portfolioData";
import { usePersonaSfx } from "./lib/usePersonaSfx";
import { useSafeBackNavigation } from "./lib/useSafeBackNavigation";

const ABOUT_TEXT =
	"CS Student coding random projects and doing CTFs for fun. I make random things - check out the repos.";

const QUICK_FACTS = [
	"Computer Science student at ESI Algiers",
	"Builds web projects with React and FastAPI",
	"Active in CTF challenges and writeups",
	"Interested in realtime apps, tools, and graphics experiments",
];

const LINK_MAP = {
	GitHub: SOCIAL_LINKS.find((item) => item.label === "GitHub")?.href,
	LinkedIn: SOCIAL_LINKS.find((item) => item.label === "LinkedIn")?.href,
	picoCTF: SOCIAL_LINKS.find((item) => item.label === "picoCTF")?.href,
	HTB: SOCIAL_LINKS.find((item) => item.label === "HackTheBox")?.href,
};

export default function AboutMe({ mediaMuted = true, sfxMuted = true }) {
	const { goBack } = useSafeBackNavigation("/");
	const { playHover, playConfirm, playBack } = usePersonaSfx({
		muted: sfxMuted,
	});

	useEffect(() => {
		const onKeyDown = (e) => {
			const key = e.key.toLowerCase();

			if (e.key === "Escape" || e.key === "Backspace" || key === "a") {
				playBack();
				goBack();
			}

			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				playConfirm();
				if (LINK_MAP.GitHub) {
					window.open(LINK_MAP.GitHub, "_blank");
				}
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [goBack, playConfirm, playBack]);

	return (
		<div id="menu-screen" className="about-root">
			<BackgroundVideo src={bgVideo} muted={mediaMuted} />
			<MobileBackButton onBeforeBack={playBack} label="Back" />

			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Montserrat:wght@300;400;500&display=swap');

        .about-root {
          position: relative;
          min-height: 100vh;
          height: 100dvh;
          overflow: hidden;
        }

        .about-shell {
          position: relative;
          z-index: 10;
          height: 100%;
          padding: clamp(18px, 3vw, 36px);
          box-sizing: border-box;
          display: grid;
          grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
          gap: clamp(16px, 2vw, 28px);
          align-items: start;
        }

        .about-menu {
          background: linear-gradient(165deg, rgba(16, 22, 85, 0.95), rgba(10, 15, 64, 0.98));
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: 0 10px 0 rgba(6, 10, 44, 0.75), inset 0 0 0 1px rgba(154, 243, 255, 0.22);
          padding: 16px;
          min-height: 0;
          min-width: 0;
        }

        .about-menu-title {
          margin: 0;
          font-family: 'Anton', sans-serif;
          font-size: clamp(32px, 4vw, 54px);
          line-height: 0.95;
          letter-spacing: 1px;
          color: #e9fbff;
        }

        .about-menu-sub {
          margin-top: 8px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          letter-spacing: 1.2px;
          color: rgba(180, 246, 255, 0.96);
        }

        .about-menu-hint {
          margin-top: 14px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1px;
          color: rgba(214, 251, 255, 0.88);
        }

        .about-panel {
          position: relative;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(240, 246, 252, 0.97));
          color: #0c1636;
          clip-path: none;
          box-shadow: 14px 12px 0 rgba(214, 50, 50, 0.82), 0 0 0 2px rgba(255, 255, 255, 0.7);
          padding: clamp(16px, 2vw, 26px) clamp(22px, 2.2vw, 30px) clamp(16px, 2vw, 26px) clamp(16px, 2vw, 26px);
          height: 100%;
          min-height: 0;
          min-width: 0;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          cursor: text;
          user-select: text;
          isolation: isolate;
        }

        .about-panel::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 18px;
          background: linear-gradient(180deg, rgba(236, 242, 251, 0.95), rgba(220, 229, 245, 0.95));
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
          pointer-events: none;
          z-index: 1;
        }

        .about-panel::before {
          content: "";
          position: absolute;
          top: 0;
          right: 14px;
          width: 2px;
          height: 100%;
          background: rgba(24, 42, 98, 0.15);
          pointer-events: none;
          z-index: 1;
        }

        .about-panel::-webkit-scrollbar {
          width: 10px;
        }

        .about-panel::-webkit-scrollbar-thumb {
          background: rgba(17, 34, 88, 0.42);
          border-radius: 12px;
        }

        .about-hero {
          display: grid;
          grid-template-columns: minmax(180px, 220px) minmax(0, 1fr);
          gap: 16px;
          align-items: start;
        }

        .about-hero > div,
        .about-links,
        .about-facts {
          min-width: 0;
          position: relative;
          z-index: 2;
        }

        .about-portrait {
          width: 100%;
          max-width: 220px;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          box-shadow: 10px 8px 0 rgba(15, 31, 89, 0.6);
        }

        .about-name {
          margin: 0;
          font-family: 'Anton', sans-serif;
          font-size: clamp(34px, 4vw, 52px);
          line-height: 0.95;
          letter-spacing: 1px;
          color: #07133b;
          white-space: normal;
          word-break: break-word;
        }

        .about-tagline {
          margin-top: 8px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 1px;
          color: #1a327c;
        }

        .about-text {
          margin-top: 12px;
          font-family: 'Montserrat', sans-serif;
          font-size: 17px;
          line-height: 1.6;
          color: #0f1f4c;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .about-section-title {
          margin: 18px 0 10px 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 1.1px;
          color: #0c1b4a;
        }

        .about-facts {
          margin: 0;
          padding-left: 18px;
          display: grid;
          gap: 8px;
        }

        .about-facts li {
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #122759;
        }

        .about-links {
          margin-top: 12px;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .about-link {
          border: 0;
          cursor: pointer;
          background: #0f1d53;
          color: #ecfcff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 0.9px;
          padding: 8px 12px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
          transition: transform 0.16s ease, background 0.16s ease;
        }

        .about-link:hover {
          transform: translateY(-1px);
          background: #d63232;
        }

        .about-panel:focus-within {
          box-shadow: 14px 12px 0 rgba(214, 50, 50, 0.82), 0 0 0 2px rgba(149, 246, 255, 0.9);
        }

        @media (max-width: 1150px) {
          .about-root {
            height: auto;
            overflow: auto;
          }

          .about-shell {
            grid-template-columns: 1fr;
            padding-bottom: 18px;
            height: auto;
          }

          .about-panel {
            max-height: none;
            height: auto;
          }

          .about-hero {
            grid-template-columns: 1fr;
          }

          .about-portrait {
            max-width: 260px;
          }

        }

        @media (max-width: 760px) {
          .about-shell {
            padding: 86px 12px 12px 12px;
            gap: 12px;
          }

          .about-menu {
            padding: 12px;
          }

          .about-menu-title {
            font-size: 38px;
          }

          .about-menu-sub {
            font-size: 20px;
          }

          .about-menu-hint {
            font-size: 16px;
          }

          .about-panel {
            padding: 12px;
            max-height: none;
          }

          .about-hero {
            gap: 10px;
          }

          .about-portrait {
            max-width: 180px;
          }

          .about-name {
            font-size: 34px;
          }

          .about-tagline {
            font-size: 22px;
          }

          .about-text,
          .about-facts li {
            font-size: 15px;
          }

          .about-section-title {
            font-size: 24px;
          }

          .about-links {
            gap: 8px;
          }

          .about-link {
            font-size: 17px;
            padding: 8px 10px;
          }
        }

        @media (max-height: 760px) {
          .about-shell {
            padding-top: 80px;
            gap: 10px;
          }

          .about-menu {
            padding: 12px;
          }

          .about-menu-title {
            font-size: 36px;
          }

          .about-menu-sub {
            font-size: 20px;
          }

          .about-panel {
            padding: 12px 18px 12px 12px;
          }

          .about-section-title {
            margin-top: 12px;
          }
        }
      `}</style>

			<div className="about-shell">
				<aside className="about-menu">
					<h2 className="about-menu-title">About</h2>
					<div className="about-menu-sub">Profile Dossier</div>
					<div className="about-menu-hint">
						Enter opens GitHub, Esc returns back.
					</div>
				</aside>

				<section className="about-panel">
					<div className="about-hero">
						<img
							className="about-portrait"
							src={mainm}
							alt="Profile portrait"
						/>
						<div>
							<h1 className="about-name">{PROFILE.name}</h1>
							<div className="about-tagline">{PROFILE.tagline}</div>
							<p className="about-text">{ABOUT_TEXT}</p>
						</div>
					</div>

					<h3 className="about-section-title">What I Work On</h3>
					<ul className="about-facts">
						{QUICK_FACTS.map((fact) => (
							<li key={fact}>{fact}</li>
						))}
					</ul>

					<h3 className="about-section-title">Links</h3>
					<div className="about-links">
						{Object.entries(LINK_MAP)
							.filter(([, href]) => Boolean(href))
							.map(([label, href]) => (
								<button
									key={label}
									type="button"
									className="about-link"
									onMouseEnter={playHover}
									onClick={() => {
										playConfirm();
										window.open(href, "_blank");
									}}>
									{label}
								</button>
							))}
					</div>
				</section>
			</div>
		</div>
	);
}
