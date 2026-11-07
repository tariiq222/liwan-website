// "Start" section: when the list of steps scrolls into view, each step completes in turn and the
// line to the next one fills. With reduced motion everything completes at once.
const STEP_MS = 950;

function initProgress(list: HTMLElement): void {
	const steps = [...list.querySelectorAll<HTMLElement>('[data-start-step]')];
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;
			observer.disconnect();
			steps.forEach((step, index) => {
				window.setTimeout(() => step.classList.add('is-done'), reducedMotion ? 0 : index * STEP_MS);
			});
		},
		{ threshold: 0.3 },
	);
	observer.observe(list);
}

document.querySelectorAll<HTMLElement>('[data-start]').forEach(initProgress);
