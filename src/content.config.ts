import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ICONS, type IconName } from './brand/icons';

const iconNames = Object.keys(ICONS) as [IconName, ...IconName[]];

const localized = z.object({ ar: z.string(), en: z.string() });

// One file per application. Navigation, the home grid and /apps/[slug] all read this folder,
// so adding an application is adding a file. `hidden` appears nowhere.
const apps = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/apps' }),
	schema: z.object({
		slug: z.string(),
		order: z.number().int(),
		icon: z.enum(iconNames),
		status: z.enum(['available', 'soon', 'hidden']),
		plan: z.enum(['paid', 'free']),
		featureKey: z.string().optional(),
		name: localized,
		headline: localized,
		summary: localized,
	}),
});

// Legal pages: one Markdown file per page per locale (src/content/legal/<locale>/<slug>.md).
// The text is the lawyer's; `status: draft` keeps every legal page out of search engines.
const legal = defineCollection({
	loader: glob({ pattern: '*/*.md', base: './src/content/legal' }),
	schema: z.object({
		page: z.enum(['terms', 'privacy', 'refund', 'dpa']),
		locale: z.enum(['ar', 'en']),
		title: z.string(),
		version: z.string(),
		updated: z.coerce.date(),
		status: z.enum(['draft', 'final']),
		// The short «بالمختصر» box: three plain-language points.
		summary: z.array(z.string()).length(3),
	}),
});

export const collections = { apps, legal };
