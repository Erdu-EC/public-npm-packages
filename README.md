# public-npm-packages

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm: dotnet-typescript-utils](https://img.shields.io/npm/v/@erdu.dev/dotnet-typescript-utils.svg)](https://www.npmjs.com/package/@erdu.dev/dotnet-typescript-utils)
[![npm: nuxt-backend-data](https://img.shields.io/npm/v/@erdu.dev/nuxt-backend-data.svg)](https://www.npmjs.com/package/@erdu.dev/nuxt-backend-data)

Monorepo for public NPM packages under the `@erdu.dev` scope.

## Packages

| Package | Description | Documentation |
| --- | --- | --- |
| [@erdu.dev/dotnet-typescript-utils](./dotnet-shared/typescript-utils) | TypeScript types and utilities for .NET 8+ date, time, and value types. Includes template literal types and validation and conversion functions for DateTime, DateOnly, Guid, and TimeSpan. | [README](./dotnet-shared/typescript-utils/README.md) |
| [@erdu.dev/nuxt-backend-data](./nuxt-shared/backend-data) | Strongly-typed architecture for API consumption in Nuxt 4. Endpoint factories, reactive/imperative composables, multi-API support with `createApiScope`, and an auto-importable Nuxt module. | [README](./nuxt-shared/backend-data/README.md) |

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Type-check all packages
pnpm typecheck
```

## Publishing

Packages are published on GitHub Packages under the `@erdu.dev` scope. Each package manages its own `package.json` configuration and publishing.

## License

[MIT](./LICENSE)
