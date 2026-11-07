// Customer-message channels shown on the site. Brand logos come from Simple Icons (CC0-1.0,
// the `simple-icons` package) and are drawn on its 24 x 24 grid; email uses the Lucide outline.
// Each channel's state follows its claim in src/config/claims.ts.
import { siTelegram, siTiktok, siWhatsapp } from 'simple-icons';
import type { ClaimName } from '../config/claims';
import type { IconName } from './icons';

export type Channel = {
	key: ClaimName;
	name: string;
	logo?: { path: string; hex: string };
	icon?: IconName;
};

export const CHANNELS: Channel[] = [
	{ key: 'whatsapp', name: 'واتساب', logo: { path: siWhatsapp.path, hex: siWhatsapp.hex } },
	{ key: 'tiktok', name: 'تيك توك', logo: { path: siTiktok.path, hex: siTiktok.hex } },
	{ key: 'telegram', name: 'تيليجرام', logo: { path: siTelegram.path, hex: siTelegram.hex } },
	{ key: 'email', name: 'البريد', icon: 'mail' },
];
