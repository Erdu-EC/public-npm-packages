import type {AnyServerRouteMethod, AsyncData, NuxtError, TypedFetchOptions} from 'nuxt/app';

export type ApiFetchOptions = Omit<TypedFetchOptions<string, AnyServerRouteMethod>, 'method'>;

export type ApiAsyncData<T> = AsyncData<T | null, NuxtError | undefined>;

export type ApiCompatibleResponse<DefaultT, CustomRes> =
    [DefaultT] extends [CustomRes] ? unknown : DefaultT;
