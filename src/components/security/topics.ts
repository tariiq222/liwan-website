// Security page content. Every item is published only when its claim is available: hosting is
// gated by src/config/claims.ts; the rest are the platform statements already approved for the
// home page and the application pages. Backups, recovery targets, two-step sign-in and privacy
// tools are hidden in the register and appear nowhere here.
import { getCollection } from 'astro:content';
import { claim } from '../../config/claims';
import type { IconName } from '../../brand/icons';

export interface Topic {
	icon: IconName;
	title: string;
	line: string;
	show: boolean;
}

export const pillars: Topic[] = [
	{ icon: 'map-pin', title: 'مستضاف في السعودية', line: 'بياناتك على خوادم داخل المملكة.', show: claim('saudiHosting') === 'available' },
	{ icon: 'database', title: 'قاعدة بيانات خاصة بشركتك', line: 'لا تشاركها مع أي شركة أخرى.', show: true },
	{ icon: 'lock', title: 'صلاحيات دقيقة', line: 'كل موظف يرى ما يخصه فقط.', show: true },
].filter((p) => p.show);

// The approvals line names the application from src/content/apps instead of retyping it.
export async function getSections(): Promise<Topic[]> {
	const operations = (await getCollection('apps')).find((entry) => entry.data.slug === 'operations')?.data.name.ar;
	return [
		{ icon: 'map-pin', title: 'أين تُحفظ بياناتك', line: 'على خوادم مستضافة داخل السعودية.', show: claim('saudiHosting') === 'available' },
		{ icon: 'layers', title: 'عزل كامل بين الشركات', line: 'لكل شركة قاعدة بياناتها الخاصة، ولا تختلط ببيانات غيرها.', show: true },
		{ icon: 'users', title: 'من يرى ماذا', line: 'تحدد لكل موظف ما يراه في كل تطبيق، ولا يرى غيره.', show: true },
		{ icon: 'sparkles', title: 'ليوان AI يلتزم بصلاحياتك', line: 'يرى ما تراه أنت فقط، ولا يغيّر شيئًا إلا بموافقتك.', show: true },
		{
			icon: 'clipboard-check',
			title: 'موافقات بسجل كامل',
			line: `كل طلب وكل موافقة تبقى مسجلة في ${operations}.`,
			show: Boolean(operations),
		},
	].filter((s) => s.show);
}

export const faq = [
	{ q: 'هل تتشارك الشركات قاعدة بيانات واحدة؟', a: 'لا. لكل شركة قاعدة بيانات خاصة بها.' },
	{ q: 'هل يرى ليوان AI بيانات لا أملك صلاحيتها؟', a: 'لا. يعمل بصلاحياتك أنت، ولا يغيّر شيئًا إلا بموافقتك.' },
	{ q: 'هل يرى كل موظف كل شيء؟', a: 'لا. تحدد لكل موظف ما يراه في كل تطبيق.' },
];
