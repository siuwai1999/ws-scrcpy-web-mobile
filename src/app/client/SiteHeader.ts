const REPO_URL = 'https://github.com/siuwai1999/ws-scrcpy-web-mobile';

interface NavTarget {
    label: string;
    targetId: string;
}

const NAV: NavTarget[] = [
    { label: 'Devices', targetId: 'devices' },
    { label: 'Network', targetId: 'network' },
];

/**
 * The site header: brand on the left, section navigation in the middle, and
 * the page's controls (update pill, dependency badge, settings, theme) on the
 * right. The controls are created elsewhere and handed in, so each keeps its
 * own behaviour; the header only lays them out.
 *
 * Navigation scrolls to a section by id rather than using `#id` links: the
 * stream pages route on the URL hash (`#!action=...`), and a bare fragment
 * would be read as a navigation.
 */
export function createSiteHeader(actions: HTMLElement[]): HTMLElement {
    const header = document.createElement('header');
    header.className = 'site-header';

    const brand = document.createElement('a');
    brand.className = 'site-brand';
    brand.href = location.pathname;
    const logo = document.createElement('img');
    logo.src = 'favicon.png';
    logo.alt = '';
    logo.width = 24;
    logo.height = 24;
    const name = document.createElement('span');
    name.textContent = 'Android Power Tools';
    brand.append(logo, name);

    const nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.setAttribute('aria-label', 'Sections');
    for (const { label, targetId } of NAV) {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'site-nav-item';
        item.textContent = label;
        item.addEventListener('click', () => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        nav.appendChild(item);
    }
    const repo = document.createElement('a');
    repo.className = 'site-nav-item';
    repo.href = REPO_URL;
    repo.target = '_blank';
    repo.rel = 'noopener noreferrer';
    repo.textContent = 'GitHub';
    nav.appendChild(repo);

    const right = document.createElement('div');
    right.className = 'site-header-actions';
    right.append(...actions);

    header.append(brand, nav, right);
    return header;
}
