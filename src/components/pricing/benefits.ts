// Five benefit lines per paid application, keyed by the pricing object's application key.
import { claim } from '../../config/claims';

// Channels named only while their claims are available.
const channels = [claim('whatsapp') === 'available' && 'واتساب', claim('tiktok') === 'available' && 'تيك توك'].filter(Boolean).join(' و');
const inboxLead = channels ? `${channels} في صندوق واحد` : 'قنوات عملائك في صندوق واحد';

// Wording stays inside what the applications' own pages already claim (src/content/apps).
export const BENEFITS: Record<string, string[]> = {
	crm: [
		'كل فرصة بمرحلتها ومسؤولها',
		'لوحة تعرض وضع المبيعات كله',
		'فريقك يتابع العملاء من مكان واحد',
		'ليوان AI يجيب من بيانات العملاء',
		'يشتغل مع بقية تطبيقاتك',
	],
	inbox: [
		inboxLead,
		'فريقك يرد من صندوق مشترك',
		'رسائل عملائك لا تضيع بين الجوالات',
		'محادثات كل عميل في مكان واحد',
		'يشتغل مع بقية تطبيقاتك',
	],
};
