import { z } from 'zod';
import type { Locale } from '../i18n';

// Mirrors the product's public pricing contract (site-contract.md section 4.2, schema_version 1).
// The product is the only source of prices: nothing here or elsewhere in this repository may
// hardcode one.
const money = z.object({ monthly: z.number(), annual: z.number() });

export const pricingSchema = z.object({
	schema_version: z.literal(1),
	currency: z.string(),
	tax: z.literal('none'),
	free: z.object({
		users: z.number(),
		storage_gb: z.number(),
		branches: z.number(),
		apps: z.array(z.string()),
	}),
	apps: z.array(money.extend({ key: z.string(), name_ar: z.string(), name_en: z.string() })),
	extra_user: money.extend({ max_users: z.number() }),
	extra_storage: z.object({
		per_gb_monthly: z.number(),
		block_gb: z.number(),
		block_monthly: z.number(),
		step_gb: z.number(),
		step_gb_after: z.number(),
		step_gb_large: z.number(),
	}),
	onboarding: z.object({ one_time: z.number() }),
	refund_days: z.number(),
});

export type Pricing = z.infer<typeof pricingSchema>;

const DEFAULT_PRICING_URL = 'https://app.liwanos.com/api/v1/public/pricing';
const TIMEOUT_MS = 5000;

let cached: Promise<Pricing | null> | undefined;

// Fetched once per build. Any failure (network, status, invalid shape) returns null, and pages
// then show the "contact us" fallback instead of numbers.
export function getPricing(): Promise<Pricing | null> {
	cached ??= fetchPricing();
	return cached;
}

async function fetchPricing(): Promise<Pricing | null> {
	const url = import.meta.env.PRICING_URL || DEFAULT_PRICING_URL;
	try {
		const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
		if (!response.ok) throw new Error(`HTTP ${response.status}`);
		return pricingSchema.parse(await response.json());
	} catch (error) {
		console.warn(`[pricing] ${url} unavailable, showing the contact fallback:`, error instanceof Error ? error.message : error);
		return null;
	}
}

export function formatMoney(locale: Locale, amount: number, currency: string): string {
	return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
		style: 'currency',
		currency,
		maximumFractionDigits: 0,
	}).format(amount);
}
