import type { LocaleCode } from './locales';
import { DEFAULT_LOCALE, LOCALES } from './locales';
import type { MessageKey } from './locales/en';

export type { LocaleCode, MessageKey };
export { DEFAULT_LOCALE, LOCALES };

type PluralSuffix = `${string}_${'one' | 'other'}`;
/** Keys callable via t(): plain keys plus the base name of each plural pair. */
export type TranslationKey =
    | Exclude<MessageKey, PluralSuffix>
    | (MessageKey extends infer K ? (K extends `${infer B}_${'one' | 'other'}` ? B : never) : never);

export type MessageParams = Record<string, string | number>;

/** Settings key (global scope) holding the user's choice; absent = automatic. */
export const LANGUAGE_SETTING_KEY = 'language';

/**
 * The locale in force is remembered here so the NEXT page load knows it before
 * any module runs: module-level strings (`const NOTE = t('…')`) are evaluated at
 * import, long before the stored setting arrives from the server. The server
 * setting stays the source of truth; boot reloads once if the two disagree.
 */
const LOCALE_CACHE_KEY = 'wsScrcpyLocale';

function readCachedLocale(): unknown {
    try {
        return globalThis.localStorage?.getItem(LOCALE_CACHE_KEY);
    } catch {
        return null;
    }
}

function cacheLocale(locale: LocaleCode): void {
    try {
        globalThis.localStorage?.setItem(LOCALE_CACHE_KEY, locale);
    } catch {
        // storage blocked: the next load re-detects, nothing else depends on it
    }
}

let current: LocaleCode = DEFAULT_LOCALE;
const listeners = new Set<(locale: LocaleCode) => void>();

export function isLocaleCode(value: unknown): value is LocaleCode {
    return typeof value === 'string' && Object.hasOwn(LOCALES, value);
}

/**
 * Maps a BCP-47 tag (`zh-Hant-TW`, `zh_tw`, `en-GB`) to a supported locale:
 * exact match first, then Traditional-Chinese regions/scripts, then the bare
 * language. Returns null when nothing supported matches.
 */
export function matchLocale(tag: string): LocaleCode | null {
    const norm = tag.trim().replace(/_/g, '-').toLowerCase();
    for (const code of Object.keys(LOCALES) as LocaleCode[]) {
        if (code.toLowerCase() === norm) return code;
    }
    // Chinese is split by script: Traditional for Taiwan, Hong Kong, Macau and
    // `Hant`; Simplified for the mainland, Singapore, `Hans` and a bare `zh`.
    if (/^zh-(hant|tw|hk|mo)\b/.test(norm)) return 'zh-TW';
    if (norm === 'zh' || /^zh-(hans|cn|sg)\b/.test(norm)) return 'zh-CN';
    const lang = norm.split('-')[0];
    for (const code of Object.keys(LOCALES) as LocaleCode[]) {
        if (code.toLowerCase() === lang) return code;
    }
    return null;
}

/** Stored choice wins; otherwise the first supported browser language. */
export function detectLocale(stored: unknown, browserLanguages: readonly string[]): LocaleCode {
    if (isLocaleCode(stored)) return stored;
    for (const tag of browserLanguages) {
        const hit = matchLocale(tag);
        if (hit) return hit;
    }
    return DEFAULT_LOCALE;
}

export function browserLanguages(): readonly string[] {
    if (typeof navigator === 'undefined') return [];
    return navigator.languages?.length ? navigator.languages : [navigator.language];
}

current = detectLocale(readCachedLocale(), browserLanguages());
if (typeof document !== 'undefined') document.documentElement.lang = current;

export function getLocale(): LocaleCode {
    return current;
}

export function setLocale(locale: LocaleCode): void {
    cacheLocale(locale);
    if (locale === current) return;
    current = locale;
    if (typeof document !== 'undefined') document.documentElement.lang = locale;
    for (const fn of listeners) fn(locale);
}

export function onLocaleChange(fn: (locale: LocaleCode) => void): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
}

/** Picks the catalog entry, applying the plural suffix when `count` is given. */
function lookup(key: TranslationKey, count: number | undefined): string {
    const messages = LOCALES[current].messages;
    if (count !== undefined) {
        const form = new Intl.PluralRules(current).select(count);
        const plural = (messages as Record<string, string>)[`${key}_${form}`];
        if (plural !== undefined) return plural;
        const other = (messages as Record<string, string>)[`${key}_other`];
        if (other !== undefined) return other;
    }
    const table = messages as Record<string, string>;
    const fallback = LOCALES[DEFAULT_LOCALE].messages as Record<string, string>;
    return table[key] ?? fallback[key] ?? key;
}

/**
 * Translates `key`, substituting `{name}` placeholders from `params`. A numeric
 * `count` also selects the plural form (`key_one` / `key_other`) and is
 * formatted with the active locale (other numbers are inserted as written). Unknown placeholders are left as written.
 * The result is plain text: assign it with `textContent`, never `innerHTML`,
 * unless every param is escaped (see htmlEscape.ts).
 */
export function t(key: TranslationKey, params?: MessageParams): string {
    const count = typeof params?.['count'] === 'number' ? params['count'] : undefined;
    const template = lookup(key, count);
    if (!params) return template;
    return template.replace(/\{(\w+)\}/g, (whole, name: string) => {
        const v = params[name];
        if (v === undefined) return whole;
        // Only `count` is a quantity; ports, HTTP statuses, versions and limits are identifiers and stay as written.
        return name === 'count' && typeof v === 'number' ? v.toLocaleString(current) : String(v);
    });
}
