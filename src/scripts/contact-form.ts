// The contact form: validates in the browser, then posts JSON straight to the product. The site
// stores nothing: no cookies, no local storage, no copy of the message. utm_* parameters of the
// page URL travel with the message.
import { checkEmail, MESSAGES, toE164, toLatinDigits } from './contact-validate';

const ENDPOINT = 'https://app.liwanos.com/api/v1/public/contact';
const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=liwanTurnstileReady';

// Product error codes -> Arabic. Anything unknown falls back to the generic message.
const ERROR_TEXT: Record<string, string> = {
	validation_failed: 'راجع بياناتك ثم أعد المحاولة.',
	invalid_email: MESSAGES.emailMalformed,
	business_email_required: MESSAGES.emailPersonal,
	invalid_mobile: MESSAGES.mobile,
	consent_required: MESSAGES.consent,
	turnstile_failed: 'تعذّر التحقق الأمني. أعد المحاولة.',
	turnstile_required: MESSAGES.turnstile,
	rate_limited: 'أرسلت عدة رسائل خلال وقت قصير. حاول بعد قليل.',
	too_many_requests: 'أرسلت عدة رسائل خلال وقت قصير. حاول بعد قليل.',
};
const TURNSTILE_LOAD_ERROR = 'تعذّر تحميل التحقق الأمني. أعد تحميل الصفحة.';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const GENERIC_ERROR = 'تعذّر إرسال رسالتك الآن. حاول مرة أخرى بعد قليل.';
const NETWORK_ERROR = 'تعذّر الوصول إلى الخدمة. تأكد من اتصالك وأعد المحاولة.';

declare global {
	interface Window {
		turnstile?: {
			render(el: HTMLElement, options: Record<string, unknown>): string;
			reset(id?: string): void;
		};
		liwanTurnstileReady?: () => void;
	}
}

const form = document.querySelector<HTMLFormElement>('form[data-contact]');
if (form) init(form);

