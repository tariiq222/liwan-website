import { ar } from './ar';
import { en } from './en';

export const LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export type DictKey = keyof typeof ar;

const dictionaries: Record<Locale, Record<DictKey, string>> = { ar, en };

export const DIRECTION: Record<Locale, 'rtl' | 'ltr'> = { ar: 'rtl', en: 'ltr' };

export function t(locale: Locale, key: DictKey): string {
	return dictionaries[locale][key];
}

export function otherLocale(locale: Locale): Locale {
	return locale === 'ar' ? 'en' : 'ar';
}

// Arabic lives at the root, English under /en. Paths always end with a slash (trailingSlash: 'always').
export function localePath(locale: Locale, path: string): string {
	const clean = path.startsWith('/') ? path : `/${path}`;
	const withSlash = clean.endsWith('/') ? clean : `${clean}/`;
	return locale === 'ar' ? withSlash : `/en${withSlash}`;
}
