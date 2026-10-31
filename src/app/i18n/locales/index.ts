import type { Messages } from './en';
import { en } from './en';
import { zhTW } from './zh-TW';

export const LOCALES = {
    en: { label: 'English', messages: en as Messages },
    'zh-TW': { label: '繁體中文', messages: zhTW },
} as const;

export type LocaleCode = keyof typeof LOCALES;
export const DEFAULT_LOCALE: LocaleCode = 'en';
