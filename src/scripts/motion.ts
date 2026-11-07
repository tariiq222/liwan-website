// Site-wide motion: scroll entrances ([data-reveal], .mark-anim) and the pointer spotlight
// ([data-spotlight]). The `js` class on <html> is set inline in the layout head, so content
// stays visible when scripts do not run.

const reveal = new IntersectionObserver(
	(entries) => {
		for (const entry of entries) {
			if (!entry.isIntersecting) continue;
			entry.target.classList.add('is-in');
			reveal.unobserve(entry.target);
		}
	},
	{ rootMargin: '0px 0px -8% 0px', threshold: 0.15 },
);

export function observeReveal(root: ParentNode = document): void {
	root.querySelectorAll('[data-reveal], .mark-anim').forEach((el) => reveal.observe(el));
}

function trackSpotlight(event: PointerEvent): void {
	const card = (event.target as Element | null)?.closest<HTMLElement>('[data-spotlight]');
	if (!card) return;
	const box = card.getBoundingClientRect();
	card.style.setProperty('--mx', `${event.clientX - box.left}px`);
	card.style.setProperty('--my', `${event.clientY - box.top}px`);
}

observeReveal();
document.addEventListener('pointermove', trackSpotlight, { passive: true });
