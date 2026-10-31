/**
 * `Symbol.dispose` / `Symbol.asyncDispose` for browsers that lack them.
 *
 * The client uses `using` declarations (Multiplexer, the device-card and
 * settings buttons). The compiled output looks up `Symbol.dispose` when it runs,
 * and Safari on iOS/iPadOS does not define it, so the first `using` threw
 * "TypeError: Symbol.dispose is not defined" -- which left the file browser on
 * "loading..." and the multiplexer unable to close its channels.
 *
 * Import this module before any code that can run a `using` declaration. The
 * well-known symbols are keyed with `Symbol.for`, the same registry key the
 * spec's polyfills use, so a later native definition cannot disagree.
 */
export interface DisposeSymbolHost {
    dispose?: symbol | undefined;
    asyncDispose?: symbol | undefined;
}

/** Fill in whichever of the two symbols `host` is missing; never replaces a native one. */
export function installDisposeSymbols(host: DisposeSymbolHost): void {
    host.dispose ??= Symbol.for('Symbol.dispose');
    host.asyncDispose ??= Symbol.for('Symbol.asyncDispose');
}

installDisposeSymbols(Symbol as unknown as DisposeSymbolHost);
