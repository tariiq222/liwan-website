// Animated demo chat for the «ليوان AI» home section (src/components/home/AiSection.astro).
// The component renders the markup and embeds the copy as JSON; this file only plays it:
// type a first word, show three suggestions, light the apps each one uses, send the first,
// then reveal the answer. Auto-play runs while the chat is on screen and the tab is visible.
// Under prefers-reduced-motion it shows each scene's final state and never animates.

interface App {
	key: string;
	label: string;
}

interface Suggestion {
	text: string;
	apps: string[];
}

interface AnswerItem {
	text: string;
	meta?: string;
	app: string;
	source: string;
}

interface Scene {
	status: 'available' | 'soon';
	label: string;
	word: string;
	attach?: { name: string; icon: string };
	suggestions: Suggestion[];
	answer: { intro: string; items: AnswerItem[]; foot?: string; approve?: boolean };
}

interface Data {
	ui: { assistant: string; soon: string; morning: string; evening: string; approve: string; edit: string };
	apps: App[];
	scenes: Scene[];
}

type Step = [number, () => void];

const TYPE_MS = 130;
const HIGHLIGHT_MS = 1400;
const SVG_NS = 'http://www.w3.org/2000/svg';

function init(root: HTMLElement): void {
	const dataEl = root.querySelector('[data-ai-data]');
	if (!dataEl?.textContent) throw new Error('AI section: scene data is missing');
	const data = JSON.parse(dataEl.textContent) as Data;
	const { ui, scenes } = data;

	const q = <T extends Element>(selector: string): T => {
		const el = root.querySelector<T>(selector);
		if (!el) throw new Error(`AI section: ${selector} is missing`);
		return el;
	};
	const stage = q<HTMLElement>('[data-ai-stage]');
	const win = q<HTMLElement>('[data-ai-win]');
	const body = q<HTMLElement>('[data-ai-body]');
	const greeting = q<HTMLElement>('[data-ai-greeting]');
	const msgs = q<HTMLElement>('[data-ai-msgs]');
	const sugsEl = q<HTMLElement>('[data-ai-sugs]');
	const input = q<HTMLElement>('[data-ai-input]');
	const fileSlot = q<HTMLElement>('[data-ai-file]');
	const plus = q<HTMLElement>('[data-ai-plus]');
	const lines = q<SVGSVGElement>('[data-ai-lines]');
	const live = q<HTMLElement>('[data-ai-live]');
	const iconTemplate = q<HTMLTemplateElement>('[data-ai-icons]');
	const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-ai-tab]'));
	const chips = new Map<string, HTMLElement>();
	root.querySelectorAll<HTMLElement>('[data-app]').forEach((chip) => chips.set(chip.dataset.app ?? '', chip));
	const appLabel = new Map(data.apps.map((app) => [app.key, app.label]));

	const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
	const stacked = window.matchMedia('(max-width: 959px)');

	let current = 0;
	let playing = false;
	let inView = false;
	let timers: number[] = [];
	let highlighted: { el: HTMLElement; apps: string[] } | null = null;

	greeting.textContent = new Date().getHours() < 12 ? ui.morning : ui.evening;

	function icon(name: string): Element | null {
		return iconTemplate.content.querySelector(`[data-icon="${name}"]`)?.firstElementChild?.cloneNode(true) as Element | null;
	}

	function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
		const node = document.createElement(tag);
		if (className) node.className = className;
		if (text !== undefined) node.textContent = text;
		return node;
	}

	function tag(app: string, label?: string): HTMLElement {
		const node = el('span', 'lai-tag');
		const svg = icon(app);
		if (svg) node.append(svg);
		node.append(label ?? appLabel.get(app) ?? app);
		return node;
	}

	function fileChip(file: { name: string; icon: string }): HTMLElement {
		const node = el('span', 'lai-file-chip');
		const svg = icon(file.icon);
		if (svg) node.append(svg);
		node.append(el('span', undefined, file.name));
		return node;
	}

	function soonPill(): HTMLElement {
		return el('span', 'badge soon', ui.soon);
	}

	function rise(node: HTMLElement, index = 0): HTMLElement {
		node.classList.add('lai-rise');
		node.style.setProperty('--i', String(index));
		return node;
	}

	function scrollBody(): void {
		body.scrollTo({ top: body.scrollHeight, behavior: reduce.matches ? 'auto' : 'smooth' });
	}

	function clearTimers(): void {
		timers.forEach((id) => window.clearTimeout(id));
		timers = [];
	}

	function clearLines(): void {
		lines.replaceChildren();
		highlighted = null;
	}

	function drawLines(sug: HTMLElement, apps: string[]): void {
		lines.replaceChildren();
		const w = win.getBoundingClientRect();
		const s = sug.getBoundingClientRect();
		for (const app of apps) {
			const chip = chips.get(app);
			if (!chip) continue;
			const c = chip.getBoundingClientRect();
			const endX = c.left + c.width / 2 - w.left;
			const endY = c.bottom - w.top;
			const startX = Math.min(Math.max(endX, s.left - w.left + 24), s.right - w.left - 24);
			const startY = s.top - w.top;
			const midY = (startY + endY) / 2;
			const path = document.createElementNS(SVG_NS, 'path');
			path.setAttribute('d', `M${startX} ${startY} C${startX} ${midY} ${endX} ${midY} ${endX} ${endY}`);
			path.setAttribute('class', 'lai-line');
			lines.append(path);
		}
	}

	function lightChips(apps: string[]): void {
		chips.forEach((chip, key) => chip.classList.toggle('is-lit', apps.includes(key)));
	}

	function highlight(index: number, scene: Scene): void {
		const rows = Array.from(sugsEl.children) as HTMLElement[];
		rows.forEach((row, i) => row.classList.toggle('is-active', i === index));
		const apps = scene.suggestions[index].apps;
		lightChips(apps);
		highlighted = { el: rows[index], apps };
		drawLines(rows[index], apps);
	}

	function markTab(index: number, run: boolean, total = 0): void {
		tabs.forEach((tab, i) => {
			tab.setAttribute('aria-pressed', String(i === index));
			tab.classList.remove('is-playing');
		});
		if (!run) return;
		const tab = tabs[index];
		tab.style.setProperty('--lai-dur', `${total}ms`);
		void tab.offsetWidth;
		tab.classList.add('is-playing');
	}

	function resetChat(scene: Scene): void {
		win.dataset.status = scene.status;
		win.classList.remove('is-sent', 'is-static', 'is-typing');
		msgs.replaceChildren();
		sugsEl.replaceChildren();
		fileSlot.replaceChildren();
		input.textContent = '';
		plus.classList.remove('is-pressed');
		lightChips([]);
		clearLines();
		body.scrollTo({ top: 0 });
	}

	function buildUser(scene: Scene, text: string): HTMLElement {
		const bubble = el('div', 'lai-user');
		if (scene.attach) bubble.append(fileChip(scene.attach));
		bubble.append(el('span', undefined, text));
		return bubble;
	}

	function buildBot(scene: Scene): HTMLElement {
		const bot = el('div', 'lai-bot');
		const head = el('div', 'lai-bot-head');
		const avatar = icon('mark');
		if (avatar) head.append(avatar);
		head.append(el('span', 'lai-bot-name', ui.assistant));
		if (scene.status === 'soon') head.append(soonPill());
		bot.append(head);
		return bot;
	}

	function buildItem(item: AnswerItem): HTMLElement {
		const row = rise(el('div', 'lai-item'));
		const main = el('div', 'lai-item-main');
		main.append(el('span', 'lai-item-text', item.text));
		if (item.meta) main.append(el('span', 'lai-item-meta', item.meta));
		row.append(main, tag(item.app, item.source));
		return row;
	}

	function buildFoot(answer: Scene['answer']): HTMLElement {
		const foot = el('div', 'lai-foot');
		const note = el('span', 'lai-foot-note');
		const check = icon('check');
		if (check) note.append(check);
		note.append(answer.foot ?? '');
		foot.append(note);
		if (answer.approve) {
			const actions = el('span', 'lai-foot-actions');
			actions.append(el('span', 'lai-mini-button primary', ui.approve), el('span', 'lai-mini-button', ui.edit));
			foot.append(actions);
		}
		return rise(foot);
	}

	function timeline(scene: Scene): { steps: Step[]; total: number } {
		const steps: Step[] = [];
		const at = (time: number, fn: () => void) => steps.push([time, fn]);
		let t = 300;

		if (scene.attach) {
			const file = scene.attach;
			at(t, () => plus.classList.add('is-pressed'));
			at(t + 240, () => plus.classList.remove('is-pressed'));
			at(t + 340, () => fileSlot.replaceChildren(rise(fileChip(file))));
			t += 1100;
		}

		const letters = Array.from(scene.word);
		at(t, () => win.classList.add('is-typing'));
		letters.forEach((_, i) => at(t + (i + 1) * TYPE_MS, () => (input.textContent = letters.slice(0, i + 1).join(''))));
		t += letters.length * TYPE_MS + 450;
		at(t, () => {
			win.classList.remove('is-typing');
			scene.suggestions.forEach((sug, i) => sugsEl.append(buildSuggestion(scene, sug, i)));
		});
		t += 700;

		scene.suggestions.forEach((_, i) => {
			at(t, () => highlight(i, scene));
			t += HIGHLIGHT_MS;
		});
		at(t, () => highlight(0, scene));
		t += 650;
		at(t, () => (input.textContent = scene.suggestions[0].text));
		t += 750;

		const bot = buildBot(scene);
		const dots = el('div', 'lai-dots');
		dots.append(el('i'), el('i'), el('i'));
		at(t, () => {
			win.classList.add('is-sent');
			clearLines();
			input.textContent = '';
			fileSlot.replaceChildren();
			sugsEl.replaceChildren();
			msgs.append(rise(buildUser(scene, scene.suggestions[0].text)));
			scrollBody();
		});
		t += 600;
		at(t, () => {
			bot.append(dots);
			msgs.append(rise(bot));
			scrollBody();
		});
		t += 1000;
		at(t, () => {
			dots.remove();
			bot.append(rise(el('p', 'lai-intro', scene.answer.intro)));
			scrollBody();
		});
		t += 500;
		scene.answer.items.forEach((item) => {
			at(t, () => {
				bot.append(buildItem(item));
				scrollBody();
			});
			t += 600;
		});
		if (scene.answer.foot) {
			at(t, () => {
				bot.append(buildFoot(scene.answer));
				scrollBody();
			});
			t += 600;
		}
		t += 3000;
		return { steps, total: t };
	}

	function buildSuggestion(scene: Scene, sug: Suggestion, index: number): HTMLElement {
		const row = rise(el('div', 'lai-sug'), index);
		row.append(el('span', 'lai-sug-text', sug.text));
		const tagsEl = el('span', 'lai-tags');
		sug.apps.forEach((app) => tagsEl.append(tag(app)));
		if (scene.status === 'soon') tagsEl.append(soonPill());
		row.append(tagsEl);
		return row;
	}

	function play(index: number): void {
		clearTimers();
		current = index;
		const scene = scenes[index];
		resetChat(scene);
		const { steps, total } = timeline(scene);
		markTab(index, true, total);
		steps.forEach(([time, fn]) => timers.push(window.setTimeout(fn, time)));
		timers.push(window.setTimeout(() => play((index + 1) % scenes.length), total));
		playing = true;
	}

	function pause(): void {
		clearTimers();
		markTab(current, false);
		playing = false;
	}

	function showFinal(index: number): void {
		clearTimers();
		playing = false;
		current = index;
		const scene = scenes[index];
		resetChat(scene);
		win.classList.add('is-sent', 'is-static');
		msgs.append(buildUser(scene, scene.suggestions[0].text));
		const bot = buildBot(scene);
		bot.append(el('p', 'lai-intro', scene.answer.intro));
		scene.answer.items.forEach((item) => bot.append(buildItem(item)));
		if (scene.answer.foot) bot.append(buildFoot(scene.answer));
		msgs.append(bot);
		markTab(index, false);
	}

	function announce(scene: Scene): void {
		const parts = [scene.label, scene.suggestions[0].text, scene.answer.intro];
		scene.answer.items.forEach((item) => parts.push(item.meta ? `${item.text}، ${item.meta}` : item.text));
		live.textContent = parts.join('. ');
	}

	function revealStage(): void {
		const box = stage.getBoundingClientRect();
		const visible = Math.min(box.bottom, window.innerHeight) - Math.max(box.top, 0);
		if (stacked.matches && visible < box.height * 0.3) {
			stage.scrollIntoView({ block: 'center', behavior: reduce.matches ? 'auto' : 'smooth' });
		}
	}

	function sync(): void {
		const should = inView && !document.hidden && !reduce.matches;
		if (should && !playing) play(current);
		else if (!should && playing) pause();
	}

	tabs.forEach((tab, index) => {
		tab.addEventListener('click', () => {
			announce(scenes[index]);
			if (reduce.matches) showFinal(index);
			else {
				play(index);
				revealStage();
			}
		});
	});

	new IntersectionObserver(
		(entries) => {
			inView = entries.some((entry) => entry.isIntersecting);
			sync();
		},
		{ threshold: 0.3 },
	).observe(stage);

	document.addEventListener('visibilitychange', sync);
	reduce.addEventListener('change', () => {
		if (reduce.matches) showFinal(current);
		else sync();
	});
	window.addEventListener(
		'resize',
		() => {
			if (highlighted) drawLines(highlighted.el, highlighted.apps);
		},
		{ passive: true },
	);

	if (reduce.matches) showFinal(0);
}

const root = document.querySelector<HTMLElement>('[data-ai]');
if (root) init(root);
