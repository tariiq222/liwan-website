// Free months of the annual plan, derived from the pricing object (12 minus annual / monthly of
// the extra-user price), the same ratio the calculator uses. Nothing here knows a price.
import type { Pricing } from '../lib/pricing';
import { formatNumber } from './pricing-format';

export function annualFreeMonths(pricing: Pricing): number {
	const { monthly, annual } = pricing.extra_user;
	return monthly > 0 ? Math.max(0, Math.round(12 - annual / monthly)) : 0;
}

// «شهران مجانًا» · «3 أشهر مجانًا» · «11 شهرًا مجانًا»; empty when the annual plan saves nothing.
export function freeMonthsLabel(months: number): string {
	if (months <= 0) return '';
	if (months === 1) return 'شهر مجانًا';
	if (months === 2) return 'شهران مجانًا';
	return `${formatNumber(months)} ${months <= 10 ? 'أشهر' : 'شهرًا'} مجانًا`;
}
