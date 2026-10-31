import type { LocaleCode } from '../i18n';
import { LOCALES, t } from '../i18n';
import { saveLanguage } from '../i18n/boot';

const AUTO = 'auto';

/**
 * Language picker for the Settings header. Takes effect at once: the choice is
 * stored (or cleared for "automatic") and the page reloads, because screens
 * are built once from the active catalog and are not re-rendered in place.
 */
export function createLanguageSelect(stored: unknown): HTMLSelectElement {
    const select = document.createElement('select');
    select.className = 'language-select';
    select.title = t('settings.language');
    select.setAttribute('aria-label', t('settings.language'));

    const auto = document.createElement('option');
    auto.value = AUTO;
    auto.textContent = t('settings.language.auto');
    select.appendChild(auto);
    for (const [code, { label }] of Object.entries(LOCALES)) {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = label;
        select.appendChild(opt);
    }
    select.value = typeof stored === 'string' && stored in LOCALES ? stored : AUTO;

    select.addEventListener('change', () => {
        const value = select.value;
        select.disabled = true;
        const choice: LocaleCode | null = value === AUTO ? null : (value as LocaleCode);
        void saveLanguage(choice)
            .catch((e) => console.error('[i18n] saving language failed', e))
            .finally(() => location.reload());
    });
    return select;
}
