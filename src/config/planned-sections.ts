import type { Locale } from '../i18n';

// Sections planned for each page, from docs/decisions/2026-11-07-site-design.md. Shown only by
// PagePlaceholder until the real page is designed; delete an entry when its page is built.
export type PageKey = 'home' | 'apps' | 'app' | 'pricing' | 'security' | 'contact' | 'terms' | 'privacy' | 'refund' | 'dpa';

export const plannedSections: Record<PageKey, Record<Locale, string[]>> = {
	home: {
		ar: ['البطل (hero)', 'شريط الثقة', 'ليوان AI', 'التطبيقات', 'لكل خطوة مكان', 'نظرة على الأسعار', 'البداية', 'أسئلة شائعة', 'دعوة ختامية'],
		en: ['Hero', 'Trust strip', 'Liwan AI', 'Applications', 'Every step has a place', 'Pricing glance', 'Start', 'FAQ', 'Closing call to action'],
	},
	apps: {
		ar: ['العنوان وأربعة أعمدة للمنصة', 'شبكة التطبيقات', 'ليوان، أو أدوات منفصلة؟', 'دعوة ختامية'],
		en: ['Headline and four platform pillars', 'Application grid', 'Liwan, or separate tools?', 'Closing call to action'],
	},
	app: {
		ar: ['العنوان والسعر', 'ثلاث مشكلات: قبل وبعد', 'ماذا يقدم لك', 'ومعك ليوان AI', 'قريبًا (للمسجّل فقط)', 'أسئلة شائعة', 'دعوة ختامية'],
		en: ['Headline and price', 'Three pains: before and after', 'What you get', 'With Liwan AI', 'Soon (register items only)', 'FAQ', 'Closing call to action'],
	},
	pricing: {
		ar: ['الأساس المجاني', 'العملاء ورسائل العملاء', 'مستخدم إضافي وتخزين وإعداد', 'حاسبة الاشتراك', 'في كل اشتراك', 'تجربة ثم استرداد', 'أسئلة شائعة'],
		en: ['Free base', 'CRM and customer messages', 'Extra user, storage and onboarding', 'Subscription calculator', 'In every subscription', 'Trial, then refund', 'FAQ'],
	},
	security: {
		ar: ['بيانات شركتك لشركتك وحدها', 'أربعة أعمدة', 'أين تُحفظ بياناتك', 'العزل', 'من يرى ماذا', 'الدخول الآمن', 'أمان الذكاء الاصطناعي', 'المال لا يمر عبر ليوان', 'خصوصية العملاء', 'أسئلة شائعة'],
		en: ['Your data stays your company\'s', 'Four pillars', 'Where data is kept', 'Isolation', 'Who sees what', 'Secure sign-in', 'AI safety', 'Money never passes through Liwan', 'Customer privacy', 'FAQ'],
	},
	contact: {
		ar: ['تكلّم معنا', 'ثلاثة أسباب للكتابة', 'نموذج التواصل (يُرسل إلى المنتج)', 'ملاحظة للعملاء الحاليين'],
		en: ['Talk to us', 'Three reasons to write', 'Contact form (posts to the product)', 'Note for existing customers'],
	},
	terms: legal(),
	privacy: legal(),
	refund: legal(),
	dpa: legal(),
};

function legal(): Record<Locale, string[]> {
	return {
		ar: ['بالمختصر', 'فهرس المحتوى', 'نص الوثيقة (من المحامي)', 'الإصدارات السابقة'],
		en: ['In short', 'Table of contents', 'Document text (from the lawyer)', 'Previous versions'],
	};
}
