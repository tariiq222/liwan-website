import { APP_URL } from '../config/site';
import type { Locale } from '../i18n';

// Links into the product. Every one carries the visitor's language; the client script in
// src/scripts/utm.ts adds the page's utm_* parameters to links marked with data-app-link.
export function registerUrl(locale: Locale): string {
	return `${APP_URL}/register?lang=${locale}`;
}

export function loginUrl(locale: Locale): string {
	return `${APP_URL}/login?lang=${locale}`;
}
