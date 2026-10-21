import {defineNuxtPlugin, useRuntimeConfig} from '#imports';
import {configureBackendData} from './composables/configureBackendData';

export default defineNuxtPlugin(() => {
    const runtimeConfig = useRuntimeConfig();
    const backendDataConfig = (runtimeConfig.public as Record<string, any>)?.backendData;

    if (backendDataConfig?.fetcher && typeof backendDataConfig.fetcher === 'string') {
        configureBackendData({
            fetcher: backendDataConfig.fetcher
        });
    }
});
