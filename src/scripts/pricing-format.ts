// Pure helpers for the pricing glance: the subscription quote and Arabic number wording.
// Used by the page at build time and by pricing-calculator.ts in the browser. Every amount comes
// from the Pricing object; nothing here knows a price.
import type { Pricing } from '../lib/pricing';

export type Billing = 'monthly' | 'annual';

export interface QuoteInput {
	billing: Billing;
	apps: string[];
	users: number;
	storageGb: number;
	onboarding: boolean;
}

export interface Quote {
	recurring: number;
	saving: number;
	appLines: { key: string; amount: number }[];
	extraUsers: number;
	extraUsersAmount: number;
	extraStorageGb: number;
	extraStorageAmount: number;
	onboarding: number;
}

const MONTHS_PER_YEAR = 12;

// How many months an annual plan charges. The contract carries no annual storage price, so
// storage follows the same ratio as the extra-user price.
function annualMonths(pricing: Pricing): number {
	const { monthly, annual } = pricing.extra_user;
	return monthly > 0 ? annual / monthly : MONTHS_PER_YEAR;
}

export function storageBlockPrice(pricing: Pricing, billing: Billing): number {
	const { block_monthly } = pricing.extra_storage;
	return billing === 'annual' ? block_monthly * annualMonths(pricing) : block_monthly;
}

export function buildQuote(pricing: Pricing, input: QuoteInput): Quote {
	const months = annualMonths(pricing);
	const selected = pricing.apps.filter((app) => input.apps.includes(app.key));
	const extraUsers = Math.max(0, input.users - pricing.free.users);
	const extraStorageGb = Math.max(0, input.storageGb - pricing.free.storage_gb);
	const storageBlocks = Math.ceil(extraStorageGb / pricing.extra_storage.block_gb);
	const storageMonthly = storageBlocks * pricing.extra_storage.block_monthly;

	const appsMonthly = selected.reduce((sum, app) => sum + app.monthly, 0);
	const appsAnnual = selected.reduce((sum, app) => sum + app.annual, 0);
	const monthlyTotal = appsMonthly + extraUsers * pricing.extra_user.monthly + storageMonthly;
	const annualTotal = appsAnnual + extraUsers * pricing.extra_user.annual + storageMonthly * months;
	const annual = input.billing === 'annual';

	return {
		recurring: annual ? annualTotal : monthlyTotal,
		saving: Math.max(0, monthlyTotal * MONTHS_PER_YEAR - annualTotal),
		appLines: selected.map((app) => ({ key: app.key, amount: app[input.billing] })),
		extraUsers,
		extraUsersAmount: extraUsers * pricing.extra_user[input.billing],
		extraStorageGb,
		extraStorageAmount: annual ? storageMonthly * months : storageMonthly,
		onboarding: input.onboarding ? pricing.onboarding.one_time : 0,
	};
}

// Storage moves in steps of `step_gb` up to `step_gb_after`, then `step_gb_large` at a time.
export function nextStorage(pricing: Pricing, gb: number): number {
	const { step_gb, step_gb_after, step_gb_large } = pricing.extra_storage;
	return gb < step_gb_after ? Math.min(gb + step_gb, step_gb_after) : gb + step_gb_large;
}

export function previousStorage(pricing: Pricing, gb: number): number {
	const { step_gb, step_gb_after, step_gb_large } = pricing.extra_storage;
	const lowered = gb > step_gb_after ? Math.max(gb - step_gb_large, step_gb_after) : gb - step_gb;
	return Math.max(lowered, pricing.free.storage_gb);
}

const arabicNumber = new Intl.NumberFormat('ar-SA');
const arabicPlural = new Intl.PluralRules('ar');

export function numberAr(value: number): string {
	return arabicNumber.format(value);
}

interface CountForms {
	one: string;
	two: string;
	few: string;
	many: string;
	other: string;
}

// «مستخدم واحد» · «مستخدمان» · «٣ مستخدمين» · «١٢ مستخدمًا» · «١٠٠ مستخدم»
function countAr(value: number, forms: CountForms): string {
	const rule = arabicPlural.select(value);
	if (rule === 'one') return forms.one;
	if (rule === 'two') return forms.two;
	const word = rule === 'few' ? forms.few : rule === 'many' ? forms.many : forms.other;
	return `${numberAr(value)} ${word}`;
}

export function usersLabel(value: number): string {
	return countAr(value, { one: 'مستخدم واحد', two: 'مستخدمان', few: 'مستخدمين', many: 'مستخدمًا', other: 'مستخدم' });
}

export function daysLabel(value: number): string {
	return countAr(value, { one: 'يوم واحد', two: 'يومان', few: 'أيام', many: 'يومًا', other: 'يوم' });
}

export function storageLabel(gb: number): string {
	return `${numberAr(gb)} جيجابايت`;
}
