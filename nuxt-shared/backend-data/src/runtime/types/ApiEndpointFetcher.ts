import type {HTTPMethod, KeysOf, TypedFetchRequestBody, TypedFetchResponseBody, UseFetchOptions} from "#app";
import type {MaybeRefOrGetter} from "vue";
import type {ApiEndpointRoutes} from "./ApiEndpointRoutes";
import type {ApiAsyncData, ApiCompatibleResponse, ApiFetchOptions} from "./ApiFetch";

type MaybeRefOrGetterParams<T extends unknown[]> = {
    [K in keyof T]: MaybeRefOrGetter<T[K]>;
};

export type SchemaResponse<
    ReqT extends string,
    Method extends HTTPMethod = 'GET',
    Routes = ApiEndpointRoutes
> = [TypedFetchResponseBody<Routes, ReqT, Method>] extends [never]
    ? unknown
    : TypedFetchResponseBody<Routes, ReqT, Method>;

export type SchemaBody<
    ReqT extends string,
    Method extends HTTPMethod,
    Routes = ApiEndpointRoutes
> = TypedFetchRequestBody<Routes, ReqT, Method, never>;

export type ApiEndpointParamFetcher<
    Params extends unknown[],
    ReqT extends string,
    Routes = ApiEndpointRoutes,
    DefaultT = SchemaResponse<ReqT, 'GET', Routes>
> = [DefaultT] extends [never]
    ? never
    : <CustomRes extends ApiCompatibleResponse<DefaultT, CustomRes> = DefaultT, Out = CustomRes>(
        ...args: [
            ...MaybeRefOrGetterParams<Params>,
            opts?: UseFetchOptions<DefaultT, NoInfer<Out>, KeysOf<NoInfer<Out>>, any>
        ]
    ) => ApiAsyncData<Out>;

export type ApiEndpointFetcher<
    ReqT extends string,
    Routes = ApiEndpointRoutes,
    DefaultT = SchemaResponse<ReqT, 'GET', Routes>
> = ApiEndpointParamFetcher<[], ReqT, Routes, DefaultT>;

export type ApiDirectParamFetcher<
    Params extends unknown[],
    ReqT extends string,
    Method extends HTTPMethod,
    Routes = ApiEndpointRoutes,
    DefaultT = SchemaResponse<ReqT, Method, Routes>,
    Body = SchemaBody<ReqT, Method, Routes>
> = [Body] extends [never]
    ? <CustomRes extends ApiCompatibleResponse<DefaultT, CustomRes> = DefaultT>(
        ...args: [...Params, opts?: ApiFetchOptions]
    ) => Promise<CustomRes>
    : <CustomRes extends ApiCompatibleResponse<DefaultT, CustomRes> = DefaultT>(
        ...args: [...Params, data: Body, opts?: ApiFetchOptions]
    ) => Promise<CustomRes>;

export type ApiDirectFetcher<
    ReqT extends string,
    Method extends HTTPMethod,
    Routes = ApiEndpointRoutes,
    DefaultT = SchemaResponse<ReqT, Method, Routes>,
    Body = SchemaBody<ReqT, Method, Routes>
> = ApiDirectParamFetcher<[], ReqT, Method, Routes, DefaultT, Body>;
