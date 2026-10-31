import type { MessageParams, TranslationKey } from './index';
import { t } from './index';

/**
 * Server error strings the UI shows as they arrive. The server keeps its
 * messages in English (they are also logged and read by API clients), so the
 * client maps the ones users can actually meet to catalog entries and shows
 * anything unknown as written.
 */
const EXACT = new Map<string, TranslationKey>([
    ['method not allowed', 'srv.m0'],
    ['this endpoint answers this machine only', 'srv.m1'],
    ['internal error', 'srv.m2'],
    ['request body too large', 'srv.m3'],
    ['body too large', 'srv.m4'],
    ['malformed body', 'srv.m5'],
    ['current password incorrect', 'srv.m6'],
    ['newPassword required', 'srv.m7'],
    ['set an admin password before enabling auth', 'srv.m8'],
    ['username and password are required', 'srv.m9'],
    ['username already exists', 'srv.m10'],
    ['adminUsername and adminPassword are required to secure the admin account', 'srv.m11'],
    ['could not complete first-user setup (the admin may already be secured, or the username is taken)', 'srv.m12'],
    ['no certificate has been generated yet', 'srv.m13'],
    ['too many CA downloads; wait a moment and try again', 'srv.m14'],
    ['kind must be "ip" or "hostname"', 'srv.m15'],
    ['value is required', 'srv.m16'],
    ['certificate generation failed; see the server logs for the cause', 'srv.m17'],
    ['mode must be "open", "httpsOnly", or "redirect"', 'srv.m18'],
    ['could not save the exposure setting', 'srv.m19'],
    ['could not save the https port', 'srv.m20'],
    ['no such tls route', 'srv.m21'],
    ['address is required', 'srv.m22'],
    ['address must be a host or host:port', 'srv.m23'],
    ['udid is required', 'srv.m24'],
    ['udid and action are required', 'srv.m25'],
    ['serial is required', 'srv.m26'],
    ['address and code are required', 'srv.m27'],
    ['address must be IP:port, as shown on the phone', 'srv.m28'],
    ['code must be the numeric pairing code shown on the phone', 'srv.m29'],
    ['no such pairing session', 'srv.m30'],
    ['that origin is not currently allowed to embed this app', 'srv.m31'],
    ['embed requests are accepted from this machine only', 'srv.m32'],
    ['origin must be an http(s) origin with no path', 'srv.m33'],
    ['embed requests are canceled from this machine only', 'srv.m34'],
    ['no pending request with that id', 'srv.m35'],
    ['could not apply the approved origin', 'srv.m36'],
    ['dev mode — packaging features disabled', 'srv.m37'],
    ['autoUpdate must be a boolean', 'srv.m38'],
    ['githubOwner must be a non-empty string', 'srv.m39'],
    ['updateCheckIntervalMinutes must be an integer between 5 and 1440', 'srv.m40'],
    ['changes must be an array of change objects', 'srv.m41'],
    ['Request body too large', 'srv.m42'],
    ['Body must be a JSON object', 'srv.m43'],
    ['not connected', 'srv.m44'],
    ['that name could not be used for a certificate.', 'srv.m45'],
    ['that address could not be used for a certificate.', 'srv.m46'],
]);

const PATTERNS: ReadonlyArray<{ re: RegExp; key: TranslationKey; params: readonly string[] }> = [
    { re: /^Connected Devices \[(.*)\]$/, key: 'srv.connectedDevices', params: ['host'] },
    { re: /^apply not allowed in current state: (.*)$/, key: 'srv.applyNotAllowed', params: ['state'] },
    { re: /^channel must be one of: (.*)$/, key: 'srv.channelOneOf', params: ['list'] },
    { re: /^change has no value: (.*)$/, key: 'srv.noValue', params: ['id'] },
    { re: /^not a stageable setting: (.*)$/, key: 'srv.notStageable', params: ['id'] },
    { re: /^Invalid JSON: (.*)$/, key: 'srv.invalidJson', params: ['error'] },
    {
        re: /^the device on (.*) has not reported its serial yet; retry shortly$/,
        key: 'srv.noSerial',
        params: ['address'],
    },
];

/** Translates a server message; unknown text is returned unchanged. */
export function translateServerMessage(message: string): string {
    const key = EXACT.get(message);
    if (key) return t(key);
    for (const { re, key: patternKey, params } of PATTERNS) {
        const m = re.exec(message);
        if (!m) continue;
        const values: MessageParams = {};
        params.forEach((name, i) => {
            values[name] = m[i + 1] ?? '';
        });
        return t(patternKey, values);
    }
    return message;
}
