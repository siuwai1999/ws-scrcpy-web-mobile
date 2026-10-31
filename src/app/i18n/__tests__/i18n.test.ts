import { afterEach, describe, expect, it } from 'vitest';
import { detectLocale, getLocale, LOCALES, matchLocale, onLocaleChange, setLocale, t } from '../index';
import { en } from '../locales/en';

afterEach(() => setLocale('en'));

describe('catalogs', () => {
    it('every locale has exactly the English keys', () => {
        for (const { messages } of Object.values(LOCALES)) {
            expect(Object.keys(messages).sort()).toEqual(Object.keys(en).sort());
        }
    });

    it('every locale keeps the same {placeholders} as English', () => {
        const names = (s: string): string[] => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1] ?? '').sort();
        for (const { messages } of Object.values(LOCALES)) {
            for (const [key, value] of Object.entries(en)) {
                expect(names((messages as Record<string, string>)[key] ?? ''), key).toEqual(names(value));
            }
        }
    });
});

describe('matchLocale / detectLocale', () => {
    it('maps Traditional Chinese variants to zh-TW', () => {
        for (const tag of ['zh-TW', 'zh_tw', 'zh-Hant', 'zh-Hant-TW', 'zh-HK']) {
            expect(matchLocale(tag), tag).toBe('zh-TW');
        }
    });
    it('maps English regions to en and rejects unsupported', () => {
        expect(matchLocale('en-GB')).toBe('en');
        expect(matchLocale('fr-FR')).toBeNull();
    });
    it('stored choice beats the browser; browser beats the default', () => {
        expect(detectLocale('en', ['zh-TW'])).toBe('en');
        expect(detectLocale(undefined, ['fr', 'zh-Hant'])).toBe('zh-TW');
        expect(detectLocale('xx', ['fr'])).toBe('en');
    });
});

describe('t()', () => {
    it('translates and follows the active locale', () => {
        expect(t('common.cancel')).toBe('cancel');
        setLocale('zh-TW');
        expect(t('common.cancel')).toBe('取消');
    });
    it('selects plural forms and formats the count', () => {
        expect(t('scan.hostCount', { count: 1 })).toBe('1 host');
        expect(t('scan.hostCount', { count: 1234 })).toBe('1,234 hosts');
    });
    it('leaves unknown placeholders and falls back to the key', () => {
        expect(t('common.cancel', { x: 1 })).toBe('cancel');
        expect(t('nope.missing' as never)).toBe('nope.missing');
    });
    it('notifies listeners once per change', () => {
        const seen: string[] = [];
        const off = onLocaleChange((l) => seen.push(l));
        setLocale('zh-TW');
        setLocale('zh-TW');
        off();
        setLocale('en');
        expect(seen).toEqual(['zh-TW']);
        expect(getLocale()).toBe('en');
    });
});
