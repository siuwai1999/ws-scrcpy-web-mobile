import { DEBUG_STORAGE_KEY } from './debugLog';

/**
 * Opt-in on-screen console for devices with no dev tools (phones, iPads).
 * Load the page with `?debug` in the URL: console output, uncaught errors and
 * unhandled rejections are mirrored into a strip at the bottom of the screen,
 * and the debug flag that `debugLog` reads is switched on. Does nothing
 * otherwise. The strip is a popover so it stays above open dialogs, and it
 * ignores touches.
 */
export function installOnScreenConsole(): void {
    if (!location.search.includes('debug')) return;
    try {
        localStorage.setItem(DEBUG_STORAGE_KEY, 'true');
    } catch {
        // storage blocked: debugLog stays off, the strip still works
    }

    const lines: string[] = [];
    let box: HTMLElement | undefined;

    const show = (): void => {
        if (!box) {
            box = document.createElement('div');
            box.setAttribute('popover', 'manual');
            box.style.cssText =
                'position:fixed;inset:auto 0 0 0;margin:0;max-height:45vh;overflow:hidden;background:#000d;color:#0f0;font:10px/1.3 monospace;padding:4px;pointer-events:none;white-space:pre-wrap;word-break:break-all;border:0';
            document.body.appendChild(box);
        }
        box.textContent = lines.join('\n');
        try {
            box.hidePopover();
            box.showPopover();
        } catch {
            // popover unsupported: the strip is simply not shown
        }
    };

    const push = (level: string, args: unknown[]): void => {
        const text = args
            .map((a) => (a instanceof Error ? `${a.name}: ${a.message}` : typeof a === 'string' ? a : safeJson(a)))
            .join(' ');
        lines.push(`[${level}] ${text}`.slice(0, 300));
        if (lines.length > 18) lines.shift();
        if (document.body) show();
    };

    for (const level of ['log', 'info', 'warn', 'error'] as const) {
        const original = console[level].bind(console);
        console[level] = (...args: unknown[]): void => {
            original(...args);
            push(level, args);
        };
    }
    window.addEventListener('error', (e) => push('uncaught', [e.message, `${e.filename}:${e.lineno}`]));
    window.addEventListener('unhandledrejection', (e) => push('rejection', [e.reason]));
}

function safeJson(value: unknown): string {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}
