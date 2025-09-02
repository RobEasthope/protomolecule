# @protomolecule/tailwind-config

Shared Tailwind CSS v4 configuration for Protomolecule projects.

## Installation

```bash
npm install --save-dev @protomolecule/tailwind-config tailwindcss@^4.0.0
```

## Usage

In your main CSS file, import the configuration:

```css
@import '@protomolecule/tailwind-config';
```

Or import individual parts:

```css
@import 'tailwindcss';
@import '@protomolecule/tailwind-config/base.css';
@import '@protomolecule/tailwind-config/utilities.css';
```

## What's Included

- **base.css**: Theme configuration, CSS variables, and base styles
  - Color system with light/dark mode support
  - Typography scales
  - Animation definitions
  - Radius tokens
  
- **utilities.css**: Custom utility classes
  - Accordion animations
  - Additional utilities as needed

## Customization

You can override any of the CSS variables in your own CSS:

```css
@import '@protomolecule/tailwind-config';

:root {
  --radius: 0.75rem; /* Override default radius */
  --primary: 200 100% 50%; /* Override primary color */
}
```

## Tailwind CSS v4

This package is designed for Tailwind CSS v4 which uses CSS-based configuration instead of JavaScript config files.