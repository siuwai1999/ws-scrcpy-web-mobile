import type { Messages } from './en';
import { en } from './en';
import { ja } from './ja';
import { zhCN } from './zh-CN';
import { zhTW } from './zh-TW';

export const LOCALES = {
    en: { label: 'English', messages: en as Messages },
    'zh-TW': { label: '繁體中文', messages: zhTW },
    'zh-CN': { label: '简体中文', messages: zhCN },
    ja: { label: '日本語', messages: ja },
} as const;

export type LocaleCode = keyof typeof LOCALES;
export const DEFAULT_LOCALE: LocaleCode = 'en';

/** Locales that ship translated copies of the static help guides (`public/help/<guide>.<locale>.html`); the others read the English guide. */
export const HELP_GUIDE_LOCALES: readonly LocaleCode[] = ['zh-TW', 'zh-CN'];
