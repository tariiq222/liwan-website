// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// While any legal text is still a draft, the legal pages carry noindex and stay out of the sitemap.
// Paths resolve from this file, so the config loads from any working directory.
const legalDir = new URL('./src/content/legal/', import.meta.url);
const legalDraft = ['ar', 'en'].some((l) => {
	const dir = new URL(`${l}/`, legalDir);
	return readdirSync(dir).some((f) => /^status:\s*draft\s*$/m.test(readFileSync(new URL(f, dir), 'utf8')));
});
const legalPaths = /\/(terms|privacy|refund|dpa)\/$/;

export default defineConfig({
	site: 'https://liwanos.com',
	output: 'static',
	trailingSlash: 'always',
	i18n: {
		defaultLocale: 'ar',
		locales: ['ar', 'en'],
		routing: { prefixDefaultLocale: false },
	},
	integrations: [
		sitemap({
			filter: (page) => !page.includes('/brand-kit/') && !(legalDraft && legalPaths.test(page)),
			i18n: { defaultLocale: 'ar', locales: { ar: 'ar-SA', en: 'en' } },
		}),
	],
});
