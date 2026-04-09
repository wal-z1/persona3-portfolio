import { useCallback, useRef } from "react";

let context;
const MASTER_SFX_GAIN = 0.55;

function getContext() {
	if (!context) {
		const AudioContextClass = window.AudioContext || window.webkitAudioContext;
		if (!AudioContextClass) return null;
		context = new AudioContextClass();
	}
	if (context.state === "suspended") {
		context.resume().catch(() => {});
	}
	return context;
}

function playTone({ frequency, duration, type, gain }) {
	const ctx = getContext();
	if (!ctx) return;

	const oscillator = ctx.createOscillator();
	const gainNode = ctx.createGain();

	oscillator.type = type;
	oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

	gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
	gainNode.gain.exponentialRampToValueAtTime(
		Math.max(0.0001, gain * MASTER_SFX_GAIN),
		ctx.currentTime + 0.01,
	);
	gainNode.gain.exponentialRampToValueAtTime(
		0.0001,
		ctx.currentTime + duration,
	);

	oscillator.connect(gainNode);
	gainNode.connect(ctx.destination);

	oscillator.start();
	oscillator.stop(ctx.currentTime + duration);
}

export function usePersonaSfx({ muted = true } = {}) {
	const lastHoverAt = useRef(0);
	const lastActionAt = useRef(0);

	const playHover = useCallback(() => {
		if (muted) return;
		const now = performance.now();
		if (now - lastHoverAt.current < 70) return;
		lastHoverAt.current = now;
		playTone({ frequency: 780, duration: 0.06, type: "triangle", gain: 0.04 });
	}, [muted]);

	const playConfirm = useCallback(() => {
		if (muted) return;
		const now = performance.now();
		if (now - lastActionAt.current < 60) return;
		lastActionAt.current = now;
		playTone({ frequency: 420, duration: 0.05, type: "square", gain: 0.05 });
		setTimeout(() => {
			playTone({
				frequency: 620,
				duration: 0.08,
				type: "triangle",
				gain: 0.045,
			});
		}, 35);
	}, [muted]);

	const playBack = useCallback(() => {
		if (muted) return;
		const now = performance.now();
		if (now - lastActionAt.current < 80) return;
		lastActionAt.current = now;
		playTone({ frequency: 360, duration: 0.06, type: "triangle", gain: 0.045 });
		setTimeout(() => {
			playTone({ frequency: 250, duration: 0.08, type: "sine", gain: 0.04 });
		}, 28);
	}, [muted]);

	const playInvalid = useCallback(() => {
		if (muted) return;
		const now = performance.now();
		if (now - lastActionAt.current < 90) return;
		lastActionAt.current = now;
		playTone({ frequency: 180, duration: 0.08, type: "square", gain: 0.03 });
	}, [muted]);

	return { playHover, playConfirm, playBack, playInvalid };
}
