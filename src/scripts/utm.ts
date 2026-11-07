// Carries campaign attribution into the product: copies the utm_* parameters of the current page
// onto every link marked with data-app-link. Nothing is stored; no other query data is passed.
const params = new URLSearchParams(window.location.search);
const utm = [...params].filter(([key]) => key.startsWith('utm_'));

if (utm.length > 0) {
	document.querySelectorAll<HTMLAnchorElement>('a[data-app-link]').forEach((link) => {
		const url = new URL(link.href);
		for (const [key, value] of utm) url.searchParams.set(key, value);
		link.href = url.toString();
	});
}
