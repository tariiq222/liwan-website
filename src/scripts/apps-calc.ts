import { NUMBER_LOCALE } from '../lib/numbers';
// The yearly calculator on /apps (see YearCalc.astro). All amounts come from the pricing numbers
// the page embedded as JSON; the competitor side is only what the visitor types.
interface Tool {
	key: string;
	label: string;
	appName: string;
	annual?: number;
}

interface CalcData {
	currency: string;
	freeUsers: number;
	maxUsers: number;
	extraUserAnnual: number;
	storageGb: number;
	hosting: boolean;
	tools: Tool[];
}

const ARABIC_DIGITS = "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669";

// Visitors may type Arabic-Indic digits, a thousands separator or an Arabic decimal comma.
function parseAmount(raw: string): number {
	const latin = raw
		.replace(/[\u0660-\u0669]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
		.replace(/[\u066c,\s]/g, '')
		.replace('\u066b', '.');
	const value = Number.parseFloat(latin);
	return Number.isFinite(value) && value > 0 ? value : 0;
}

function init(root: HTMLElement): void {
	const raw = root.querySelector('script[data-calc-data]')?.textContent;
	if (!raw) return;
	const data = JSON.parse(raw) as CalcData;
	const money = new Intl.NumberFormat(NUMBER_LOCALE, { style: 'currency', currency: data.currency, maximumFractionDigits: 0 });
	const count = new Intl.NumberFormat(NUMBER_LOCALE);

	const employees = root.querySelector<HTMLInputElement>('[data-employees]');
	const inputs = new Map(data.tools.map((t) => [t.key, root.querySelector<HTMLInputElement>(`[data-tool="${t.key}"]`)]));
	const out = (selector: string): HTMLElement => {
		const el = root.querySelector<HTMLElement>(selector);
		if (!el) throw new Error(`apps calculator: missing ${selector}`);
		return el;
	};
	const today = out('[data-today]');
	const liwan = out('[data-liwan]');
	const counted = out('[data-counted]');
	const diffCard = out('[data-diff-card]');
	const diffLabel = out('[data-diff-label]');
	const diff = out('[data-diff]');
	const extras = out('[data-extras]');
	const extrasList = out('[data-extras-list]');

	const fill = (list: HTMLElement, lines: string[]): void => {
		list.replaceChildren(
			...lines.map((line) => {
				const li = document.createElement('li');
				li.textContent = line;
				return li;
			}),
		);
	};

	function render(): void {
		const people = Math.min(data.maxUsers, Math.max(1, Math.floor(parseAmount(employees?.value ?? '') || 1)));
		const entered = data.tools.map((tool) => ({ tool, amount: parseAmount(inputs.get(tool.key)?.value ?? '') }));
		const used = entered.filter((e) => e.amount > 0);
		const unused = entered.filter((e) => e.amount === 0);

		if (used.length === 0) {
			today.textContent = '—';
			liwan.textContent = '—';
			diff.textContent = '—';
			diffLabel.textContent = 'الفرق في السنة';
			diffCard.classList.remove('save', 'more');
			fill(counted, []);
			extras.hidden = true;
			return;
		}

		const todayTotal = used.reduce((sum, e) => sum + e.amount, 0);
		const lines: string[] = [];
		let liwanTotal = 0;
		for (const { tool } of used) {
			if (tool.annual !== undefined) {
				liwanTotal += tool.annual;
				lines.push(`${tool.appName}: ${money.format(tool.annual)}`);
			} else {
				lines.push(`${tool.appName}: مجاني`);
			}
		}
		const extraUsers = Math.max(0, people - data.freeUsers);
		if (extraUsers > 0) {
			const amount = extraUsers * data.extraUserAnnual;
			liwanTotal += amount;
			lines.push(`مستخدمون إضافيون (${count.format(extraUsers)}): ${money.format(amount)}`);
		}

		today.textContent = money.format(todayTotal);
		liwan.textContent = money.format(liwanTotal);
		fill(counted, lines);

		const gap = todayTotal - liwanTotal;
		diffCard.classList.toggle('save', gap > 0);
		diffCard.classList.toggle('more', gap < 0);
		diffLabel.textContent = gap > 0 ? 'توفّر في السنة' : gap < 0 ? 'تزيد في السنة' : 'الفرق في السنة';
		diff.textContent = gap === 0 ? 'بلا فرق' : money.format(Math.abs(gap));

		const more: string[] = unused.map((e) => `${e.tool.appName} مجانًا`).filter((_, i) => unused[i].tool.annual === undefined);
		more.push('ليوان AI داخل تطبيقاتك');
		more.push(`${count.format(data.storageGb)} جيجابايت تخزين`);
		more.push('صلاحيات واحدة لفريقك');
		if (data.hosting) more.push('استضافة داخل السعودية');
		if (used.length >= 2) more.push(`دخول واحد بدل ${count.format(used.length)}`);
		fill(extrasList, more);
		extras.hidden = false;
	}

	root.addEventListener('input', render);
	render();
}

document.querySelectorAll<HTMLElement>('[data-year-calc]').forEach(init);
