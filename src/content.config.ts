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

export const collections = { apps };
