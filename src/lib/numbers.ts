// Owner decision 2026-11-08: every number on the site uses Latin digits (0–9), Arabic pages
// included. Format numbers and money through this locale only; never type Arabic-Indic digits
// (٠–٩) into copy.
export const NUMBER_LOCALE = 'ar-SA-u-nu-latn';

// The new Saudi riyal sign (SAMA, 2025; Unicode U+20C1). Fonts rarely carry it yet, so the site
// loads a one-glyph font, «Saudi Riyal» (public/fonts/saudi-riyal.woff2, drawn from
// public/brand/currency/sar.svg), ahead of every text font for this code point only.
export const SAR_SIGN = '⃁';

// Money for every page and script: the riyal sign sits to the left of the number with a
// non-breaking space (after the number in Arabic text, which reads right to left; before it in
// English). Other currencies keep their standard format.
export function moneyFormatter(currency: string, locale: 'ar' | 'en' = 'ar'): { format: (amount: number) => string } {
	if (currency !== 'SAR') {
		const intl = new Intl.NumberFormat(locale === 'ar' ? NUMBER_LOCALE : 'en-US', { style: 'currency', currency, maximumFractionDigits: 0 });
		return { format: (amount) => intl.format(amount) };
	}
	const number = new Intl.NumberFormat(locale === 'ar' ? NUMBER_LOCALE : 'en-US', { maximumFractionDigits: 0 });
	return {
		format: (amount) => (locale === 'ar' ? `${number.format(amount)} ${SAR_SIGN}` : `${SAR_SIGN} ${number.format(amount)}`),
	};
}

// The currency word after a price unit, for example «⃁ / سنة».
export function currencyUnit(currency: string): string {
	return currency === 'SAR' ? SAR_SIGN : currency;
}
