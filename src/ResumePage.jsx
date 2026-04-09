import { useEffect, useMemo, useRef, useState } from "react";
import BackgroundVideo from "./components/BackgroundVideo";
import MobileBackButton from "./components/MobileBackButton";
import {
	PROJECTS_DATA,
	SKILLS_DATA,
	TIMELINE_EVENTS,
} from "./data/portfolioData";
import { usePersonaSfx } from "./lib/usePersonaSfx";
import { useSafeBackNavigation } from "./lib/useSafeBackNavigation";

const EVENT_ROWS = TIMELINE_EVENTS.map((event) => ({
	title: event.title,
	meta: `${event.category} - ${event.timetext}`,
	description: event.text,
}));

const SKILL_DETAILS = {
	React:
		"Builds responsive frontends with component architecture, reusable UI patterns, and state-driven interactions.",
	FastAPI:
		"Designs backend APIs with async endpoints, validation models, and clean service structure for realtime and standard workflows.",
	"Framer-Motion":
		"Implements motion systems for page transitions, interaction feedback, and polished UI choreography.",
	JavaScript:
		"Uses modern ES features for app logic, event handling, and browser-side architecture.",
	TypeScript:
		"Applies type-safe interfaces and models to improve maintainability and reduce runtime bugs.",
	"CSS / Tailwind":
		"Builds layered UI styling systems with utility-first speed and custom visual refinements.",
	HTML: "Creates semantic, accessible document structure with strong content hierarchy.",
	C: "Uses C for low-level programming fundamentals, memory-aware logic, and systems-oriented problem solving.",
	Python:
		"Builds scripts, automation flows, and backend utilities for rapid development and tooling.",
	"Git / GitHub":
		"Manages version control, branching workflows, and collaboration-ready repositories.",
	Linux:
		"Comfortable with shell tooling, system navigation, and developer workflows in Linux environments.",
	Figma:
		"Designs interface drafts, visual systems, and handoff-ready UI references.",
	"Adobe Premiere Pro":
		"Edits long-form and short-form video with pacing, transitions, and narrative flow in mind.",
	"Adobe After Effects":
		"Creates motion graphics and composited effects to enhance visual presentation.",
	Photoshop:
		"Handles visual asset cleanup, image compositing, and design-oriented graphic editing.",
};

const SKILL_ROWS = SKILLS_DATA.map((skill) => ({
	title: skill.title,
	meta: skill.description,
	description:
		SKILL_DETAILS[skill.title] ||
		`${skill.title} applied in practical ${skill.description.toLowerCase()} workflows.`,
}));

const PROJECT_ROWS = PROJECTS_DATA.map((project) => ({
	title: project.title,
	meta: "Open Link",
	description: project.description,
	href: project.liveUrl,
}));

const SECTIONS = [
	{
		id: "events",
		title: "Event List",
		subtitle: "Timeline With Dates",
		rows: EVENT_ROWS,
	},
	{
		id: "skills",
		title: "Skills",
		subtitle: "Technical And Creative Stack",
		rows: SKILL_ROWS,
	},
	{
		id: "projects",
		title: "Projects",
		subtitle: "Open Project Links",
		rows: PROJECT_ROWS,
	},
];

