import type {ApiEndpointRoutes} from "../types";
import {createApiScope} from "./createApiScope";

export * from './configureBackendData';
export * from './createApiScope';

/**
 * Default API client scope bound to `ApiEndpointRoutes`.
 */
export const defaultApiScope = createApiScope<ApiEndpointRoutes>();

export const useDefineApiFetch = defaultApiScope.useDefineApiFetch;

export const useDefineLazyApiFetch = defaultApiScope.useDefineLazyApiFetch;

export const defineDirectApiFetch = defaultApiScope.defineDirectApiFetch;
