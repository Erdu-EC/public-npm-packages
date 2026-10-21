import {useFetch as nuxtUseFetch} from "#imports";
import type {
    ApiEndpointRoutes,
    ApiScope,
    ApiScopeOptions,
    ApiFetcherOption
} from "../types";
import {getBackendDataConfig} from "./configureBackendData";
import {createMethods} from "../utils/createMethods";
import {isApiFetcherOption, resolveFetcherOption} from "../utils/resolveFetcher";

/**
 * Creates an isolated, typed API client scope for a specific route schema.
 * When called with no arguments, creates a scope bound dynamically to global `configureBackendData` defaults.
 */
export function createApiScope<Routes = ApiEndpointRoutes>(
    optionsOrFetcher?: ApiScopeOptions | ApiFetcherOption
): ApiScope<Routes> {
    if (optionsOrFetcher === undefined) {
        return createMethods<Routes>(
            () => getBackendDataConfig().useFetch ?? nuxtUseFetch,
            () => resolveFetcherOption(getBackendDataConfig().fetcher)
        );
    }

    const options: ApiScopeOptions = isApiFetcherOption(optionsOrFetcher)
        ? {fetcher: optionsOrFetcher}
        : optionsOrFetcher;

    const fetcherInstance = resolveFetcherOption(options.fetcher);
    const useFetchComposable = options.useFetch ?? nuxtUseFetch;

    return createMethods<Routes>(useFetchComposable, fetcherInstance);
}
