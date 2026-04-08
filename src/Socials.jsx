import { useState, useEffect, useRef } from "react";
import char1 from "./assets/char1.png";
import char2 from "./assets/char2.png";
import char3 from "./assets/char3.png";
import bgVideo from "./assets/main3.optimized.mp4";
import newsign from "./assets/newsign.png";
import icon1 from "./assets/icon1.png";
import icon2 from "./assets/icon2.png";
import icon3 from "./assets/icon3.png";
import BackgroundVideo from "./components/BackgroundVideo";
import MobileBackButton from "./components/MobileBackButton";
import { ALL_LINKS, PROJECTS_DATA, SOCIAL_LINKS } from "./data/portfolioData";
import { usePersonaSfx } from "./lib/usePersonaSfx";
import { useSafeBackNavigation } from "./lib/useSafeBackNavigation";

const CHARS = [char1, char2, char3];

const ROLES = [
	{
		text: "LEADER",
		color: "#e8c100",
		bg: "rgba(232,193,0,0.12)",
		border: "rgba(232,193,0,0.5)",
	},
	{
		text: "PARTY",
		color: "#4a8fff",
		bg: "rgba(74,143,255,0.12)",
		border: "rgba(74,143,255,0.5)",
	},
	{
		text: "PARTY",
		color: "#4a8fff",
		bg: "rgba(74,143,255,0.12)",
		border: "rgba(74,143,255,0.5)",
	},
];

const ITEMS = [
	{
		id: "profiles",
		label: "SOCIAL PROFILES",
		handle: "@wal-z1",
		href: SOCIAL_LINKS[0].href,
		icon: "DEV",
		barIcon: icon1,
		entries: SOCIAL_LINKS,
		counts: SOCIAL_LINKS.map(() => "OPEN"),
		newBars: [0, 1],
		stats: [
			{ tag: "ALL", value: String(SOCIAL_LINKS.length), color: "#9147ff" },
			{ tag: "TYPE", value: "SOCIAL", color: "#bf94ff" },
		],
	},
	{
		id: "projects",
		label: "PROJECT LINKS",
		handle: "@projects",
		href: PROJECTS_DATA[0].liveUrl,
		icon: "PRJ",
		barIcon: icon2,
		entries: PROJECTS_DATA.map((item) => ({
			label: item.title,
			href: item.liveUrl,
		})),
		counts: PROJECTS_DATA.map(() => "OPEN"),
		newBars: [0, 3, 5],
		stats: [
			{ tag: "ALL", value: String(PROJECTS_DATA.length), color: "#e1306c" },
			{ tag: "TYPE", value: "PROJECT", color: "#f77737" },
		],
	},
	{
		id: "all",
		label: "ALL LINKS",
		handle: "@portfolio",
		href: ALL_LINKS[0].href,
		icon: "LNK",
		barIcon: icon3,
		entries: ALL_LINKS,
		counts: ALL_LINKS.map(() => "OPEN"),
		newBars: [0, 2, 4],
		stats: [
			{ tag: "ALL", value: String(ALL_LINKS.length), color: "#00f2ea" },
			{ tag: "TYPE", value: "MIXED", color: "#ff0050" },
		],
	},
].map((item) => ({
	...item,
	links: item.entries.map((entry) => entry.href),
	bars: item.entries.length,
}));

