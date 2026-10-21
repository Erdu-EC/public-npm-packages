/**
 * Extensible interface representing the API route definitions for typed requests.
 *
 * Consumer applications can augment this interface using TypeScript module augmentation:
 *
 * ```ts
 * declare module '@erdu-ec/nuxt-backend-data' {
 *   interface ApiEndpointRoutes extends MyCustomApiRoutes {}
 * }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ApiEndpointRoutes {}
