// Copy for the application pages (spec 2J). Names, slugs, icons and status come from
// src/content/apps; this file holds only the page copy. Every capability below comes from the
// product code inventory in the decision document; anything not in it is left out.
// Prices are never written here: pages read them from getPricing().
import type { ClaimName } from '../../config/claims';
import type { Pricing } from '../../lib/pricing';
import { formatMoney } from '../../lib/pricing';

export type MockKind = 'board' | 'rows' | 'bubbles' | 'steps' | 'versions' | 'stats' | 'cal' | 'chat';

export interface Capability {
	title: string;
	line: string;
	mock: MockKind;
	labels: string[];
}

export interface Connection {
	// A slug in src/content/apps, or 'platform' for the account-wide line.
	to: string;
	line: string;
	soon?: boolean;
}

export interface AppCopy {
	capabilities: Capability[];
	connects: Connection[];
	// A claim that is shown as «قريبًا» on this page when the register says soon.
	soonClaims?: { claim: ClaimName; title: string; line: string }[];
}

const ACCOUNT_LINE: Connection = { to: 'platform', line: 'حساب واحد وصلاحيات واحدة لكل تطبيقاتك.' };

export const APP_COPY: Record<string, AppCopy> = {
	crm: {
		capabilities: [
			{ title: 'فرص بمراحلها', line: 'لوحة تعرض كل فرصة في مرحلتها، وتضبط المراحل لتناسب شركتك.', mock: 'board', labels: ['جديدة', 'قيد المتابعة', 'تم الاتفاق'] },
			{ title: 'متابعة في وقتها', line: 'محاولات الاتصال ونتيجة كل مكالمة محفوظة، فلا يُنسى عميل.', mock: 'rows', labels: ['اتصال بالعميل', 'لم يرد: محاولة ثانية', 'متابعة اليوم'] },
			{ title: 'فريق يعرف دوره', line: 'وزّع الفرص على الفريق، وحدّد من يرى ماذا.', mock: 'rows', labels: ['فرصة جديدة', 'مسؤول الفرصة', 'رؤية محدودة'] },
			{ title: 'لوحة للمندوب والمدير', line: 'أرقام فريقك أمام عينك.', mock: 'stats', labels: ['فرص جديدة', 'تم الاتفاق', 'متابعات اليوم'] },
		],
		connects: [
			{ to: 'ai', line: 'ليوان AI يبحث في فرصك ويضبط مراحلك بموافقتك.' },
			{ to: 'inbox', line: 'من محادثة العميل إلى فرصة في العملاء.', soon: true },
			ACCOUNT_LINE,
		],
		soonClaims: [{ claim: 'conversationToOpportunity', title: 'من محادثة إلى فرصة', line: 'محادثة العميل تصير فرصة في تطبيق إدارة العملاء.' }],
	},
	inbox: {
		capabilities: [
			{ title: 'صندوق مشترك لفريقك', line: 'فريقك كله يرد من مكان واحد.', mock: 'bubbles', labels: ['أهلًا، أريد عرض سعر', 'أهلًا بك، نجهّزه الآن'] },
			{ title: 'ربط رسمي بالقنوات', line: 'لا حلول جانبية تعرّض حسابك للحظر.', mock: 'rows', labels: ['واتساب', 'تيك توك', 'قنوات أخرى قريبًا'] },
			{ title: 'حملات لعملائك', line: 'رسائل لعملاء وافقوا على استلامها، ومعها سجل الموافقة.', mock: 'rows', labels: ['حملة عرض الشهر', 'عملاء وافقوا', 'سجل الموافقة'] },
			{ title: 'تقرير لسرعة الرد', line: 'اعرف كم يستغرق فريقك في أول رد.', mock: 'stats', labels: ['أول رد', 'محادثات اليوم', 'بانتظار رد'] },
		],
		connects: [
			{ to: 'crm', line: 'من المحادثة إلى فرصة وعرض سعر برابط دفع.', soon: true },
			{ to: 'ai', line: 'ليوان AI يقترح الرد ويلخّص المحادثة.', soon: true },
			ACCOUNT_LINE,
		],
		soonClaims: [
			{ claim: 'conversationToOpportunity', title: 'من محادثة إلى صفقة', line: 'المحادثة تصير فرصة، وعميلها يبقى سجلًا واحدًا.' },
			{ claim: 'aiReplySuggestion', title: 'ردّ مقترح وملخص', line: 'ليوان AI يقترح ردًا ويلخّص المحادثة.' },
		],
	},
	tasks: {
		capabilities: [
			{ title: 'مهمة بمسؤول وموعد', line: 'عنوان ووصف وموعد وأولوية، ولكل مهمة أكثر من مسؤول.', mock: 'rows', labels: ['إعداد عرض الشركة', 'الأولوية: عالية', 'التسليم: الخميس'] },
			{ title: 'مهام فرعية ومرفقات', line: 'قسّم المهمة إلى خطوات، وأرفق ملفاتك.', mock: 'steps', labels: ['جمع المعلومات', 'كتابة المسودة', 'المراجعة'] },
			{ title: 'تعليقات وإشعارات', line: 'يعرف المسؤول بمهمته فور إسنادها، والنقاش على المهمة نفسها.', mock: 'bubbles', labels: ['أضفت الملاحظات', 'تمام، أراجعها'] },
			{ title: 'صفحة «شغلي»', line: 'ما عليك أن تنجزه أو تقرره أو تتابعه، من تطبيقاتك كلها.', mock: 'rows', labels: ['أنجز', 'قرّر', 'تابع'] },
		],
		connects: [
			{ to: 'ai', line: 'ليوان AI يجيبك عن مهامك.' },
			ACCOUNT_LINE,
		],
	},
	chat: {
		capabilities: [
			{ title: 'محادثات فردية ومجموعات', line: 'وقنوات بأسماء لكل موضوع.', mock: 'bubbles', labels: ['صباح الخير يا فريق', 'صباح النور'] },
			{ title: 'رد وإشارة وتفاعل', line: 'ردود وإشارات @ وتفاعلات، وتعدّل رسائلك أو تحذفها.', mock: 'bubbles', labels: ['@سارة هل وصل الملف؟', 'وصل، شكرًا'] },
			{ title: 'ابحث وثبّت', line: 'ابحث داخل المحادثة، وثبّت الرسائل المهمة.', mock: 'rows', labels: ['رسالة مثبّتة', 'نتيجة البحث', 'معرض المرفقات'] },
			{ title: 'تحكم في التنبيهات', line: 'اكتم المحادثة، واختر مستوى التنبيه.', mock: 'rows', labels: ['كل الرسائل', 'الإشارات فقط', 'مكتومة'] },
		],
		connects: [ACCOUNT_LINE],
	},
	meetings: {
		capabilities: [
			{ title: 'جدولة بلا تعارض', line: 'مكان أو رابط فيديو، وحضور وجدول أعمال، ولا يتعارض اجتماعان لمنظّمهما.', mock: 'cal', labels: ['اجتماع الفريق', 'مراجعة العرض'] },
			{ title: 'اجتماعات متكررة', line: 'سلسلة حتى 60 اجتماعًا، وتعدّل اجتماعًا أو ما بعده.', mock: 'cal', labels: ['كل أحد', 'كل أحد', 'كل أحد'] },
			{ title: 'محضر جاهز', line: 'محضر حر أو بمواضيع، يُحفظ عند الإكمال، ويُطبع أو يُصدَّر PDF.', mock: 'steps', labels: ['الحضور', 'المواضيع', 'القرارات'] },
			{ title: 'توصيات بمسؤول وموعد', line: 'صفحة متابعة، وتنبيه حين يتأخر التنفيذ.', mock: 'rows', labels: ['توصية 1', 'المسؤول', 'الموعد'] },
		],
		connects: [
			{ to: 'ai', line: 'ليوان AI يجيبك عن اجتماعاتك.' },
			ACCOUNT_LINE,
		],
	},
	documents: {
		capabilities: [
			{ title: 'مستندات بإصدارات', line: 'ارفع ملفًا بالاسم نفسه فيُحفظ إصدارًا جديدًا، ويبقى القديم.', mock: 'versions', labels: ['العقد.pdf', 'العقد.pdf', 'العقد.pdf'] },
			{ title: 'كل موظف يرى ما يخصه', line: 'مستند للشركة كلها، أو بصلاحية قراءة وتحرير لأشخاص محددين.', mock: 'rows', labels: ['للشركة كلها', 'قراءة فقط', 'قراءة وتحرير'] },
			{ title: 'تاريخ انتهاء', line: 'اعرف ما ينتهي قريبًا وما انتهى.', mock: 'stats', labels: ['ينتهي قريبًا', 'منتهٍ', 'ساري'] },
			{ title: 'قفل أثناء التحرير', line: 'لا يعدّل اثنان الملف معًا، والمؤرشف يمكن استرجاعه.', mock: 'rows', labels: ['قيد التحرير', 'مؤرشف', 'استرجاع'] },
		],
		connects: [
			{ to: 'ai', line: 'ليوان AI يقرأ ملفات PDF.', soon: true },
			ACCOUNT_LINE,
		],
	},
	operations: {
		capabilities: [
			{ title: 'مسارات بمراحل', line: 'من مرحلة إلى 20 مرحلة، بمراجعين بأسمائهم.', mock: 'steps', labels: ['المدير المباشر', 'المشتريات', 'الإدارة'] },
			{ title: 'طلب من البداية للنهاية', line: 'قدّم الطلب، واسحبه، أو أعد إرساله.', mock: 'steps', labels: ['قُدّم', 'قيد المراجعة', 'معتمد'] },
			{ title: 'اعتماد أو رفض أو إعادة', line: 'بتعليق، ولا يعتمد أحد طلبه بنفسه.', mock: 'rows', labels: ['اعتماد', 'رفض', 'إعادة مع تعليق'] },
			{ title: 'سجل كامل', line: 'كل خطوة محفوظة، وطلباتي وبانتظاري في صفحتين.', mock: 'rows', labels: ['طلباتي', 'بانتظاري', 'سجل الطلب'] },
		],
		connects: [
			{ to: 'ai', line: 'ليوان AI يبحث في طلباتك.' },
			ACCOUNT_LINE,
		],
	},
	// The AI page shows the capabilities exactly as the home AI section does.
	ai: {
		capabilities: [
			{ title: 'يضبط إعداداتك', line: 'يقترح التعديل ويشرح أثره، ولا يطبّقه قبل موافقتك.', mock: 'chat', labels: ['اضبط مراحل المبيعات لتناسب شركتي', 'هذا التعديل المقترح، ولن أطبّقه قبل موافقتك'] },
			{ title: 'يبحث في بياناتك', line: 'يجد ما تسأل عنه، ويذكر مصدر كل نتيجة.', mock: 'chat', labels: ['ابحث عن الفرص المتوقفة بدون متابعة', 'وجدت الفرص التالية'] },
			{ title: 'يجيب ويقارن من كل تطبيقاتك', line: 'جواب واحد من تطبيقاتك، مع مصدره.', mock: 'chat', labels: ['قارن بين شهرين', 'هذه المقارنة من تطبيقاتك'] },
			{ title: 'يعلّمك النظام', line: 'خطوات واضحة من دليل المنصة.', mock: 'chat', labels: ['كيف أضيف مرحلة جديدة؟', 'الخطوة 1: افتح الإعدادات'] },
		],
		connects: [
			{ to: 'crm', line: 'يبحث في فرصك ويضبط مراحلك.' },
			{ to: 'meetings', line: 'يجيبك عن اجتماعاتك.' },
			{ to: 'operations', line: 'يبحث في طلباتك.' },
		],
	},
};

// Capabilities that are not available yet, exactly as the home AI section lists them.
export const AI_SOON = ['يعبّئ النماذج', 'يجهّز التقارير', 'يقرأ ملفات PDF', 'يستورد من Excel', 'يقترح ردًا ويلخّص المحادثة'];

// The price object's key for an application, from its content featureKey («crm.enabled» -> «crm»).
export function priceKey(featureKey?: string): string | undefined {
	return featureKey?.replace(/\.enabled$/, '');
}

export interface PriceLine {
	monthly: string;
	annual: string;
}

export function priceFor(pricing: Pricing | null, featureKey?: string): PriceLine | undefined {
	const key = priceKey(featureKey);
	const price = pricing?.apps.find((app) => app.key === key);
	if (!pricing || !price) return undefined;
	return { monthly: formatMoney('ar', price.monthly, pricing.currency), annual: formatMoney('ar', price.annual, pricing.currency) };
}