function init(form: HTMLFormElement): void {
	const siteKey = form.dataset.sitekey ?? '';
	const status = form.querySelector<HTMLElement>('[data-status]')!;
	const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
	const widget = form.querySelector<HTMLElement>('[data-turnstile]');
	const success = document.querySelector<HTMLElement>('[data-success]');
	let token = '';
	let widgetId: string | undefined;

	const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLTextAreaElement;
	const errorEl = (name: string) => form.querySelector<HTMLElement>(`[data-error="${name}"]`)!;

	function setError(name: string, message: string): void {
		const input = name === 'turnstile' ? null : field(name);
		errorEl(name).textContent = message;
		if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
	}
	function clearErrors(): void {
		for (const el of form.querySelectorAll<HTMLElement>('[data-error]')) setError(el.dataset.error!, '');
		status.textContent = '';
		status.dataset.kind = '';
	}

	if (siteKey && widget) {
		window.liwanTurnstileReady = () => {
			widgetId = window.turnstile?.render(widget, {
				sitekey: siteKey,
				language: 'ar',
				theme: 'auto',
				callback: (value: string) => {
					token = value;
					setError('turnstile', '');
				},
				'expired-callback': () => (token = ''),
				'error-callback': () => {
					token = '';
					showLoadError();
				},
			});
		};
		const script = document.createElement('script');
		script.src = TURNSTILE_SRC;
		script.onerror = showLoadError;
		script.async = true;
		script.defer = true;
		document.head.append(script);
	}

	function showLoadError(): void {
		status.textContent = TURNSTILE_LOAD_ERROR;
		status.dataset.kind = 'error';
	}

	// Check one field when the visitor leaves it, so errors appear where they are.
	form.addEventListener('focusout', (event) => {
		const target = event.target as HTMLInputElement;
		if (target.name && target.value !== '') validate(target.name);
	});
	form.addEventListener('input', (event) => {
		const target = event.target as HTMLInputElement;
		if (target.name && target.getAttribute('aria-invalid') === 'true') validate(target.name);
	});

	function validate(name: string): boolean {
		let message = '';
		const value = name === 'consent' || name === 'turnstile' ? '' : field(name).value.trim();
		switch (name) {
			case 'name':
				if (!value) message = MESSAGES.name;
				break;
			case 'company':
				if (!value) message = MESSAGES.company;
				break;
			case 'mobile':
				if (!toE164(value)) message = MESSAGES.mobile;
				break;
			case 'email': {
				const result = checkEmail(value);
				if (result === 'empty') message = MESSAGES.emailEmpty;
				else if (result === 'malformed') message = MESSAGES.emailMalformed;
				else if (result === 'personal') message = MESSAGES.emailPersonal;
				break;
			}
			case 'users':
				if (value && (!/^\d{1,6}$/.test(toLatinDigits(value)) || Number(toLatinDigits(value)) < 1)) message = MESSAGES.users;
				break;
			case 'message':
				if (!value) message = MESSAGES.message;
				break;
			case 'consent':
				if (!(field('consent') as HTMLInputElement).checked) message = MESSAGES.consent;
				break;
			case 'turnstile':
				if (!token) message = MESSAGES.turnstile;
				break;
		}
		setError(name, message);
		return !message;
	}

	form.addEventListener('submit', async (event) => {
		event.preventDefault();
		clearErrors();
		const names = ['name', 'company', 'mobile', 'email', 'users', 'message', 'consent', 'turnstile'];
		const results = names.map(validate);
		if (results.includes(false)) {
			const first = form.querySelector<HTMLElement>('[aria-invalid="true"]');
			first?.focus();
			return;
		}

		const params = new URLSearchParams(window.location.search);
		const payload: Record<string, unknown> = {
			name: field('name').value.trim(),
			company: field('company').value.trim(),
			mobile: toE164(field('mobile').value),
			email: field('email').value.trim(),
			message: field('message').value.trim(),
			lang: 'ar',
			consent: true,
			turnstile_token: token,
		};
		const users = toLatinDigits(field('users').value.trim());
		if (users) payload.users = Number(users);
		for (const key of UTM_KEYS) {
			const value = params.get(key);
			if (value) payload[key] = value.slice(0, 200);
		}

		submit.disabled = true;
		status.textContent = 'نرسل رسالتك...';
		status.dataset.kind = 'info';
		try {
			const response = await fetch(ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				signal: AbortSignal.timeout(15000),
				body: JSON.stringify(payload),
			});
			if (response.ok) {
				form.hidden = true;
				if (success) {
					success.hidden = false;
					success.focus();
				}
				return;
			}
			const body = (await response.json().catch(() => null)) as { error?: string | { code?: string }; code?: string } | null;
			const code = typeof body?.error === 'string' ? body.error : (body?.error?.code ?? body?.code ?? '');
			showFailure(code, response.status);
		} catch {
			status.textContent = NETWORK_ERROR;
			status.dataset.kind = 'error';
		} finally {
			submit.disabled = false;
			// A Turnstile token is single-use.
			token = '';
			if (widgetId !== undefined) window.turnstile?.reset(widgetId);
		}
	});

	function showFailure(code: string, httpStatus: number): void {
		const fieldFor: Record<string, string> = {
			invalid_email: 'email',
			business_email_required: 'email',
			invalid_mobile: 'mobile',
			consent_required: 'consent',
		};
		const text = ERROR_TEXT[code] ?? (httpStatus === 429 ? ERROR_TEXT.rate_limited : GENERIC_ERROR);
		if (fieldFor[code]) setError(fieldFor[code], text);
		status.textContent = text;
		status.dataset.kind = 'error';
	}

	// Last step: only now may the visitor type. Without a site key the form stays disabled.
	if (siteKey) form.querySelector('fieldset')!.disabled = false;
}
