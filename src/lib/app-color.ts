// The one colour of each application (docs/brand.md, "Application colours").
// Free applications share the brand ink; each paid application has a tile colour and a deeper
// button shade, defined as tokens in src/styles/tokens.css. Never invent a colour here.

type AppEntry = { slug: string; plan: 'paid' | 'free' };

const PAID_SLUGS = new Set(['crm', 'inbox', 'projects', 'hr', 'finance', 'appointments']);

export interface AppColor {
	// Tile and dot background.
	tile: string;
	// Text and icon colour on the tile.
	on: string;
	// Button background with readable white text.
	action: string;
}

export function appColor(app: AppEntry): AppColor {
	if (app.plan === 'paid' && PAID_SLUGS.has(app.slug)) {
		return {
			tile: `var(--app-${app.slug})`,
			on: '#ffffff',
			action: `var(--app-${app.slug}-action)`,
		};
	}
	return { tile: 'var(--app-free)', on: 'var(--app-free-on)', action: 'var(--accent)' };
}

// Inline style that exposes the colour as --app-tile, --app-on and --app-action.
export function appColorStyle(app: AppEntry): string {
	const c = appColor(app);
	return `--app-tile: ${c.tile}; --app-on: ${c.on}; --app-action: ${c.action};`;
}
