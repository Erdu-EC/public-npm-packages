import type { BackendDataConfig } from './ApiScope';

declare module '#app' {
    interface NuxtApp {
        _backendDataConfig?: BackendDataConfig;
    }
}