export default function ResumePage({
	src,
	mediaMuted = true,
	sfxMuted = true,
}) {
	const { goBack } = useSafeBackNavigation("/");
	const [activeSection, setActiveSection] = useState(0);
	const [activeRow, setActiveRow] = useState(0);
	const navContainerRef = useRef(null);
	const rowsContainerRef = useRef(null);
	const sectionButtonRefs = useRef([]);
	const rowButtonRefs = useRef([]);
	const { playHover, playConfirm, playBack } = usePersonaSfx({
		muted: sfxMuted,
	});

	const section = SECTIONS[activeSection];
	const rows = section.rows;
	const selectedRow = rows[activeRow] ?? rows[0];

	useEffect(() => {
		setActiveRow(0);
	}, [activeSection]);

	useEffect(() => {
		const target = sectionButtonRefs.current[activeSection];
		if (!target || !navContainerRef.current) return;
		target.scrollIntoView({
			block: "nearest",
			inline: "nearest",
			behavior: "smooth",
		});
	}, [activeSection]);

	useEffect(() => {
		const target = rowButtonRefs.current[activeRow];
		if (!target || !rowsContainerRef.current) return;
		target.scrollIntoView({
			block: "nearest",
			inline: "nearest",
			behavior: "smooth",
		});
	}, [activeSection, activeRow]);

	useEffect(() => {
		const onKeyDown = (e) => {
			const key = e.key.toLowerCase();

			if (e.key === "ArrowUp" || key === "w" || key === "z") {
				playHover();
				setActiveSection((value) => Math.max(0, value - 1));
			}

			if (e.key === "ArrowDown" || key === "s") {
				playHover();
				setActiveSection((value) => Math.min(SECTIONS.length - 1, value + 1));
			}

			if (e.key === "ArrowLeft" || key === "a" || key === "q") {
				playHover();
				setActiveRow((value) => Math.max(0, value - 1));
			}

			if (e.key === "ArrowRight" || key === "d") {
				playHover();
				setActiveRow((value) => Math.min(rows.length - 1, value + 1));
			}

			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				if (selectedRow?.href) {
					playConfirm();
					window.open(selectedRow.href, "_blank");
				}
			}

			if (e.key === "Escape" || e.key === "Backspace") {
				playBack();
				goBack();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [goBack, playConfirm, playHover, playBack, rows.length, selectedRow]);

	const helperText = useMemo(() => {
		if (section.id === "projects") {
			return "Select a project row and press Enter to open the link.";
		}
		if (section.id === "events") {
			return "Event timeline is unified here with dates and full details.";
		}
		return "Skills list comes from the original portfolio dataset.";
	}, [section.id]);

	return (
		<div id="menu-screen" className="resume-root">
			<BackgroundVideo src={src} muted={mediaMuted} />
			<MobileBackButton onBeforeBack={playBack} label="Back" />

			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&display=swap');

        .resume-root {
          position: relative;
          min-height: 100vh;
          height: 100dvh;
        }

        .resume-shell {
          position: relative;
          z-index: 10;
          min-height: 100%;
          padding: clamp(18px, 3vw, 36px);
          display: grid;
          grid-template-columns: minmax(290px, 400px) minmax(520px, 1fr);
          gap: clamp(16px, 2vw, 28px);
          align-items: start;
        }

        .resume-nav {
          max-height: calc(100vh - clamp(36px, 6vw, 72px));
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 8px;
        }

        .resume-nav::-webkit-scrollbar,
        .resume-rows::-webkit-scrollbar,
        .resume-panel::-webkit-scrollbar {
          width: 10px;
        }

        .resume-nav::-webkit-scrollbar-thumb,
        .resume-rows::-webkit-scrollbar-thumb,
        .resume-panel::-webkit-scrollbar-thumb {
          background: rgba(143, 245, 255, 0.72);
          border-radius: 12px;
        }

        .resume-nav-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(52px, 7vw, 84px);
          line-height: 0.9;
          letter-spacing: 2px;
          color: #f4fbff;
          margin: 0 0 12px 0;
          text-shadow: 0 2px 0 rgba(0, 0, 0, 0.28);
        }

        .resume-nav-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .resume-nav-card {
          width: 100%;
          border: 0;
          text-align: left;
          cursor: pointer;
          background: linear-gradient(135deg, rgba(15, 24, 96, 0.5), rgba(10, 16, 70, 0.53));
          color: #e9fbff;
          clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
          padding: 14px 16px;
          box-shadow: 0 8px 0 rgba(7, 12, 52, 0.78);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .resume-nav-card:hover {
          transform: translateX(4px);
        }

        .resume-nav-card.active {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(223, 246, 255, 0.98));
          color: #02133f;
          box-shadow: 12px 10px 0 #d63232, 0 0 0 3px rgba(255, 255, 255, 0.9);
          transform: translateX(8px) scale(1.01);
        }

        .resume-nav-card-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(28px, 3vw, 42px);
          line-height: 1;
          letter-spacing: 0.8px;
          white-space: normal;
          word-break: break-word;
        }

        .resume-nav-card-subtitle {
          margin-top: 7px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 21px;
          letter-spacing: 1px;
          opacity: 0.92;
        }

        .resume-panel {
          max-height: calc(100vh - clamp(36px, 6vw, 72px));
          overflow-y: auto;
          overflow-x: hidden;
          background: linear-gradient(180deg, rgba(14, 25, 100, 0.62), rgba(8, 16, 68, 0.62));
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(145, 240, 255, 0.2), 14px 14px 0 rgba(2, 7, 36, 0.6);
          padding: 18px;
        }

        .resume-panel-head {
          background: linear-gradient(90deg, #8ef5ff 0%, #d5fdff 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          padding: 14px 16px;
          color: #04153f;
          box-shadow: 10px 0 0 rgba(255, 94, 136, 0.88);
        }

        .resume-panel-title {
          margin: 0;
          font-family: 'Anton', sans-serif;
          font-size: clamp(34px, 4vw, 48px);
          line-height: 0.95;
          letter-spacing: 0.8px;
          white-space: normal;
        }

        .resume-panel-subtitle {
          margin: 8px 0 0 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          letter-spacing: 1px;
        }

        .resume-rows {
          margin-top: 14px;
          max-height: 46vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .resume-row {
          border: 0;
          width: 100%;
          text-align: left;
          background: rgba(8, 18, 72, 0.51);
          color: #ecfbff;
          clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(140, 239, 255, 0.2);
          padding: 10px 12px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
        }

        .resume-row:hover {
          transform: translateX(3px);
          background: rgba(13, 27, 98, 1);
        }

        .resume-row.focused {
          transform: translateX(6px);
          background: rgba(28, 53, 156, 1);
          box-shadow: inset 0 0 0 2px rgba(157, 246, 255, 0.95), 0 0 18px rgba(157, 246, 255, 0.3);
        }

        .resume-row-main {
          min-width: 0;
        }

        .resume-row-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(22px, 2.3vw, 30px);
          line-height: 1.05;
          letter-spacing: 0.3px;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .resume-row-meta {
          margin-top: 6px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 0.8px;
          opacity: 0.92;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .resume-row-cta {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 0.9px;
          padding: 6px 10px;
          background: #8df6ff;
          color: #00103a;
          clip-path: polygon(0 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
          white-space: nowrap;
        }

        .resume-detail {
          margin-top: 14px;
          background: rgba(5, 13, 57, 0.98);
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(145, 239, 255, 0.18);
          padding: 16px;
        }

        .resume-detail-title {
          margin: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 1.4px;
          color: #95f6ff;
        }

        .resume-detail-text {
          margin-top: 10px;
          font-family: 'Anton', sans-serif;
          font-size: clamp(18px, 2vw, 22px);
          line-height: 1.25;
          color: #edfaff;
          white-space: normal;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .resume-helper {
          margin-top: 10px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 1px;
          color: rgba(206, 250, 255, 0.9);
        }

        @media (max-width: 1180px) {
          .resume-shell {
            grid-template-columns: 1fr;
            padding-bottom: 16px;
          }

          .resume-nav,
          .resume-panel {
            max-height: none;
          }

          .resume-rows {
            max-height: 50vh;
          }
        }

        @media (max-width: 760px) {
          .resume-shell {
            padding: 86px 12px 12px 12px;
            gap: 12px;
          }

          .resume-nav-title {
            font-size: 56px;
          }

          .resume-nav-card {
            padding: 12px 12px;
            clip-path: polygon(0 0, 98% 0, 100% 100%, 2% 100%);
          }

          .resume-nav-card.active {
            transform: translateX(4px) scale(1.005);
            box-shadow: 8px 8px 0 #d63232, 0 0 0 2px rgba(255, 255, 255, 0.9);
          }

          .resume-nav-card-title {
            font-size: 30px;
          }

          .resume-nav-card-subtitle {
            font-size: 19px;
          }

          .resume-panel {
            padding: 12px;
            max-height: none;
          }

          .resume-panel-head {
            padding: 10px 12px;
          }

          .resume-panel-title {
            font-size: 36px;
          }

          .resume-panel-subtitle {
            font-size: 20px;
          }

          .resume-rows {
            margin-top: 10px;
            max-height: 42vh;
            gap: 8px;
            padding-right: 4px;
          }

          .resume-row {
            padding: 10px;
            gap: 8px;
            min-height: 60px;
          }

          .resume-row-title {
            font-size: 24px;
          }

          .resume-row-meta {
            font-size: 18px;
          }

          .resume-row-cta {
            font-size: 14px;
            padding: 5px 8px;
          }

          .resume-detail {
            margin-top: 10px;
            padding: 12px;
          }

          .resume-detail-title {
            font-size: 24px;
          }

          .resume-detail-text {
            font-size: 18px;
          }

          .resume-helper {
            font-size: 18px;
          }
        }

        @media (max-height: 760px) {
          .resume-shell {
            padding-top: 78px;
            gap: 10px;
          }

          .resume-nav-title {
            font-size: 48px;
          }

          .resume-nav-card {
            padding: 10px 12px;
          }

          .resume-nav-card-title {
            font-size: 26px;
          }

          .resume-panel {
            padding: 10px;
          }

          .resume-panel-title {
            font-size: 30px;
          }

          .resume-panel-subtitle {
            font-size: 18px;
          }

          .resume-rows {
            max-height: 36vh;
          }
        }
      `}</style>

			<div className="resume-shell">
				<aside
					className="resume-nav"
					aria-label="Resume sections"
					ref={navContainerRef}>
					<h2 className="resume-nav-title">Resume</h2>
					<div className="resume-nav-list">
						{SECTIONS.map((item, index) => (
							<button
								key={item.id}
								type="button"
								ref={(el) => {
									sectionButtonRefs.current[index] = el;
								}}
								className={`resume-nav-card${activeSection === index ? " active" : ""}`}
								onMouseEnter={() => {
									playHover();
									setActiveSection(index);
								}}
								onClick={() => {
									playConfirm();
									setActiveSection(index);
								}}>
								<div className="resume-nav-card-title">{item.title}</div>
								<div className="resume-nav-card-subtitle">{item.subtitle}</div>
							</button>
						))}
					</div>
				</aside>

				<section className="resume-panel" aria-live="polite">
					<header className="resume-panel-head">
						<h3 className="resume-panel-title">{section.title}</h3>
						<p className="resume-panel-subtitle">{section.subtitle}</p>
					</header>

					<div className="resume-rows" ref={rowsContainerRef}>
						{rows.map((row, index) => (
							<button
								key={`${section.id}-${row.title}-${index}`}
								type="button"
								ref={(el) => {
									rowButtonRefs.current[index] = el;
								}}
								className={`resume-row${activeRow === index ? " focused" : ""}`}
								onMouseEnter={() => {
									playHover();
									setActiveRow(index);
								}}
								onClick={() => {
									setActiveRow(index);
									if (row.href) {
										playConfirm();
										window.open(row.href, "_blank");
									}
								}}>
								<div className="resume-row-main">
									<div className="resume-row-title">{row.title}</div>
									<div className="resume-row-meta">{row.meta}</div>
								</div>
								{row.href ? <span className="resume-row-cta">OPEN</span> : null}
							</button>
						))}
					</div>

					<article className="resume-detail">
						<h4 className="resume-detail-title">Details</h4>
						<p className="resume-detail-text">
							{selectedRow?.description || "No details available."}
						</p>
					</article>

					<p className="resume-helper">{helperText}</p>
				</section>
			</div>
		</div>
	);
}
