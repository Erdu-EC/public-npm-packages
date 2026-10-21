# public-npm-packages

Monorepo con paquetes NPM públicos.

## Paquetes

| Paquete | Descripción | README |
| --- | --- | --- |
| [@erdu-ec/nuxt-backend-data](./nuxt-shared/backend-data) | Arquitectura fuertemente tipada para consumo de APIs en Nuxt 4. Factories de endpoints, composables reactivos/imperativos, soporte multi-API con `createApiScope` y módulo Nuxt auto-importable. | [Ver README](./nuxt-shared/backend-data/README.md) |

## Desarrollo

```bash
# Instalar dependencias
pnpm install

# Compilar todos los paquetes
pnpm build

# Typecheck en todos los paquetes
pnpm typecheck
```

## Publicación

Los paquetes se publican en GitHub Packages bajo el scope `@erdu-ec`. Cada paquete gestiona su propia configuración de `package.json` y publicación.

## Licencia

[MIT](./LICENSE)