export default function Socials({ mediaMuted = true, sfxMuted = true }) {
	const [active, setActive] = useState(0);
	const [mounted, setMounted] = useState(false);
	const [activeInfoBar, setActiveInfoBar] = useState(0);
	const [focus, setFocus] = useState("left"); // "left" | "right"
	const { goBack } = useSafeBackNavigation("/");
	const { playHover, playConfirm, playBack, playInvalid } = usePersonaSfx({
		muted: sfxMuted,
	});
	const infoRowRefs = useRef([]);

	useEffect(() => {
		const t = setTimeout(() => setMounted(true), 60);
		return () => clearTimeout(t);
	}, []);

	useEffect(() => {
		setActiveInfoBar(0);
		infoRowRefs.current = [];
	}, [active]);

	useEffect(() => {
		const onKey = (e) => {
			const key = e.key.toLowerCase();
			const barCount = ITEMS[active].bars;

			if (focus === "left") {
				if (e.key === "ArrowUp" || key === "w") {
					playHover();
					setActive((i) => Math.max(0, i - 1));
					setActiveInfoBar(0);
				}
				if (e.key === "ArrowDown" || key === "s") {
					playHover();
					setActive((i) => Math.min(ITEMS.length - 1, i + 1));
					setActiveInfoBar(0);
				}
				if (e.key === "ArrowRight" || key === "d") {
					playHover();
					setFocus("right");
					setActiveInfoBar(0);
				}
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					playHover();
					setFocus("right");
					setActiveInfoBar(0);
				}
			} else {
				if (e.key === "ArrowUp" || key === "w") {
					playHover();
					setActiveInfoBar((i) => Math.max(0, i - 1));
				}
				if (e.key === "ArrowDown" || key === "s") {
					playHover();
					setActiveInfoBar((i) => Math.min(barCount - 1, i + 1));
				}
				if (e.key === "ArrowLeft" || key === "a") {
					playHover();
					setFocus("left");
				}
				if (e.key === "ArrowRight" || key === "d") {
					playInvalid();
				}
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					if (!ITEMS[active].links[activeInfoBar]) {
						playInvalid();
						return;
					}
					playConfirm();
					const target = ITEMS[active].links[activeInfoBar];
					const href = /^(https?:\/\/|mailto:)/.test(target)
						? target
						: `https://${target}`;
					window.open(href, "_blank");
				}
			}
			if (
				((e.key === "ArrowLeft" || key === "a") && focus === "left") ||
				e.key === "Escape" ||
				e.key === "Backspace"
			) {
				playBack();
				goBack();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		active,
		goBack,
		focus,
		activeInfoBar,
		playHover,
		playConfirm,
		playBack,
		playInvalid,
	]);

	useEffect(() => {
		if (focus !== "right") return;
		const row = infoRowRefs.current[activeInfoBar];
		if (!row) return;
		row.scrollIntoView({ block: "nearest", behavior: "smooth" });
	}, [focus, activeInfoBar, active]);

	return (
		<div id="menu-screen">
			<BackgroundVideo src={bgVideo} muted={mediaMuted} />
			<MobileBackButton onBeforeBack={playBack} label="Back" />
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,400;0,700;1,700&display=swap');

        .sc-root {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 16px;
          padding-left: clamp(10px, 2vw, 22px);
          padding-right: clamp(280px, 30vw, 520px);
          padding-top: 72px;
          padding-bottom: 132px;
        }

        /* ── Each bar ── */
        .sc-bar {
          position: relative;
          width: min(100%, clamp(560px, 56vw, 840px));
          height: 74px;
          transition: height 0.3s cubic-bezier(0.22,1,0.36,1);
          background: #111;
          cursor: pointer;
          pointer-events: all;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: 0 6px 24px rgba(0,0,0,0.65);
          z-index: 1;
        }

        /* wrapper holds both the red underlay and the bar */
        .sc-bar-outer {
          position: relative;
          flex-shrink: 0;
          margin-bottom: 8px;
          transform: translateX(-100%);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-bar-outer.active .sc-bar     { height: 102px; }
        .sc-bar-outer.active .sc-bar-red { height: 102px; }
        .sc-bar-outer.mounted { transform: translateX(0); }
        .sc-bar-outer:nth-child(1) { transition-delay: 0ms; }
        .sc-bar-outer:nth-child(2) { transition-delay: 80ms; }
        .sc-bar-outer:nth-child(3) { transition-delay: 160ms; }

        /* red underlay — peeks out below the bar when active */
        .sc-bar-red {
          position: absolute;
          top: 0; left: 0;
          width: min(100%, clamp(560px, 56vw, 840px));
          height: 74px;
          background: #c4001a;
          clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
          transform: translateY(-7px);
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }
        .sc-bar-outer.active .sc-bar-red { opacity: 1; }

        /* white fill — skewed parallelogram on the right 25% */
        .sc-bar-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          background: #ffffff;
          clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
          transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }
        .sc-bar-outer.active .sc-bar-fill {
          clip-path: polygon(22% 0, 100% 0, calc(100% - 14px) 100%, calc(22% + 138px) 100%);
        }

        /* shade on the left edge of the white fill */
        .sc-bar-shade {
          position: absolute;
          top: 0; bottom: 0;
          left: 73%;
          width: 6%;
          background: linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 100%);
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .sc-bar-outer.active .sc-bar-shade { opacity: 1; }

        /* bottom shadow line under each bar */
        .sc-bar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
          z-index: 10;
          pointer-events: none;
        }

        /* content layout inside each bar */
        .sc-bar-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
          padding: 0 18px 0 18px;
        }

        /* left: role label */
        .sc-role {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          font-family: 'Anton', sans-serif;
          font-size: 50px;
          letter-spacing: -2px;
          color: #ffffff;
          transform: rotate(-30deg);
          user-select: none;
          line-height: 1;
          padding: 0 16px 0 8px;
        }

        /* left: icon + name centered in remaining space */
        .sc-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          gap: 3px;
          padding-left: clamp(62px, 7vw, 108px);
        }
        .sc-main-top {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          min-width: 0;
          justify-content: flex-start;
        }

        .sc-icon {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          width: 32px;
          text-align: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.15);
          transition: color 0.2s ease;
          user-select: none;
        }
        .sc-bar-outer.active .sc-icon { color: rgba(255,255,255,0.25); }

        .sc-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          letter-spacing: 3px;
          line-height: 1;
          color: rgba(255,255,255,0.98);
          text-shadow: 0 1px 6px rgba(0,0,0,0.42);
          transition: color 0.2s ease;
          user-select: none;
          white-space: nowrap;
          min-width: 0;
        }
        .sc-bar-outer.active .sc-label { color: #111111; }

        /* lb/rb nav row */
        @keyframes sc-arrow-left {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50%       { transform: translateX(-5px); opacity: 0.4; }
        }
        @keyframes sc-arrow-right {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50%       { transform: translateX(5px); opacity: 0.4; }
        }
        .sc-nav-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          color: #111;
          border: 1px solid rgba(0,0,0,0.35);
          padding: 1px 7px;
          line-height: 1.5;
          user-select: none;
        }
        .sc-nav-arrow {
          font-size: 12px;
          color: #c4001a;
          display: inline-block;
        }
        .sc-nav-arrow.left  { animation: sc-arrow-left  0.8s ease-in-out infinite; }
        .sc-nav-arrow.right { animation: sc-arrow-right 0.8s ease-in-out infinite; }

        /* right: stats group */
        .sc-stats {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 14px;
          flex-shrink: 0;
        }

        .sc-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .sc-stat-top {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .sc-stat-tag {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 9px;
          letter-spacing: 1.5px;
          padding: 1px 4px;
          border-width: 1px;
          border-style: solid;
          line-height: 1.4;
          user-select: none;
        }

        .sc-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          font-style: italic;
          line-height: 1;
          color: #ffffff;
          letter-spacing: 1px;
          user-select: none;
          transition: color 0.2s ease;
        }
        .sc-bar-outer.active .sc-stat-num { color: #111111; }

        .sc-stat-bars {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-top: 2px;
        }
        .sc-stat-bar-color {
          height: 3px;
          width: 100%;
        }
        .sc-stat-bar-black {
          height: 2px;
          width: 100%;
          background: #000;
        }

        /* character portrait */
        .sc-char {
          position: absolute;
          top: 0;
          left: 72px;
          height: 100%;
          width: auto;
          max-width: 138px;
          object-fit: cover;
          object-position: top;
          pointer-events: none;
          z-index: 1;
          opacity: 0.78;
          clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
        }

        /* right-side nav bar */
        @keyframes sc-right-nav-pop {
          0%   { opacity: 0; transform: scale(0.55) translateY(-10px); }
          65%  { opacity: 1; transform: scale(1.1) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sc-right-nav {
          position: fixed;
          top: 40px;
          right: 40px;
          display: flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
          z-index: 55;
          background: rgba(8, 14, 42, 0.82);
          padding: 4px 12px;
          border-radius: 8px;
          box-shadow: inset 0 0 0 1px rgba(145,245,255,0.3);
          animation: sc-right-nav-pop 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sc-right-nav .sc-nav-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 52px;
          letter-spacing: 3px;
          line-height: 1;
          user-select: none;
          color: #fff;
          -webkit-text-stroke: 2px #000;
          paint-order: stroke fill;
          background: none;
          border: none;
          padding: 0 6px;
        }
        .sc-right-nav .sc-nav-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 3px;
          line-height: 1;
          user-select: none;
          color: #e9fbff;
          text-shadow: 0 1px 0 rgba(0,0,0,0.55);
          padding: 0 8px;
        }
        .sc-right-nav .sc-nav-arrow {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: #c4001a;
          display: inline-block;
          user-select: none;
        }
        .sc-right-nav .sc-nav-arrow.left  { animation: sc-arrow-left  0.8s ease-in-out infinite; }
        .sc-right-nav .sc-nav-arrow.right { animation: sc-arrow-right 0.8s ease-in-out infinite; }

        .sc-mobile-cats {
          display: none;
        }

        /* info bar under nav */
        @keyframes sc-infobar-in {
          0%   { opacity: 0; transform: translateX(40px); }
          60%  { opacity: 1; transform: translateX(-4px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .sc-info-panel {
          position: fixed;
          top: 128px;
          bottom: 132px;
          right: 16px;
          width: min(36vw, 560px);
          max-height: none;
          overflow-y: auto;
          overflow-x: visible;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
          z-index: 51;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 10px 10px 10px 42px;
          clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 14px);
          background: linear-gradient(180deg, rgba(12, 18, 56, 0.92), rgba(5, 9, 28, 0.96));
          box-shadow:
            0 14px 0 rgba(2, 6, 22, 0.92),
            inset 0 0 0 1px rgba(145,245,255,0.34),
            inset 0 -12px 0 rgba(0, 0, 0, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .sc-info-panel::-webkit-scrollbar {
          width: 8px;
        }
        .sc-info-panel::-webkit-scrollbar-thumb {
          background: rgba(145,245,255,0.72);
          border-radius: 10px;
        }

        .sc-info-panel::before {
          content: '';
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          height: 10px;
          margin: -10px 0 2px;
          background: linear-gradient(90deg, rgba(196, 0, 26, 0.95) 0%, rgba(196, 0, 26, 0.55) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 12px 100%);
          pointer-events: none;
        }

        .sc-info-bar-wrap {
          position: relative;
          width: 100%;
          min-height: 62px;
          background: linear-gradient(180deg, rgba(18, 27, 74, 0.9), rgba(10, 16, 48, 0.9));
          pointer-events: all;
          cursor: pointer;
          z-index: 1;
          padding: 2px;
          clip-path: polygon(8px 0, 100% 0, 100% 100%, 0 100%, 0 10px);
          box-shadow: inset 0 0 0 1px rgba(145,245,255,0.22);
          animation: sc-infobar-in 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sc-info-bar-wrap:hover {
          background: rgba(10,15,40,0.96);
          padding: 2px;
          clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
          box-shadow: 0 0 16px rgba(123,232,255,0.35);
        }
        .sc-info-bar-wrap.selected {
          background: linear-gradient(180deg, rgba(10, 11, 16, 0.98), rgba(24, 24, 28, 0.98));
          padding: 3px;
          clip-path: polygon(10px 0, 100% 0, 100% 100%, 0 100%, 0 12px);
          box-shadow:
            0 0 22px rgba(141,246,255,0.5),
            inset 0 0 0 2px rgba(141,246,255,0.9),
            inset 0 -10px 0 rgba(0, 0, 0, 0.18);
        }
        .sc-info-bar {
          position: relative;
          width: 100%;
          height: 100%;
          background: rgba(6, 11, 32, 0.9);
          display: flex;
          align-items: center;
          overflow: visible;
          border-radius: 4px;
        }
        .sc-info-bar-wrap.selected .sc-info-bar {
          background: linear-gradient(180deg, rgba(250, 252, 255, 1), rgba(232, 238, 248, 1));
          border-radius: 6px;
        }
        .sc-info-bar-new {
          position: absolute;
          left: 6px;
          top: -12px;
          height: 24px;
          width: auto;
          pointer-events: none;
          z-index: 5;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.45));
        }
        .sc-info-bar-wrap.selected .sc-info-bar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: #c4001a;
          z-index: 1;
        }
        .sc-info-bar-text {
          flex: 1;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 23px;
          letter-spacing: 1px;
          line-height: 1.2;
          color: #ecfbff;
          padding: 0 10px;
          white-space: normal;
          overflow-wrap: anywhere;
          user-select: none;
          text-shadow: 0 1px 0 rgba(0,0,0,0.45);
        }
        .sc-info-bar-wrap.selected .sc-info-bar-text {
          color: #04133f;
          font-weight: 700;
          text-shadow: none;
        }
        .sc-info-bar-box {
          height: 70%;
          background: linear-gradient(180deg, #0a0a0d 0%, #000 100%);
          display: flex;
          align-items: center;
          padding: 0 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 1px;
          color: #fff;
          flex-shrink: 0;
          border-radius: 4px;
          margin-right: 4px;
          user-select: none;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08);
        }

        .sc-info-bar-icon {
          height: 55%;
          width: auto;
          flex-shrink: 0;
          margin-left: 14px;
          object-fit: contain;
          pointer-events: none;
          user-select: none;
        }

        .sc-info-bar-count {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 1px;
          color: #d8f6ff;
          margin-right: 14px;
          flex-shrink: 0;
          user-select: none;
        }
        .sc-info-bar-wrap.selected .sc-info-bar-count {
          color: #111;
        }

        /* footer hints */
        .sc-footer {
          position: fixed;
          bottom: 20px; right: 28px;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 60;
          background: rgba(4, 8, 28, 0.84);
          padding: 8px 10px;
          border-radius: 10px;
          box-shadow: inset 0 0 0 1px rgba(145,245,255,0.35);
          opacity: 0;
          transition: opacity 0.4s ease 0.6s;
        }
        .sc-footer.mounted { opacity: 1; }
        .sc-footer-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.92);
          background: rgba(8,12,38,0.7);
          padding: 2px 8px;
          border-radius: 6px;
          box-shadow: inset 0 0 0 1px rgba(145,245,255,0.35);
        }
        .sc-footer-key {
          border: 1px solid rgba(255,255,255,0.55);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
          color: #e9fbff;
          background: rgba(145,245,255,0.2);
        }

        @media (max-width: 1200px) {
          .sc-bar,
          .sc-bar-red {
            width: min(74vw, 760px);
          }
          .sc-info-panel {
            top: auto;
            bottom: 118px;
            right: 10px;
            width: min(48vw, 620px);
            max-height: 46vh;
          }
        }

        @media (max-width: 900px) {
          .sc-mobile-cats {
            position: fixed;
            top: 78px;
            left: 8px;
            right: 8px;
            z-index: 70;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
            pointer-events: all;
          }

          .sc-mobile-cat {
            border: 1px solid rgba(145,245,255,0.45);
            background: linear-gradient(180deg, rgba(12, 20, 62, 0.95), rgba(7, 12, 36, 0.95));
            color: #dff9ff;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 17px;
            letter-spacing: 1px;
            line-height: 1;
            min-height: 44px;
            padding: 10px 8px;
            clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
            box-shadow: 0 6px 12px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.06);
          }

          .sc-mobile-cat.active {
            background: linear-gradient(180deg, rgba(143,245,255,0.96), rgba(105,223,255,0.96));
            color: #051746;
            box-shadow: 0 8px 14px rgba(0,0,0,0.35), 0 0 0 2px rgba(145,245,255,0.35);
          }

          .sc-root {
            display: none;
          }

          .sc-root {
            left: 0;
            right: 0;
            justify-content: flex-start;
            padding: 90px 10px 126px 10px;
            gap: 10px;
          }
          .sc-bar,
          .sc-bar-red {
            width: min(95vw, 720px);
            height: 68px;
          }
          .sc-bar-outer.active .sc-bar,
          .sc-bar-outer.active .sc-bar-red {
            height: 84px;
          }
          .sc-char {
            left: 64px;
            max-width: 108px;
          }
          .sc-role {
            font-size: 32px;
            padding-right: 10px;
          }
          .sc-label {
            font-size: 24px;
            letter-spacing: 2px;
          }
          .sc-stats {
            padding-right: 8px;
            gap: 6px;
          }

          .sc-main {
            padding-left: clamp(44px, 8vw, 90px);
          }
          .sc-stat-num {
            font-size: 18px;
          }
          .sc-right-nav {
            display: none;
          }
          .sc-info-panel {
            left: 8px;
            right: 8px;
            width: auto;
            top: 132px;
            bottom: 90px;
            padding-left: 14px;
            max-height: none;
          }
          .sc-info-bar-wrap {
            min-height: 64px;
          }
          .sc-info-bar-text {
            font-size: 21px;
          }
          .sc-info-bar-box {
            font-size: 14px;
            padding: 0 8px;
          }
          .sc-info-bar-count {
            font-size: 16px;
          }
          .sc-footer {
            left: 8px;
            right: 8px;
            bottom: 10px;
            align-items: stretch;
            gap: 6px;
          }
          .sc-footer-row {
            justify-content: space-between;
            font-size: 12px;
          }
          .sc-footer-row:nth-child(3),
          .sc-footer-row:nth-child(4) {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .sc-char {
            display: none;
          }
          .sc-main {
            align-items: flex-start;
            padding-left: 0;
          }
          .sc-role {
            font-size: 24px;
            transform: none;
            letter-spacing: -0.5px;
          }
          .sc-bar-content {
            padding: 0 12px;
            gap: 10px;
          }
          .sc-label {
            font-size: 20px;
          }
          .sc-info-panel {
            top: 128px;
            bottom: 82px;
            max-height: none;
            padding-left: 10px;
            gap: 8px;
          }
          .sc-mobile-cats {
            top: 74px;
            gap: 6px;
          }
          .sc-mobile-cat {
            min-height: 42px;
            font-size: 15px;
            padding: 9px 6px;
          }
        }

        @media (max-height: 760px) {
          .sc-mobile-cats {
            top: 70px;
          }

          .sc-info-panel {
            top: 122px;
            bottom: 78px;
          }

          .sc-info-bar-wrap {
            min-height: 56px;
          }

          .sc-info-bar-text {
            font-size: 18px;
          }

          .sc-info-bar-box,
          .sc-info-bar-count {
            font-size: 14px;
          }

          .sc-footer {
            bottom: 6px;
            right: 8px;
            gap: 4px;
            padding: 6px 8px;
          }

          .sc-footer-row {
            font-size: 11px;
            gap: 6px;
          }
        }
      `}</style>

			<div className="sc-root" role="navigation">
				{ITEMS.map((item, i) => (
					<div
						key={item.id}
						className={`sc-bar-outer${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
						onClick={() => {
							if (active !== i) playConfirm();
							else playHover();
							setActive(i);
							setFocus("left");
							setActiveInfoBar(0);
						}}
						onMouseEnter={() => {
							playHover();
							setActive(i);
						}}>
						<div className="sc-bar-red" />
						<div className="sc-bar">
							<img className="sc-char" src={CHARS[i]} alt="" />
							<div className="sc-bar-fill" />
							<div className="sc-bar-shade" />
							<div className="sc-bar-content">
								<div className="sc-role">{ROLES[i].text}</div>
								<div className="sc-main">
									<div className="sc-main-top">
										<div className="sc-icon">{item.icon}</div>
										<div className="sc-label">{item.label}</div>
									</div>
								</div>
								<div className="sc-stats">
									{item.stats.map((s) => (
										<div className="sc-stat" key={s.tag}>
											<div className="sc-stat-top">
												<span
													className="sc-stat-tag"
													style={{ color: s.color, borderColor: s.color }}>
													{s.tag}
												</span>
												<span className="sc-stat-num">{s.value}</span>
											</div>
											<div className="sc-stat-bars">
												<div
													className="sc-stat-bar-color"
													style={{ background: s.color }}
												/>
												<div className="sc-stat-bar-black" />
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

      {mounted && (
        <div className="sc-mobile-cats" aria-label="Social categories">
          {ITEMS.map((item, i) => (
            <button
              key={`mobile-cat-${item.id}`}
              type="button"
              className={`sc-mobile-cat${active === i ? " active" : ""}`}
              onClick={() => {
                if (active !== i) playConfirm();
                else playHover();
                setActive(i);
                setActiveInfoBar(0);
                setFocus("right");
              }}>
              {item.icon}
            </button>
          ))}
        </div>
      )}

			{mounted && (
				<div className="sc-right-nav" key={active}>
					<span className="sc-nav-arrow left">◄</span>
					<span className="sc-nav-btn">LB</span>
					<span className="sc-nav-label">{ITEMS[active].label}</span>
					<span className="sc-nav-btn">RB</span>
					<span className="sc-nav-arrow right">►</span>
				</div>
			)}

			{mounted && (
				<div className="sc-info-panel">
					{Array.from({ length: ITEMS[active].bars }).map((_, i) => (
						<div
							className={`sc-info-bar-wrap${activeInfoBar === i ? " selected" : ""}`}
							key={`bar-${active}-${i}`}
							ref={(node) => {
								infoRowRefs.current[i] = node;
							}}
							style={{ animationDelay: `${i * 50}ms` }}
							onClick={() => {
								const target = ITEMS[active].links[i];
								if (!target) {
									playInvalid();
									return;
								}
								playConfirm();
								setActiveInfoBar(i);
								setFocus("right");
								const href = /^(https?:\/\/|mailto:)/.test(target)
									? target
									: `https://${target}`;
								window.open(href, "_blank");
							}}
							onMouseEnter={() => {
								playHover();
								setActiveInfoBar(i);
								setFocus("right");
							}}>
							{ITEMS[active].newBars.includes(i) && (
								<img className="sc-info-bar-new" src={newsign} alt="" />
							)}
							<div className="sc-info-bar">
								<img
									className="sc-info-bar-icon"
									src={ITEMS[active].barIcon}
									alt=""
								/>
								<span className="sc-info-bar-text">
									{ITEMS[active].entries[i].label}
								</span>
								<span className="sc-info-bar-box">VIEWS</span>
								<span className="sc-info-bar-count">
									{ITEMS[active].counts[i]}
								</span>
							</div>
						</div>
					))}
				</div>
			)}

			<div className={`sc-footer${mounted ? " mounted" : ""}`}>
				<div className="sc-footer-row">
					<span className="sc-footer-key">W/S or ↑↓</span>
					<span>SELECT CATEGORY OR ITEM</span>
				</div>
				<div className="sc-footer-row">
					<span className="sc-footer-key">ENTER/SPACE</span>
					<span>MOVE TO RIGHT / OPEN SELECTED</span>
				</div>
				<div className="sc-footer-row">
					<span className="sc-footer-key">A</span>
					<span>BACK</span>
				</div>
				<div className="sc-footer-row">
					<span className="sc-footer-key">ESC</span>
					<span>BACK</span>
				</div>
			</div>
		</div>
	);
}
