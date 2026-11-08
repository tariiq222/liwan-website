// The yearly calculator on /apps (see YearCalc.astro). All amounts come from the pricing numbers
// the page embedded as JSON; the competitor side is only what the visitor types.
import { moneyFormatter } from '../lib/numbers';
import { formatNumber, storageLabel } from './pricing-format';

interface Tool {
	key: string;
	appName: string;
	paid: boolean;
	// The annual price; missing for a paid application whose price is unavailable.
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

const ARABIC_INDIC = '\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669';

// A plain number, or one with a comma as thousands separator (only before exactly three digits).
// Empty is 0 (not used); anything else that is not a number is null (invalid).
function parseAmount(raw: string): number | null {
	const text = raw
		.replace(/[\u0660-\u0669]/g, (d) => String(ARABIC_INDIC.indexOf(d)))
		.replace(/\s/g, '')
		.replace(/\u066c/g, ',')
		.replace('\u066b', '.');
	const plain = /^\d+(\.\d+)?$/.test(text);
	const grouped = /^\d{1,3}(,\d{3})+(\.\d+)?$/.test(text);
	if (text === '') return 0;
	if (!plain && !grouped) return null;
	const value = Number.parseFloat(text.replace(/,/g, ''));
	return Number.isFinite(value) && value >= 0 ? value : null;
}

function init(root: HTMLElement): void {
	const raw = root.querySelector('script[data-calc-data]')?.textContent;
	if (!raw) return;
	const data = JSON.parse(raw) as CalcData;
	const money = moneyFormatter(data.currency);

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
	const contact = out('[data-contact]');
	const results = out('[data-results]');
	const note = out('[data-note]');
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

	function reset(): void {
		today.textContent = '—';
		liwan.textContent = '—';
		diff.textContent = '—';
		diffLabel.textContent = 'الفرق في السنة';
		diffCard.classList.remove('save', 'more');
		fill(counted, []);
	}

	function render(): void {
		const parsedPeople = parseAmount(employees?.value ?? '');
		const people = parsedPeople ?? 0;
		const validPeople = Number.isInteger(people) && people >= 1;
		const entered = data.tools.map((tool) => {
			const amount = parseAmount(inputs.get(tool.key)?.value ?? '');
			inputs.get(tool.key)?.setAttribute('aria-invalid', String(amount === null));
			return { tool, amount: amount ?? 0, invalid: amount === null };
		});
		employees?.setAttribute('aria-invalid', String(!validPeople));
		const used = entered.filter((e) => e.amount > 0);
		// A value the calculator cannot read is never skipped: totals wait until it is fixed.
		const hasInvalid = entered.some((e) => e.invalid);

		// Above the user limit, or a paid application without a price, there is no honest total.
		const needsContact = validPeople && (people > data.maxUsers || used.some((e) => e.tool.paid && e.tool.annual === undefined));
		contact.hidden = !needsContact;
		results.hidden = needsContact;
		note.hidden = needsContact;

		const more = entered
			.filter((e) => !e.tool.paid && e.amount === 0)
			.map((e) => `${e.tool.appName} مجانًا`);
		more.push('ليوان AI داخل تطبيقاتك', `${storageLabel(data.storageGb)} تخزين`, 'صلاحيات واحدة لفريقك');
		if (data.hosting) more.push('استضافة داخل السعودية');
		if (used.length >= 2) more.push(`دخول واحد بدل ${formatNumber(used.length)}`);
		fill(extrasList, more);

		if (needsContact || hasInvalid || !validPeople || used.length === 0) {
			reset();
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
			lines.push(`مستخدمون إضافيون (${formatNumber(extraUsers)}): ${money.format(amount)}`);
		}

		today.textContent = money.format(todayTotal);
		liwan.textContent = money.format(liwanTotal);
		fill(counted, lines);

		const gap = todayTotal - liwanTotal;
		diffCard.classList.toggle('save', gap > 0);
		diffCard.classList.toggle('more', gap < 0);
		diffLabel.textContent = gap > 0 ? 'توفّر في السنة' : gap < 0 ? 'تزيد في السنة' : 'الفرق في السنة';
		diff.textContent = gap === 0 ? 'بلا فرق' : money.format(Math.abs(gap));
	}

	root.addEventListener('input', render);
	render();
}

document.querySelectorAll<HTMLElement>('[data-year-calc]').forEach(init);
