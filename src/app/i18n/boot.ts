import { settingsService } from '../client/SettingsService';
import type { LocaleCode } from './index';
import { browserLanguages, detectLocale, getLocale, LANGUAGE_SETTING_KEY, setLocale } from './index';

/**
 * Resolves the UI language from the stored setting (falling back to the
 * browser's languages) and activates it. Call after the global settings cache
 * is warm and before any UI is built; a settings failure leaves the browser
 * detection result in place.
 */
export async function applyStoredLanguage(): Promise<void> {
    await settingsService.loadGlobal().catch(() => {});
    const stored = settingsService.getGlobalCached()[LANGUAGE_SETTING_KEY];
    const target = detectLocale(stored, browserLanguages());
    if (target === getLocale()) return;
    // The page was built with the remembered locale (module-level strings
    // included); a different stored one needs a rebuild. The cache is updated
    // first, so the reload settles instead of looping.
    setLocale(target);
    location.reload();
}

/** Persists an explicit choice; `null` returns to automatic detection. */
export async function saveLanguage(code: LocaleCode | null): Promise<void> {
    // Remember it for the reload that follows, before the request can fail.
    setLocale(detectLocale(code, browserLanguages()));
    await settingsService.patchGlobal({ [LANGUAGE_SETTING_KEY]: code });
}
