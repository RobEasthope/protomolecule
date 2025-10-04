---
"@robeasthope/ui": minor
---

Component upgrade improvements for React 19 compatibility and accessibility

- Remove redundant ARIA attributes from InternalLink components (NextInternalLink, ReactRouterLink)
- Add automatic aria-labels to ExternalLink for new tab warnings
- Add automatic aria-labels to EmailLink for email context
- Improve SanityProse type safety (components prop now properly typed)
- Add code mark component to FullProseComponents
- Improve OmniLink type safety with discriminated unions
- Add comprehensive test coverage for Prose component (10 new tests)
- All 74 tests passing with React 19.1.1, Next.js 15, and React Router v7
