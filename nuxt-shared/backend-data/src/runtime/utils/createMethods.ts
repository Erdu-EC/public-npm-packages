import type {$Fetch, HTTPMethod, UseFetch, UseFetchOptions} from "#app";
import {toValue} from "vue";
import type {
    ApiFetchOptions,
    ApiScope,
    DefineDirectApiFetch,
    UseDefineApiFetch,
    UseDefineLazyApiFetch
} from "../types";

type RoutePathOrBuilder = string | ((...params: unknown[]) => string);

export type FetcherSource = $Fetch | (() => $Fetch);
export type UseFetchSource = UseFetch | (() => UseFetch);

/**
 * Pure factory that constructs API scope fetch utilities from explicit dependencies.
 */
export function createMethods<Routes>(
    useFetch: UseFetchSource,
    fetcher: FetcherSource
): ApiScope<Routes> {
    const isFetchGetter = typeof fetcher === 'function' && !('raw' in fetcher);
    const isUseFetchGetter = typeof useFetch === 'function' && useFetch.length === 0 && !('raw' in useFetch);

    const getUseFetch = (): UseFetch =>
        isUseFetchGetter ? (useFetch as () => UseFetch)() : (useFetch as UseFetch);

    const resolve = (override?: $Fetch): $Fetch => {
        if (override) return override;
        return isFetchGetter ? (fetcher as () => $Fetch)() : (fetcher as $Fetch);
    };

    const useDefineApiFetch: UseDefineApiFetch<Routes> = (
        pathOrBuilder: RoutePathOrBuilder,
        override?: $Fetch,
        lazy: boolean = false
    ): any => {
        if (typeof pathOrBuilder === 'string') {
            return (opts?: UseFetchOptions<unknown>) =>
                getUseFetch()(pathOrBuilder, {
                    ...opts,
                    $fetch: resolve(opts?.$fetch ?? override),
                    lazy
                });
        }

        const paramCount = pathOrBuilder.length;

        return (...args: unknown[]) => {
            const params = args.slice(0, paramCount);
            const opts = args[paramCount] as UseFetchOptions<unknown> | undefined;

            return getUseFetch()(
                () => pathOrBuilder(...params.map((p) => toValue(p))),
                {
                    ...opts,
                    $fetch: resolve(opts?.$fetch ?? override),
                    lazy
                }
            );
        };
    };

    const useDefineLazyApiFetch: UseDefineLazyApiFetch<Routes> = (
        pathOrBuilder: RoutePathOrBuilder,
        override?: $Fetch
    ): any => useDefineApiFetch(pathOrBuilder as string, override, true);

    const defineDirectApiFetch: DefineDirectApiFetch<Routes> = (
        method: HTTPMethod,
        pathOrBuilder: RoutePathOrBuilder,
        override?: $Fetch,
        hasBody: boolean = method !== 'DELETE' && method !== 'GET'
    ): any => {
        const isBuilder = typeof pathOrBuilder === 'function';
        const paramCount = isBuilder ? pathOrBuilder.length : 0;

        return (...args: unknown[]) => {
            const params = args.slice(0, paramCount);
            const remaining = args.slice(paramCount);
            const url = isBuilder ? pathOrBuilder(...params) : pathOrBuilder;

            const body = hasBody ? remaining[0] : undefined;
            const opts = (hasBody ? remaining[1] : remaining[0]) as ApiFetchOptions | undefined;

            return resolve(override)(url, {
                ...opts,
                method,
                ...(body !== undefined && {body})
            });
        };
    };

    return {
        useDefineApiFetch,
        useDefineLazyApiFetch,
        defineDirectApiFetch
    };
}