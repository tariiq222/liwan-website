// The subscription calculator on the home page. The pricing object arrives as JSON in the page
// (see PricingGlance.astro); this script only does the arithmetic of pricing-format.ts and writes
// the results into the elements the page marked with data- attributes.
import type { Pricing } from '../lib/pricing';
import {
	buildQuote,
	nextStorage,
	numberAr,
	previousStorage,
	storageBlockPrice,
	storageLabel,
	usersLabel,
	type Billing,
	type Quote,
} from './pricing-format';

const PERIOD_WORD: Record<Billing, string> = { monthly: 'شهريًا', annual: 'سنويًا' };

function initCalculator(root: HTMLElement): void {
	const raw = root.querySelector('script[data-calc-data]')?.textContent;
	if (!raw) return;
	const pricing = JSON.parse(raw) as Pricing;
	const money = new Intl.NumberFormat('ar-SA', { style: 'currency', currency: pricing.currency, maximumFractionDigits: 0 });

	const one = <T extends Element>(selector: string): T => {
		const el = root.querySelector<T>(selector);
		if (!el) throw new Error(`pricing calculator: missing ${selector}`);
		return el;
	};
	const all = <T extends Element>(selector: string): T[] => [...root.querySelectorAll<T>(selector)];

	const usersInput = one<HTMLInputElement>('input[data-users]');
	const storageDown = one<HTMLButtonElement>('[data-storage-down]');
	const storageUp = one<HTMLButtonElement>('[data-storage-up]');
	const onboardingInput = one<HTMLInputElement>('input[data-onboarding]');
	let storageGb = pricing.free.storage_gb;

	const billing = (): Billing => (one<HTMLInputElement>('input[name="billing"]:checked').value === 'annual' ? 'annual' : 'monthly');
	const selectedApps = (): string[] => all<HTMLInputElement>('input[data-app]:checked').map((input) => input.value);
	const set = (selector: string, text: string): void => all(selector).forEach((el) => (el.textContent = text));
	const show = (selector: string, visible: boolean): void => all<HTMLElement>(selector).forEach((el) => (el.hidden = !visible));

	function renderPrices(period: Billing): void {
		for (const app of pricing.apps) set(`[data-price-app="${app.key}"]`, money.format(app[period]));
		set('[data-price-user]', money.format(pricing.extra_user[period]));
		set('[data-price-storage]', money.format(storageBlockPrice(pricing, period)));
		set('[data-period-word]', PERIOD_WORD[period]);
	}

	function renderLines(quote: Quote): void {
		for (const app of pricing.apps) {
			const line = quote.appLines.find((l) => l.key === app.key);
			const row = one<HTMLElement>(`[data-line-app="${app.key}"]`);
			row.hidden = !line;
			if (line) one(`[data-line-app="${app.key}"] [data-amount]`).textContent = money.format(line.amount);
		}
		show('[data-line-users]', quote.extraUsers > 0);
		set('[data-line-users] [data-qty]', `× ${numberAr(quote.extraUsers)}`);
		set('[data-line-users] [data-amount]', money.format(quote.extraUsersAmount));
		show('[data-line-storage]', quote.extraStorageGb > 0);
		set('[data-line-storage] [data-qty]', `+ ${storageLabel(quote.extraStorageGb)}`);
		set('[data-line-storage] [data-amount]', money.format(quote.extraStorageAmount));
	}

	function render(): void {
		const period = billing();
		const users = Number(usersInput.value);
		const quote = buildQuote(pricing, { billing: period, apps: selectedApps(), users, storageGb, onboarding: onboardingInput.checked });

		renderPrices(period);
		renderLines(quote);
		const min = Number(usersInput.min);
		usersInput.style.setProperty('--fill', `${((users - min) / (Number(usersInput.max) - min)) * 100}%`);
		set('[data-users-out]', usersLabel(users));
		show('[data-users-max]', users >= pricing.extra_user.max_users);
		set('[data-storage-out]', storageLabel(storageGb));
		storageDown.disabled = previousStorage(pricing, storageGb) === storageGb;

		const free = quote.recurring === 0;
		set('[data-total]', free ? 'مجانًا' : money.format(quote.recurring));
		show('[data-period]', !free);
		show('[data-saving]', quote.saving > 0 && !free);
		set('[data-saving-amount]', money.format(quote.saving));
		show('[data-onboarding-line]', quote.onboarding > 0);
		set('[data-onboarding-amount]', money.format(quote.onboarding));
	}

	storageDown.addEventListener('click', () => {
		storageGb = previousStorage(pricing, storageGb);
		render();
	});
	storageUp.addEventListener('click', () => {
		storageGb = nextStorage(pricing, storageGb);
		render();
	});
	root.addEventListener('input', render);
	root.addEventListener('change', render);
	render();
}

document.querySelectorAll<HTMLElement>('[data-calc]').forEach(initCalculator);
