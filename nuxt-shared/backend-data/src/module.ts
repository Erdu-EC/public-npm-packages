import {defineNuxtModule, addImportsDir, addImports, addPlugin, createResolver} from '@nuxt/kit';
import {defu} from 'defu';

export interface ModuleOptions {
    /**
     * NuxtApp property name (e.g. '$api') to resolve as the default fetcher across all composables.
     */
    fetcher?: string;
}

export interface ModulePublicRuntimeConfig {
    backendData?: {
        fetcher?: string;
    };
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: '@erdu-ec/nuxt-backend-data',
        configKey: 'backendData',
        compatibility: {
            nuxt: '>=4.0.0'
        }
    },
    defaults: {},
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        // Expose module options to runtimeConfig if specified
        if (options.fetcher) {
            nuxt.options.runtimeConfig.public = nuxt.options.runtimeConfig.public || {};
            nuxt.options.runtimeConfig.public.backendData = defu(
                nuxt.options.runtimeConfig.public.backendData as Record<string, unknown>,
                {fetcher: options.fetcher}
            );

            // Register auto-configuration plugin to set the default fetcher if specified in runtimeConfig
            addPlugin(resolver.resolve('./runtime/plugin'));
        }

        // Auto-import reusable fetch composables across the host Nuxt application
        addImportsDir(resolver.resolve('./runtime/composables'));

        // Auto-import public fetch utilities
        addImports({
            name: 'getDefaultFetchOptions',
            from: resolver.resolve('./runtime/utils/fetchUtils')
        });
    }
});

// Re-export runtime public types for consumption in host apps
export type * from './runtime/types';
export type * from './runtime/composables';
export type * from './runtime/utils';
