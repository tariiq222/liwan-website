// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

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
			filter: (page) => !page.includes('/brand-kit/'),
			i18n: { defaultLocale: 'ar', locales: { ar: 'ar-SA', en: 'en' } },
		}),
	],
});
