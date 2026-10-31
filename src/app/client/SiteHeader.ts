const REPO_URL = 'https://github.com/siuwai1999/ws-scrcpy-web-mobile';

interface NavTarget {
    label: string;
    targetId: string;
}

const NAV: NavTarget[] = [
    { label: 'Devices', targetId: 'devices' },
    { label: 'Network', targetId: 'network' },
];

const TAB_KEY = 'wsScrcpyHomeTab';

function readStoredTab(): string {
    try {
        const stored = localStorage.getItem(TAB_KEY);
        if (stored && NAV.some((n) => n.targetId === stored)) return stored;
    } catch {
        // storage blocked (private window): fall through to the default
    }
    return NAV[0]!.targetId;
}

/**
 * The site header: brand on the left, the page tabs (Devices, Network) in the
 * middle with a link to the project, and the page's controls (update pill,
 * dependency badge, settings, theme) on the right. The controls are created
 * elsewhere and handed in, so each keeps its own behaviour; the header only
 * lays them out.
 *
 * The tabs switch `body[data-tab]`; CSS (header.css) shows the matching
 * section and hides the other. Devices is the default, and the last choice is
 * remembered per browser.
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
    nav.setAttribute('aria-label', 'Pages');
    const items = new Map<string, HTMLButtonElement>();
    const select = (id: string): void => {
        document.body.dataset['tab'] = id;
        for (const [key, item] of items) {
            if (key === id) item.setAttribute('aria-current', 'page');
            else item.removeAttribute('aria-current');
        }
        try {
            localStorage.setItem(TAB_KEY, id);
        } catch {
            // not persisted; the tab still switches
        }
    };
    for (const { label, targetId } of NAV) {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'site-nav-item';
        item.textContent = label;
        item.addEventListener('click', () => select(targetId));
        items.set(targetId, item);
        nav.appendChild(item);
    }
    select(readStoredTab());
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
