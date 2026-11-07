// Drives the home hero loop (spec 2A): «before» (scattered sign-in windows) for 2.6 s, then the
// windows fold into the Liwan ring and colour on arrival, hold 7.5 s, and fold back in reverse.
// It runs only while the hero is on screen; under reduced motion it shows the Liwan state.
const BEFORE_MS = 2600;
const HOLD_MS = 7500;
const FADE_MS = 150;
const MOVE_MS = 750 + 8 * 20;
const CLEAR_MS = 250;
const COUNT_STEP_MS = 90;

const scene = document.querySelector<HTMLElement>('[data-hero-scene]');
const counters = [...document.querySelectorAll<HTMLElement>('[data-hero-stats] [data-count]')];
const formatter = new Intl.NumberFormat('ar-SA');
const total = scene ? scene.querySelectorAll('.node').length : 0;

let timers: number[] = [];
let countTimer = 0;
let running = false;

function later(ms: number, fn: () => void): void {
	timers.push(window.setTimeout(fn, ms));
}

function countTo(target: number): void {
	window.clearInterval(countTimer);
	let value = Number(counters[0]?.dataset.value ?? total);
	countTimer = window.setInterval(() => {
		value += value > target ? -1 : value < target ? 1 : 0;
		for (const el of counters) {
			el.dataset.value = String(value);
			el.textContent = formatter.format(value);
		}
		if (value === target) window.clearInterval(countTimer);
	}, COUNT_STEP_MS);
}

function toLiwan(): void {
	if (!scene) return;
	scene.classList.add('is-fading');
	later(FADE_MS, () => scene.classList.add('is-liwan'));
	later(FADE_MS + MOVE_MS, () => {
		scene.classList.add('is-arrived');
		countTo(1);
	});
	later(FADE_MS + MOVE_MS + HOLD_MS, toBefore);
}

function toBefore(): void {
	if (!scene) return;
	scene.classList.remove('is-arrived');
	countTo(total);
	later(CLEAR_MS, () => scene.classList.remove('is-liwan'));
	later(CLEAR_MS + MOVE_MS, () => scene.classList.remove('is-fading'));
	later(CLEAR_MS + MOVE_MS + BEFORE_MS, toLiwan);
}

function start(): void {
	if (running || !scene) return;
	running = true;
	scene.classList.remove('is-fading', 'is-liwan', 'is-arrived');
	countTo(total);
	later(BEFORE_MS, toLiwan);
}

function stop(): void {
	running = false;
	timers.forEach((id) => window.clearTimeout(id));
	timers = [];
}

if (scene) {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		scene.classList.add('is-fading', 'is-liwan', 'is-arrived');
		for (const el of counters) el.textContent = formatter.format(1);
	} else {
		new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.25 }).observe(scene);
		document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
	}
}
