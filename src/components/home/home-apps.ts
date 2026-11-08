// Home page copy for the application cards rail, the laptop screen and the glass app grid.
// Application names, icons, plans and statuses come from src/content/apps; this file only holds
// the short card copy and the illustrative screen rows (sample data, not customer data).
//
// Tints: the home rail and the glass app grid give every application its own tint (owner,
// 2026-11-08, docs/brand.md "Website-specific choices"). crm and inbox keep their paid colours.
// Everywhere else free applications are ink; use src/lib/app-color.ts there.

export type Category = 'all' | 'sales' | 'team';

export type ShotLine =
	| { kind: 'row'; dot: string; text: string; tag?: string; done?: boolean }
	| { kind: 'bubble'; text: string; me?: boolean }
	| { kind: 'kpi'; items: { value: string; label: string }[] };

export interface HomeApp {
	tag: string;
	desc: string;
	cats: Category[];
	shot: ShotLine[];
}

export const HOME_TINT: Record<string, string> = {
	crm: '#5b8def',
	inbox: '#2ad67a',
	tasks: '#ff8a3d',
	meetings: '#0bb4c4',
	documents: '#f5b82e',
	chat: '#ff4fa3',
	operations: '#9b5cf6',
	ai: '#7c3aed',
};

export const CATEGORIES: { key: Category; label: string }[] = [
	{ key: 'all', label: 'الأساسيات' },
	{ key: 'sales', label: 'المبيعات والعملاء' },
	{ key: 'team', label: 'الفريق والتشغيل' },
];

// Display order on the home page (Liwan AI leads the rail).
export const HOME_ORDER = ['ai', 'crm', 'inbox', 'tasks', 'meetings', 'documents', 'chat', 'operations'];

export const HOME_APPS: Record<string, HomeApp> = {
	ai: {
		tag: 'يجاوبك من بيانات شركتك',
		desc: 'مساعد بالعربي يقرأ عملاءك ومهامك واجتماعاتك، ويرد عليك ويقترح، ولا يغيّر شيئًا إلا بموافقتك.',
		cats: ['all'],
		shot: [
			{ kind: 'bubble', me: true, text: 'وش وضع صفقات هذا الأسبوع؟' },
			{ kind: 'bubble', text: 'عندك 6 صفقات تحتاج متابعة، أهمها شركة الندى (عرض سعر منذ 3 أيام).' },
			{ kind: 'row', dot: 'crm', text: 'المصدر: تطبيق إدارة العملاء', tag: 'الآن' },
		],
	},
	crm: {
		tag: 'لا تضيع صفقة بعد اليوم',
		desc: 'كل فرصة بمرحلتها ومسؤولها، أمام عينك. من أول رسالة إلى إغلاق الصفقة.',
		cats: ['all', 'sales'],
		shot: [
			{ kind: 'kpi', items: [{ value: '24', label: 'فرصة مفتوحة' }, { value: '6', label: 'تحتاج متابعة' }] },
			{ kind: 'row', dot: 'inbox', text: 'شركة الندى · عرض سعر', tag: 'سارة' },
			{ kind: 'row', dot: 'documents', text: 'مؤسسة البيان · تفاوض', tag: 'محمد' },
			{ kind: 'row', dot: 'crm', text: 'متجر وردة · أول تواصل', tag: 'نورة' },
		],
	},
	inbox: {
		tag: 'كل القنوات في صندوق واحد',
		desc: 'واتساب وتيك توك في مكان واحد، وفريقك يرد من صندوق مشترك بلا تكرار ولا ضياع.',
		cats: ['all', 'sales'],
		shot: [
			{ kind: 'bubble', text: 'السلام عليكم، أبي عرض سعر لـ 50 وحدة' },
			{ kind: 'bubble', me: true, text: 'وعليكم السلام نورة، أبشري. أرسل لك العرض خلال ساعة ✓' },
			{ kind: 'row', dot: 'inbox', text: 'واتساب · قبل دقيقة', tag: 'مسند لسارة' },
		],
	},
	tasks: {
		tag: 'لكل مهمة مسؤول',
		desc: 'وزّع العمل على فريقك وتابعه حتى يكتمل. المهام تجي من الرسائل والاجتماعات تلقائيًا.',
		cats: ['all', 'team'],
		shot: [
			{ kind: 'row', dot: 'inbox', text: 'إرسال عرض الندى', tag: 'تم', done: true },
			{ kind: 'row', dot: 'documents', text: 'متابعة مؤسسة البيان', tag: 'اليوم 3 م' },
			{ kind: 'row', dot: 'crm', text: 'تجهيز عقد وردة', tag: 'الخميس' },
			{ kind: 'row', dot: 'operations', text: 'مراجعة فاتورة أبريل', tag: 'الأسبوع القادم' },
		],
	},
	meetings: {
		tag: 'اجتماعات تنتهي بقرارات',
		desc: 'جدولة ومحاضر وتوصيات، لكل توصية مسؤول وموعد، وتتحول لمهمة بضغطة.',
		cats: ['all', 'team'],
		shot: [
			{ kind: 'kpi', items: [{ value: 'الخميس', label: '11:00 ص · 45 د' }, { value: '5', label: 'حاضرون' }] },
			{ kind: 'row', dot: 'meetings', text: 'مراجعة خطة الربع', tag: 'محضر جاهز' },
			{ kind: 'row', dot: 'tasks', text: 'توصية: تحديث قائمة الأسعار', tag: 'محمد · الأحد' },
		],
	},
	documents: {
		tag: 'ملفات شركتك مرتبة',
		desc: 'مستندات بإصدارات وصلاحيات وتاريخ انتهاء، وكل موظف يرى ما يخصه فقط.',
		cats: ['all', 'team'],
		shot: [
			{ kind: 'row', dot: 'operations', text: 'عقد شركة الندى.pdf', tag: 'الإصدار 3' },
			{ kind: 'row', dot: 'crm', text: 'السجل التجاري', tag: 'ينتهي بعد 40 يومًا' },
			{ kind: 'row', dot: 'documents', text: 'قائمة الأسعار 2026', tag: 'المبيعات فقط' },
		],
	},
	chat: {
		tag: 'فريقك في مكان واحد',
		desc: 'محادثات فردية ومجموعات وقنوات، داخل النظام نفسه، بجانب العملاء والمهام.',
		cats: ['all', 'team'],
		shot: [
			{ kind: 'bubble', text: 'سارة: عرض الندى جاهز، أحد يراجعه؟' },
			{ kind: 'bubble', me: true, text: 'محمد: راجعته، تمام. أرسليه' },
			{ kind: 'row', dot: 'chat', text: '#المبيعات · 3 أعضاء', tag: 'الآن' },
		],
	},
	operations: {
		tag: 'موافقات بلا ملاحقة',
		desc: 'طلبات وموافقات بمسارات ومراحل ومراجعين، وسجل كامل لكل خطوة.',
		cats: ['all', 'team'],
		shot: [
			{ kind: 'row', dot: 'inbox', text: 'طلب إجازة · محمد', tag: 'معتمد' },
			{ kind: 'row', dot: 'documents', text: 'طلب شراء · 3 لابتوبات', tag: 'عند المدير المالي' },
			{ kind: 'row', dot: 'crm', text: 'طلب سلفة · نورة', tag: 'قيد المراجعة' },
		],
	},
};
