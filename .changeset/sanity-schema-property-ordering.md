---
"@robeasthope/eslint-config": minor
---

Add ESLint rule for Sanity schema property ordering

Adds a new `sanitySchema` rule configuration that enforces consistent property ordering in `defineField()` and `defineType()` calls within `*.schema.ts` files.

**Property ordering groups:**

1. Identity: `name`, `title`, `type`, `icon`
2. Organization: `fieldset`, `group`, `groups`, `fieldsets`
3. Behavior: `hidden`, `readOnly`
4. Type-specific: `options`, `rows`, `to`, `of`, `marks`, `styles`
5. Content defaults: `initialValue`, `description`
6. Document-level: `preview`, `orderings`
7. Validation: `validation`
8. Fields: `fields` (always last for document types)

The rule is auto-fixable with `eslint --fix`.
