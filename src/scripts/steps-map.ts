// "Every step has a place": a gear on a configurable step shows what the company sets there.
// While the map is on screen the panel cycles through the three views until the visitor
// touches one. Also drives the demo switch and the "+ add" chips inside the panel.
const CYCLE_MS = 5000;

function initSteps(root: HTMLElement): void {
	const gears = [...root.querySelectorAll<HTMLButtonElement>('[data-gear]')];
	const views = [...root.querySelectorAll<HTMLElement>('[data-view]')];
	const panel = root.querySelector<HTMLElement>('[data-panel]');
	if (!panel || gears.length === 0 || gears.length !== views.length) return;

	let current = 0;
	let timer: number | undefined;
	let visitorTookOver = false;

	function select(index: number): void {
		current = index;
		gears.forEach((gear, n) => {
			gear.setAttribute('aria-pressed', String(n === index));
			gear.closest('.step')?.classList.toggle('is-active', n === index);
		});
		views.forEach((view, n) => {
			view.classList.toggle('is-active', n === index);
			view.inert = n !== index;
		});
		panel!.style.setProperty('--pos', gears[index].dataset.pos ?? '0');
	}

	function stop(): void {
		window.clearInterval(timer);
		timer = undefined;
	}

	function start(): void {
		if (timer !== undefined || visitorTookOver) return;
		timer = window.setInterval(() => select((current + 1) % gears.length), CYCLE_MS);
	}

	gears.forEach((gear, index) => {
		gear.addEventListener('click', () => {
			visitorTookOver = true;
			stop();
			select(index);
		});
	});

	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (!reducedMotion) {
		new IntersectionObserver(
			([entry]) => (entry.isIntersecting ? start() : stop()),
			{ threshold: 0.5 },
		).observe(root);
	}
	panel.addEventListener('pointerenter', stop);
	panel.addEventListener('pointerleave', start);
	panel.addEventListener('focusin', stop);
	panel.addEventListener('focusout', start);

	select(current);
}

function initSwitch(toggle: HTMLButtonElement): void {
	toggle.addEventListener('click', () => {
		toggle.setAttribute('aria-checked', String(toggle.getAttribute('aria-checked') !== 'true'));
	});
}

// Adds a chip before the button, up to data-add-max. The new chip is cloned from an existing one
// so it keeps the component's scoped styles.
function initAdd(button: HTMLButtonElement): void {
	const item = button.closest('li');
	const list = item?.parentElement;
	const template = list?.querySelector<HTMLElement>(':scope > li:not(:last-child)');
	if (!item || !list || !template) return;
	const max = Number(button.dataset.addMax ?? 1);
	let added = 0;

	button.addEventListener('click', () => {
		const copy = template.cloneNode(true) as HTMLElement;
		const chip = copy.querySelector<HTMLElement>('.chip');
		if (!chip) return;
		chip.textContent = button.dataset.addLabel ?? '';
		chip.classList.add('is-new');
		list.insertBefore(copy, item);
		added += 1;
		if (added >= max) button.disabled = true;
	});
}

document.querySelectorAll<HTMLElement>('[data-steps]').forEach(initSteps);
document.querySelectorAll<HTMLButtonElement>('[data-steps] [data-switch]').forEach(initSwitch);
document.querySelectorAll<HTMLButtonElement>('[data-steps] [data-add]').forEach(initAdd);
