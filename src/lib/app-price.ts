import type { Pricing } from './pricing';
import { formatMoney } from './pricing';

// The price object's key for an application, from its content featureKey («crm.enabled» -> «crm»).
export function priceKey(featureKey?: string): string | undefined {
	return featureKey?.replace(/\.enabled$/, '');
}

export interface PriceLine {
	monthly: string;
	annual: string;
}

// An application's formatted prices, or undefined when pricing is unavailable or the app has none.
export function priceFor(pricing: Pricing | null, featureKey?: string): PriceLine | undefined {
	const price = pricing?.apps.find((app) => app.key === priceKey(featureKey));
	if (!pricing || !price) return undefined;
	return { monthly: formatMoney('ar', price.monthly, pricing.currency), annual: formatMoney('ar', price.annual, pricing.currency) };
}
