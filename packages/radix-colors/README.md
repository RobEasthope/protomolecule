# @protomolecule/radix-colors

Radix UI color system integration for Protomolecule projects, providing a comprehensive palette with dark mode support.

## 📦 Installation

This is a private package within the Protomolecule monorepo. It's automatically available to other packages in the workspace.

## 🚀 Usage

### In CSS Files

Import the color system in your main CSS file:

```css
@import "@protomolecule/radix-colors";

/* Use color variables */
.my-component {
  background-color: var(--gray-1);
  color: var(--gray-12);
  border: 1px solid var(--gray-6);
}
```

### In JavaScript/TypeScript

Import at the application root:

```javascript
import "@protomolecule/radix-colors";
```

### With Tailwind CSS

The colors are integrated with Tailwind CSS v4 in the UI package. Use them directly in class names:

```jsx
<div className="bg-gray-1 text-gray-12 border-gray-6">Content</div>
```

## 🎨 Included Color Scales

### Neutral Colors

- **Gray** - True grays
- **Mauve** - Cool grays
- **Slate** - Cool blue-grays
- **Sage** - Warm green-grays
- **Olive** - Natural green-grays
- **Sand** - Warm yellow-grays

### Semantic Colors

- **Tomato**, **Red**, **Ruby**, **Crimson** - Error states, destructive actions
- **Pink**, **Plum**, **Purple**, **Violet** - Accent colors
- **Indigo**, **Blue**, **Sky**, **Cyan** - Primary actions, links
- **Teal**, **Jade**, **Green**, **Grass** - Success states
- **Orange**, **Brown** - Warning states
- **Gold**, **Bronze** - Special states
- **Mint**, **Lime**, **Yellow**, **Amber** - Highlights

### Color Variants

Each color scale includes:

- **Light mode** colors (default)
- **Dark mode** colors (automatic with CSS variables)
- **Alpha variants** for transparency effects

## 🌙 Dark Mode

Dark mode is automatically handled via CSS custom properties:

```css
/* Automatically switches in dark mode */
:root {
  color-scheme: light dark;
}

.my-component {
  /* These colors adapt to the color scheme */
  background: var(--gray-1);
  color: var(--gray-12);
}
```

## 📐 Color Scale Structure

Each color has 12 steps from 1-12:

| Step | Use Case                          |
| ---- | --------------------------------- |
| 1-2  | Backgrounds                       |
| 3-5  | Interactive component backgrounds |
| 6-8  | Borders and separators            |
| 9-10 | Solid backgrounds, active states  |
| 11   | Low-contrast text                 |
| 12   | High-contrast text                |

## 🛠️ Development

### File Structure

```
packages/radix-colors/
├── index.css        # Main export with all imports
├── base.css         # Base color imports
├── semantic.css     # Semantic color imports
├── package.json
└── README.md
```

### Adding New Colors

1. Add the Radix Colors import to the appropriate CSS file
2. Import the CSS file in `index.css`
3. Update this README with the new color

## 🔗 Resources

- [Radix Colors Documentation](https://www.radix-ui.com/colors)
- [Color Scale Guide](https://www.radix-ui.com/colors/docs/palette-composition/scales)
- [Usage Guidelines](https://www.radix-ui.com/colors/docs/palette-composition/usage)

## 📄 License

MIT License - see [LICENSE](../../LICENSE) file in the root directory.

This software is provided "as is", without warranty of any kind. Use at your own risk.
