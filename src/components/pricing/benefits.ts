// Five benefit lines per paid application, keyed by the pricing object's application key.
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
		'واتساب وتيك توك في صندوق واحد',
		'فريقك يرد من صندوق مشترك',
		'رسائل عملائك لا تضيع بين الجوالات',
		'محادثات كل عميل في مكان واحد',
		'يشتغل مع بقية تطبيقاتك',
	],
};
