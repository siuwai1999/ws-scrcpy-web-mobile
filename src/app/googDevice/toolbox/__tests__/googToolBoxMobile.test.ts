// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';

// The icons are SVG imports, which are irrelevant here and need a bundler.
vi.mock('../../../ui/SvgImage', () => ({
    default: {
        Icon: new Proxy({}, { get: (_target, key) => String(key) }),
        create: () => document.createElement('span'),
    },
}));

import type { BasePlayer } from '../../../player/BasePlayer';
import type { StreamClientScrcpy } from '../../client/StreamClientScrcpy';
import { GoogToolBox } from '../GoogToolBox';

function build(mobile: boolean): HTMLElement {
    const client = {
        sendMessage: () => undefined,
        setHandleKeyboardEvents: () => undefined,
        toggleUhid: () => undefined,
        setDpadMode: () => undefined,
        refreshStream: () => undefined,
        getDeviceName: () => 'device',
    } as unknown as StreamClientScrcpy;
    const player = {
        getName: () => 'fake',
        supportsScreenshot: false,
        setShowQualityStats: () => undefined,
    } as unknown as BasePlayer;
    return GoogToolBox.createToolBox('device-1', player, client, 'phone', mobile).getHolderElement();
}

describe('GoogToolBox phone layout', () => {
    it('keeps back, home, overview and a more button on the bar', () => {
        const holder = build(true);
        const titles = Array.from(holder.querySelectorAll(':scope > button')).map((b) => b.getAttribute('title'));
        expect(titles).toEqual(['Back', 'Home', 'Overview', 'More']);
    });

    it('moves every other control into the more menu, closed until opened', () => {
        const holder = build(true);
        const menu = holder.querySelector('.control-more-menu') as HTMLElement;
        expect(menu.hidden).toBe(true);
        expect(menu.querySelector('button[title="Power"]')).toBeTruthy();
        expect(menu.querySelector('button[title="Refresh stream"]')).toBeTruthy();

        (holder.querySelector('button[title="More"]') as HTMLButtonElement).click();
        expect(menu.hidden).toBe(false);
        (holder.querySelector('button[title="More"]') as HTMLButtonElement).click();
        expect(menu.hidden).toBe(true);
    });

    it('keeps the full column toolbar on tablet and desktop', () => {
        const holder = build(false);
        expect(holder.querySelector('.control-more-menu')).toBeNull();
        expect(holder.querySelector('button[title="Power"]')).toBeTruthy();
    });
});
