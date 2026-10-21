# @erdu-ec/nuxt-backend-data

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](./package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../../LICENSE)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.0%2B-00DC82.svg)](https://nuxt.com/)

Reusable strongly-typed data-fetching architecture, endpoint factories, and multi-API client scopes for Nuxt 4 applications.

## Features

- 🧩 **Strongly-Typed Endpoint Factories**: Create clean, reusable API composables with autocomplete and validation for routes, HTTP methods, bodies, and response schemas.
- 🔄 **Reactive & Imperative Workflows**:
  - `useDefineApiFetch` & `useDefineLazyApiFetch`: Reactive queries powered by Nuxt's `useFetch`, with automatic reactivity unwrapping (`MaybeRefOrGetter`).
  - `defineDirectApiFetch`: Imperative `$fetch` client for mutations (POST/PUT/PATCH), deletions, and event-driven data fetching.
- 🌐 **Multi-API Scope Isolation (`createApiScope`)**: Type multiple independent APIs/microservices (e.g., Auth API, Core API, Billing API) within the same application, each with its own route contracts, base URLs, and `$fetch` / `useFetch` instances.
- 🔌 **Nuxt Module Included**: Auto-imports composables and utilities throughout your Nuxt application.

## Requirements

- [Nuxt](https://nuxt.com/) `^4.0.0`
- [Vue](https://vuejs.org/) `^3.0.0`

## Installation

```bash
# pnpm
pnpm add @erdu-ec/nuxt-backend-data

# npm
npm install @erdu-ec/nuxt-backend-data

# yarn
yarn add @erdu-ec/nuxt-backend-data
```

### GitHub Packages Configuration

This package is published to [GitHub Packages](https://github.com/features/packages). Ensure your `.npmrc` is configured for the `@erdu-ec` scope:

```ini
@erdu-ec:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## Setup as a Nuxt Module

Add the package to the `modules` array in your `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@erdu-ec/nuxt-backend-data'
  ],
  backendData: {
    // Optional: NuxtApp property name (e.g. '$api') to resolve as the default fetcher across all composables
    fetcher: '$api'
  }
})
```

When enabled as a module:

- All fetch factories (`useDefineApiFetch`, `useDefineLazyApiFetch`, `defineDirectApiFetch`, `createApiScope`, `defaultApiScope`) and utilities (`getDefaultFetchOptions`) are automatically auto-imported across your application.
- If `backendData.fetcher` is specified in `nuxt.config.ts`, the module registers an internal runtime plugin that configures `configureBackendData({ fetcher: ... })` automatically.
- TypeScript types and NuxtApp augmentations are seamlessly provided.

## Quick Start (Single API)

### 1. Define Route Contracts (Type Augmentation)

Define your API routes and schema using Nuxt's `Endpoint` symbol in a TypeScript definition file (e.g. `types/api.d.ts`):

```ts
// types/api.d.ts
import type { Endpoint } from 'nuxt/app';

export type AppRoutes = {
  '/v1/users': {
    [Endpoint]: {
      GET: {
        response: Array<{ id: string; name: string; email: string }>;
      };
      POST: {
        body: { name: string; email: string };
        response: { id: string; name: string; email: string };
      };
    };
  };
  [K: `/v1/users/${string}`]: {
    [Endpoint]: {
      GET: {
        response: { id: string; name: string; email: string };
      };
      PUT: {
        body: { name?: string; email?: string };
        response: { id: string; name: string; email: string };
      };
      DELETE: {
        response: { success: boolean };
      };
    };
  };
};

declare module '@erdu-ec/nuxt-backend-data' {
  interface ApiEndpointRoutes extends AppRoutes {}
}
```

### 2. Configure Custom API Client (Optional)

If your application provides a custom `$fetch` instance (e.g. `$api` provided by a Nuxt plugin with baseURL and auth tokens), configure it once.

> **Note:** `configureBackendData` binds the configuration to the current Nuxt App context. It MUST be called inside a Nuxt context (like a Nuxt Plugin, middleware, or component setup) to avoid cross-request state pollution during Server-Side Rendering (SSR).

```ts
// plugins/api.ts
export default defineNuxtPlugin((nuxtApp) => {
  configureBackendData({
    fetcher: '$api' // Resolves useNuxtApp().$api per request
    // or: fetcher: nuxtApp.$api as $Fetch
  });
});
```

All auto-imported composables (`useDefineApiFetch`, `useDefineLazyApiFetch`, `defineDirectApiFetch`) will automatically use your custom client!

### 3. Define Endpoint Composables

Create reusable endpoint functions in your `composables/` directory:

```ts
// composables/useUserApi.ts
import {
  useDefineLazyApiFetch,
  useDefineApiFetch,
  defineDirectApiFetch
} from '@erdu-ec/nuxt-backend-data';

export const useUserApi = (fetcher?: $Fetch) => {
  return {
    // Reactive Queries (useFetch)
    getUsers: useDefineLazyApiFetch('/v1/users', fetcher),
    getUser: useDefineApiFetch((id: string) => `/v1/users/${id}` as const, fetcher),

    // Imperative Operations ($fetch)
    fetchUserDirect: defineDirectApiFetch('GET', (id: string) => `/v1/users/${id}` as const, fetcher),
    createUser: defineDirectApiFetch('POST', '/v1/users', fetcher),
    updateUser: defineDirectApiFetch('PUT', (id: string) => `/v1/users/${id}` as const, fetcher),
    deleteUser: defineDirectApiFetch('DELETE', (id: string) => `/v1/users/${id}` as const, fetcher)
  };
};
```

### 4. Consume in Components

```vue
<!-- components/UserProfile.vue -->
<script setup lang="ts">
const { getUsers, getUser, createUser, deleteUser } = useUserApi();

const { data: users, status, refresh } = getUsers();

const selectedUserId = ref('usr_123');
const { data: user, pending } = getUser(selectedUserId);

async function handleCreate() {
  const newUser = await createUser({
    name: 'Alice Cooper',
    email: 'alice@example.com'
  });
  console.log('Created user:', newUser.id);
  await refresh();
}

async function handleDelete(id: string) {
  await deleteUser(id);
  await refresh();
}
</script>

<template>
  <div>
    <div v-if="status === 'pending'">Loading users...</div>
    <ul v-else-if="users">
      <li v-for="item in users" :key="item.id">
        {{ item.name }} - {{ item.email }}
        <button @click="handleDelete(item.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>
```

## Multi-API Scope Architecture (`createApiScope`)

When an application communicates with multiple microservices or distinct APIs, use `createApiScope<Routes>()` to isolate route typing and fetch configurations.

### 1. Define Routes for Each API

```ts
// types/authApi.d.ts
import type { Endpoint } from 'nuxt/app';

export type AuthRoutes = {
  '/auth/login': {
    [Endpoint]: {
      POST: {
        body: { username: string; password: string };
        response: { token: string; expiresAt: string };
      };
    };
  };
  '/auth/logout': {
    [Endpoint]: {
      POST: {
        response: { success: boolean };
      };
    };
  };
};

// types/billingApi.d.ts
export type BillingRoutes = {
  '/billing/invoices': {
    [Endpoint]: {
      GET: {
        response: Array<{ id: string; amount: number; paid: boolean }>;
      };
    };
  };
  [K: `/billing/invoices/${string}/pay`]: {
    [Endpoint]: {
      POST: {
        body: { paymentMethodId: string };
        response: { status: 'paid' | 'failed' };
      };
    };
  };
};
```

### 2. Instantiate API Scopes

```ts
// services/apis.ts
import { createApiScope } from '@erdu-ec/nuxt-backend-data';
import type { AuthRoutes } from '~/types/authApi';
import type { BillingRoutes } from '~/types/billingApi';

export const authApi = createApiScope<AuthRoutes>((nuxt) => nuxt?.$authFetch as $Fetch);

export const billingApi = createApiScope<BillingRoutes>({
  fetcher: () => billingFetchInstance,
  useFetch: useBillingFetch
});
```

### 3. Build Strongly-Typed API Modules

```ts
// composables/useAuth.ts
import { authApi } from '~/services/apis';

export const useAuth = () => {
  return {
    login: authApi.defineDirectApiFetch('POST', '/auth/login'),
    logout: authApi.defineDirectApiFetch('POST', '/auth/logout')
  };
};

// composables/useBilling.ts
import { billingApi } from '~/services/apis';

export const useBilling = () => {
  return {
    invoicesQuery: billingApi.useDefineLazyApiFetch('/billing/invoices'),
    payInvoice: billingApi.defineDirectApiFetch(
      'POST',
      (invoiceId: string) => `/billing/invoices/${invoiceId}/pay` as const
    )
  };
};
```

## Exports

| Subpath | Types | Import | Description |
| --- | --- | --- | --- |
| `@erdu-ec/nuxt-backend-data` | `./dist/types.d.mts` | `./dist/module.mjs` | Main bundle (module, default composables, types, utilities) |
| `@erdu-ec/nuxt-backend-data/composables` | `./dist/runtime/composables/index.d.ts` | `./dist/runtime/composables/index.js` | Composable factories (`createApiScope`, `defaultApiScope`, `useDefineApiFetch`, `useDefineLazyApiFetch`, `defineDirectApiFetch`) |
| `@erdu-ec/nuxt-backend-data/types` | `./dist/runtime/types/index.d.ts` | `./dist/runtime/types/index.js` | TypeScript contracts (`ApiEndpointRoutes`, `ApiScope`, `ApiFetchOptions`, etc.) |
| `@erdu-ec/nuxt-backend-data/utils` | `./dist/runtime/utils/index.d.ts` | `./dist/runtime/utils/index.js` | Pure utilities (`getDefaultFetchOptions`, `createMethods`) |

## Scripts

| Script | Description |
| --- | --- |
| `build` | Build the package using `@nuxt/module-builder` |
| `dev:prepare` | Prepare Nuxt types for development |
| `prepare` | Prepare Nuxt types (runs on install) |
| `prepack` | Build before packaging/publishing |
| `typecheck` | Type-check with `vue-tsc --noEmit` |

## License

MIT
