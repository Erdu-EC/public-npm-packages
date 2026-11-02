# @erdu.dev/nuxt-backend-data

[![npm version](https://img.shields.io/npm/v/@erdu.dev/nuxt-backend-data.svg)](https://www.npmjs.com/package/@erdu.dev/nuxt-backend-data)
[![GitHub Packages](https://img.shields.io/badge/GitHub-Packages-181717.svg?logo=github)](https://github.com/orgs/Erdu-EC/packages)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Nuxt](https://img.shields.io/badge/Nuxt-4.0%2B-00DC82.svg)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.0%2B-4FC08D.svg)](https://vuejs.org/)


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
pnpm add @erdu.dev/nuxt-backend-data

# npm
npm install @erdu.dev/nuxt-backend-data

# yarn
yarn add @erdu.dev/nuxt-backend-data
```

## Setup

Add the module to `nuxt.config.ts`. All composables are auto-imported:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@erdu.dev/nuxt-backend-data'],
  backendData: {
    fetcher: '$api' // optional: custom $fetch instance
  }
})
```

## Example

Define route contracts, then create and use endpoint composables:

```ts
// types/api.d.ts
declare module '@erdu.dev/nuxt-backend-data' {
  interface ApiEndpointRoutes {
    '/v1/users': {
      GET: { response: Array<{ id: string; name: string }> };
      POST: { body: { name: string }; response: { id: string } };
    };
  }
}
```

```ts
// composables/useUserApi.ts
export const useUserApi = () => ({
  getUsers:    useDefineLazyApiFetch('/v1/users'),
  getUser:     useDefineApiFetch((id: string) => `/v1/users/${id}` as const),
  createUser:  defineDirectApiFetch('POST', '/v1/users'),
  deleteUser:  defineDirectApiFetch('DELETE', (id: string) => `/v1/users/${id}` as const)
});
```

```vue
<!-- In a component -->
<script setup lang="ts">
const { getUsers, createUser } = useUserApi();
const { data: users, status } = getUsers();
</script>
```

For multi-API scenarios, use `createApiScope<Routes>()` to isolate route typing and fetch configuration per microservice.

## License

MIT
