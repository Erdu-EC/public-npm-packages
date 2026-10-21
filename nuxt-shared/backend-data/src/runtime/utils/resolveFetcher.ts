import type {$Fetch} from "#app";
import {useNuxtApp} from "#imports";
import type {ApiFetcherOption} from "../types";

export const isFetchInstance = (val: unknown): val is $Fetch =>
    typeof val === 'function' && 'raw' in val;

export const isApiFetcherOption = (val: unknown): val is ApiFetcherOption =>
    typeof val === 'string' || typeof val === 'function' || isFetchInstance(val);

const getGlobalFetch = (): $Fetch => {
    if (typeof $fetch !== 'undefined') return $fetch as $Fetch;
    return (globalThis as unknown as { $fetch: $Fetch }).$fetch;
};

export const resolveFetcherOption = (option?: ApiFetcherOption, override?: $Fetch): $Fetch => {
    if (override) return override;
    if (!option) return getGlobalFetch();
    if (isFetchInstance(option)) return option;

    if (typeof option === 'string') {
        const nuxtApp = useNuxtApp();
        const resolved = (nuxtApp as Record<string, unknown>)[option];
        if (typeof resolved !== 'function') {
            throw new Error(`[backend-data] No $Fetch instance found on NuxtApp with key "${option}".`);
        }
        return resolved as $Fetch;
    }

    return (typeof option === 'function' ? option(option.length === 0 ? undefined : useNuxtApp()) : undefined)
        ?? getGlobalFetch();
};
