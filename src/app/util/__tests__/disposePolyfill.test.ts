import { describe, expect, it } from 'vitest';
import { installDisposeSymbols } from '../disposePolyfill';

describe('installDisposeSymbols', () => {
    it('defines both symbols when the browser lacks them (iOS Safari)', () => {
        const host: { dispose?: symbol; asyncDispose?: symbol } = {};
        installDisposeSymbols(host);
        expect(typeof host.dispose).toBe('symbol');
        expect(typeof host.asyncDispose).toBe('symbol');
        expect(host.dispose).toBe(Symbol.for('Symbol.dispose'));
    });

    it('leaves a native symbol alone', () => {
        const native = Symbol('native');
        const host: { dispose?: symbol; asyncDispose?: symbol } = { dispose: native };
        installDisposeSymbols(host);
        expect(host.dispose).toBe(native);
        expect(typeof host.asyncDispose).toBe('symbol');
    });
});
