/**
 * True on a phone-sized touch browser: a narrow coarse-pointer viewport, or a
 * phone held sideways (coarse pointer, short viewport). Tablets and desktops
 * are false and keep the windowed layout. Without matchMedia (jsdom) it is false.
 */
const MOBILE_QUERY = '(pointer: coarse) and (max-width: 767px), (pointer: coarse) and (max-height: 500px)';

export function isMobileLayout(): boolean {
    return typeof window.matchMedia === 'function' && window.matchMedia(MOBILE_QUERY).matches;
}
