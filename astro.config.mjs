// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';

// While any legal text is still a draft, the legal pages carry noindex and stay out of the sitemap.
const legalDraft = ['ar', 'en'].some((l) =>
	readdirSync(`./src/content/legal/${l}`).some((f) => /^status:\s*draft\s*$/m.test(readFileSync(`./src/content/legal/${l}/${f}`, 'utf8'))),
);
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
