---
"@robeasthope/eslint-config": minor
---

Fix ESLint rules causing friction with React Router v7 and modern meta-framework patterns

**Changes:**

1. **`canonical/filename-match-exported`** - Disabled for framework routing directories (`routes/`, `app/`, `pages/`)
   - File-based routing requires specific filenames that don't match exported component names
   - Affects: React Router v7, Remix, Next.js, SvelteKit, Astro, Nuxt

2. **`import/no-extraneous-dependencies`** - Enhanced to support framework dev packages
   - Allows imports from `@react-router/dev` and similar packages in devDependencies
   - These are required for route configuration at build time

3. **`import/no-unassigned-import`** - Allows CSS file imports
   - Standard pattern in Vite, Next.js, React Router, Remix, Astro
   - Supports: `.css`, `.scss`, `.sass`, `.less`, `.pcss`

4. **`func-style`** - Allows arrow functions for exported const with type annotations
   - Framework types often require specific function signatures
   - Example: `export const links: Route.LinksFunction = () => [...]`

5. **`no-empty-pattern`** - Disabled to support typed framework exports
   - Empty destructuring satisfies type system when arguments aren't used
   - Example: `export function meta({}: Route.MetaArgs) { ... }`

**Impact:** Eliminates 7 `eslint-disable` comments across React Router v7 applications and improves DX for all modern meta-frameworks.

Fixes #299
