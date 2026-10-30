// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ParamsStreamScrcpy } from '../../../../types/ParamsStreamScrcpy';
import type { BasePlayer } from '../../../player/BasePlayer';
import Size from '../../../Size';
import VideoSettings from '../../../VideoSettings';

vi.mock('../../../public/startStream', () => ({
    startStream: () => ({ stop: () => undefined }),
}));

import { ConnectModal } from '../ConnectModal';

const params = { udid: 'serial-1', hostname: '', port: 0 } as unknown as ParamsStreamScrcpy;
const videoSettings = new VideoSettings({
    bitrate: 1,
    maxFps: 30,
    iFrameInterval: 2,
    bounds: new Size(640, 640),
    displayId: 0,
});

function setMobile(mobile: boolean): void {
    window.matchMedia = ((query: string) => ({ matches: mobile, media: query })) as typeof window.matchMedia;
}

describe('ConnectModal layout', () => {
    beforeEach(() => {
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
    });

    afterEach(() => {
        document.body.querySelectorAll('dialog').forEach((d) => {
            d.remove();
        });
        // @ts-expect-error restore jsdom's lack of matchMedia
        delete window.matchMedia;
    });

    it('is full screen on a phone', () => {
        setMobile(true);
        new ConnectModal(params, {} as BasePlayer, true, videoSettings, 'Pixel');
        expect(document.querySelector('dialog.connect-modal')?.classList.contains('connect-modal--mobile')).toBe(true);
    });

    it('stays the plain dialog on a tablet or desktop', () => {
        setMobile(false);
        new ConnectModal(params, {} as BasePlayer, true, videoSettings, 'Pixel');
        expect(document.querySelector('dialog.connect-modal')?.classList.contains('connect-modal--mobile')).toBe(false);
    });
});
