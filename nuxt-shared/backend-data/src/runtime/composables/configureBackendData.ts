import type {BackendDataConfig} from "../types";
import {useNuxtApp} from "#imports";

/**
 * Configures global defaults for backend-data fetch composables (e.g. inside a Nuxt plugin).
 */
export function configureBackendData(config: BackendDataConfig): void {
    const nuxtApp = useNuxtApp();
    nuxtApp._backendDataConfig = { ...config };
}

/**
 * Returns the currently active backend-data configuration from the Nuxt context.
 */
export function getBackendDataConfig(): BackendDataConfig {
    const nuxtApp = useNuxtApp();
    return nuxtApp._backendDataConfig ?? {};
}
