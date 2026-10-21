import type {$Fetch, HTTPMethod, NuxtApp, UseFetch} from "#app";
import type {
    ApiDirectFetcher,
    ApiDirectParamFetcher,
    ApiEndpointFetcher,
    ApiEndpointParamFetcher,
    SchemaBody,
    SchemaResponse
} from "./ApiEndpointFetcher";

export type FetcherResolver = (nuxtApp?: NuxtApp) => $Fetch | undefined;
export type ApiFetcherOption = $Fetch | FetcherResolver | string;

export interface BackendDataConfig {
    /**
     * Default $Fetch instance, a resolver receiving NuxtApp, or a NuxtApp property name (e.g. '$api').
     */
    fetcher?: ApiFetcherOption;

    /**
     * Optional pre-created useFetch composable.
     */
    useFetch?: UseFetch;
}

export interface ApiScopeOptions extends BackendDataConfig {}

export interface UseDefineApiFetch<Routes> {
    <ReqT extends string, ResT = SchemaResponse<ReqT, 'GET', Routes>>(
        path: ReqT,
        fetcher?: $Fetch,
        lazy?: boolean
    ): ApiEndpointFetcher<ReqT, Routes, ResT>;

    <Params extends unknown[], ReqT extends string, ResT = SchemaResponse<ReqT, 'GET', Routes>>(
        pathBuilder: (...params: Params) => ReqT,
        fetcher?: $Fetch,
        lazy?: boolean
    ): ApiEndpointParamFetcher<Params, ReqT, Routes, ResT>;
}

export interface UseDefineLazyApiFetch<Routes> {
    <ReqT extends string, ResT = SchemaResponse<ReqT, 'GET', Routes>>(
        path: ReqT,
        fetcher?: $Fetch
    ): ApiEndpointFetcher<ReqT, Routes, ResT>;

    <Params extends unknown[], ReqT extends string, ResT = SchemaResponse<ReqT, 'GET', Routes>>(
        pathBuilder: (...params: Params) => ReqT,
        fetcher?: $Fetch
    ): ApiEndpointParamFetcher<Params, ReqT, Routes, ResT>;
}

export interface DefineDirectApiFetch<Routes> {
    <
        Method extends HTTPMethod,
        ReqT extends string,
        HasBody extends boolean = true,
        DefaultT = SchemaResponse<ReqT, Method, Routes>,
        Body = HasBody extends false ? never : SchemaBody<ReqT, Method, Routes>
    >(
        method: Method,
        path: ReqT,
        fetcher?: $Fetch,
        hasBody?: HasBody
    ): ApiDirectFetcher<ReqT, Method, Routes, DefaultT, Body>;

    <
        Params extends unknown[],
        Method extends HTTPMethod,
        ReqT extends string,
        HasBody extends boolean = true,
        DefaultT = SchemaResponse<ReqT, Method, Routes>,
        Body = HasBody extends false ? never : SchemaBody<ReqT, Method, Routes>
    >(
        method: Method,
        pathBuilder: (...params: Params) => ReqT,
        fetcher?: $Fetch,
        hasBody?: HasBody
    ): ApiDirectParamFetcher<Params, ReqT, Method, Routes, DefaultT, Body>;
}

export interface ApiScope<Routes> {
    /**
     * Define an eager reactive fetch query bound to this API scope.
     */
    useDefineApiFetch: UseDefineApiFetch<Routes>;

    /**
     * Define a lazy reactive fetch query bound to this API scope.
     */
    useDefineLazyApiFetch: UseDefineLazyApiFetch<Routes>;

    /**
     * Define an imperative direct fetch call (GET, POST, PUT, DELETE, etc.) bound to this API scope.
     */
    defineDirectApiFetch: DefineDirectApiFetch<Routes>;
}
