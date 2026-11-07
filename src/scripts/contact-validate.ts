// Pure checks for the contact form. No DOM, no storage. Messages are the Arabic wording shown
// under each field.

export function toLatinDigits(value: string): string {
	// Arabic-Indic digits are U+0660..U+0669.
	return value.replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x660));
}

// Providers that sell personal mailboxes. A match is "provider.tld" (or provider.co.xx), so a
// company domain such as mail.example.com or live.example.sa is not caught.
const PERSONAL_PROVIDER =
	/^(?:gmail|googlemail|hotmail|outlook|live|msn|yahoo|ymail|icloud|aol|yandex|gmx|zoho)\.(?:com|net|[a-z]{2}|(?:com?|net|org)\.[a-z]{2})$/;
// Proton's brands are refused in any top-level domain.
const PROTON = /^(?:proton|protonmail|pm)\.[a-z.]+$/;
const PERSONAL_EXACT = new Set(['me.com', 'mac.com', 'mail.com']);

export function isPersonalMailDomain(domain: string): boolean {
	const d = domain.trim().toLowerCase();
	return PERSONAL_EXACT.has(d) || PERSONAL_PROVIDER.test(d) || PROTON.test(d);
}

export type EmailCheck = 'ok' | 'empty' | 'malformed' | 'personal';

export function checkEmail(raw: string): EmailCheck {
	const value = raw.trim();
	if (!value) return 'empty';
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'malformed';
	return isPersonalMailDomain(value.slice(value.lastIndexOf('@') + 1)) ? 'personal' : 'ok';
}

// A Saudi mobile: nine digits starting with 5, typed with or without 0, 966 or +966.
// Returns the E.164 form, or null.
export function toE164(raw: string): string | null {
	let digits = toLatinDigits(raw).replace(/[\s\-().+]/g, '');
	if (digits.startsWith('00966')) digits = digits.slice(5);
	else if (digits.startsWith('966')) digits = digits.slice(3);
	else if (digits.startsWith('0')) digits = digits.slice(1);
	return /^5\d{8}$/.test(digits) ? `+966${digits}` : null;
}

export const MESSAGES = {
	name: 'اكتب اسمك',
	company: 'اكتب اسم شركتك',
	mobile: 'اكتب جوالًا سعوديًا يبدأ بـ 5',
	emailEmpty: 'اكتب بريد شركتك',
	emailMalformed: 'البريد غير صحيح',
	emailPersonal: 'اكتب بريد شركتك، لا بريدًا شخصيًا',
	users: 'اكتب رقمًا صحيحًا من 1 فأكثر',
	message: 'اكتب رسالتك',
	consent: 'وافق على سياسة الخصوصية للمتابعة',
	turnstile: 'أكّد أنك لست برنامجًا آليًا',
} as const;
