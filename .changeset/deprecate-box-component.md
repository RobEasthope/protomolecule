---
"@robeasthope/ui": minor
---

Deprecate Box component in favor of standard HTML elements. The component remains exported for backward compatibility but should not be used in new code.

**Migration guide:**

For static elements:
```tsx
{children && <div className={cn("...")}>{children}</div>}
```

For dynamic elements:
```tsx
{children && createElement(as, { className: cn("...") }, children)}
```

**Changes:**

- Added `@deprecated` JSDoc to Box component with migration examples
- Updated SanityProse to use `createElement` instead of Box
- Box component will be removed in a future major version

See issue #187 for full migration guide.
