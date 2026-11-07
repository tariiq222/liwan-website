// Content flags for claims the site may make. A claim is published only when its state is
// 'available'. States change only when the product session's claims register changes
// (webvue repo, .scratch/release1-launch/site-contract.md section 6); never edit one on a hunch.
export type ClaimState = 'available' | 'soon' | 'hidden';

const claims = {
	saudiHosting: 'hidden',
	backupsRiyadh: 'hidden',
	twoStepSignIn: 'hidden',
	privacyTools: 'hidden',
	whatsapp: 'available',
	tiktok: 'available',
	telegram: 'soon',
	email: 'soon',
	conversationToOpportunity: 'soon',
	aiReplySuggestion: 'soon',
} as const satisfies Record<string, ClaimState>;

export type ClaimName = keyof typeof claims;

export function claim(name: ClaimName): ClaimState {
	return claims[name];
}
