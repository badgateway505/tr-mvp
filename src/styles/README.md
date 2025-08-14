# 🎨 Theme System - Travel Rule Calculator

This directory contains the centralized theme system for the Travel Rule Calculator application, providing consistent colors, spacing, typography, and component styling.

## 📁 File Structure

```
src/styles/
├── theme.ts              # Main theme configuration and tokens
├── theme-variables.css   # CSS custom properties and variables
├── theme-utils.ts        # Utility functions and helper constants
└── README.md            # This documentation file
```

## 🎯 Design Principles

- **Consistency**: All UI elements use the same spacing, radius, and shadow tokens
- **Accessibility**: High contrast ratios and focus states that meet WCAG guidelines
- **Maintainability**: Centralized theme tokens that can be easily updated
- **Flexibility**: Support for different themes and responsive design patterns

## 🌈 Color System

### VASP Themes

#### Sumsub (Blue Theme)

- **Primary**: Blue palette for Sumsub VASP requirements
- **Usage**: Main application elements, primary actions, Sumsub-side components

#### Counterparty (Purple Theme)

- **Primary**: Purple palette for Counterparty VASP requirements
- **Usage**: Secondary elements, counterparty-side components

### Semantic Colors

- **Success**: Green for positive states and completed actions
- **Warning**: Yellow for caution states and pending actions
- **Error**: Red for error states and failed actions
- **Neutral**: Gray scale for text, borders, and backgrounds

## 📏 Spacing System

### Standard Spacing Scale

- `xs`: 4px (0.25rem)
- `sm`: 8px (0.5rem)
- `md`: 12px (0.75rem)
- `lg`: 16px (1rem)
- `xl`: 24px (1.5rem)
- `2xl`: 32px (2rem)
- `3xl`: 48px (3rem)
- `4xl`: 64px (4rem)

### Component-Specific Spacing

- `input`: `px-3 py-2` (12px horizontal, 8px vertical)
- `button`: `px-4 py-2` (16px horizontal, 8px vertical)
- `buttonLarge`: `px-8 py-3` (32px horizontal, 12px vertical)
- `card`: `p-4 sm:p-6` (16px, 24px on small screens)
- `header`: `px-4 py-3` (16px horizontal, 12px vertical)

## 🔘 Border Radius

- `none`: 0px
- `sm`: 2px
- `md`: 6px (default for inputs and buttons)
- `lg`: 8px (default for cards)
- `xl`: 12px
- `2xl`: 16px
- `3xl`: 24px
- `full`: 9999px (for pills and badges)

## 🌫️ Shadows

### Standard Shadows

- `xs`: Subtle shadow for small elements
- `sm`: Light shadow for cards and inputs
- `md`: Medium shadow for elevated elements
- `lg`: Strong shadow for modals and dropdowns
- `xl`: Very strong shadow for overlays
- `2xl`: Maximum shadow for top-level elements

### Custom Shadows

- `soft`: Gentle shadow for subtle elevation
- `medium`: Balanced shadow for medium elevation
- `strong`: Prominent shadow for high elevation

## ⚡ Transitions

### Duration

- `fast`: 150ms (for hover states and quick interactions)
- `normal`: 200ms (for standard state changes)
- `slow`: 300ms (for complex animations)

### Types

- `colors`: Color transitions only
- `transform`: Transform transitions only
- `opacity`: Opacity transitions only
- `all`: All property transitions

## 🎭 Animations

- `fade-in`: Smooth fade-in animation
- `slide-up`: Slide up from below
- `scale-in`: Scale in from center

## 🔧 Usage Examples

### Basic Theme Usage

```tsx
import { getVaspTheme, commonStyles } from '../styles/theme-utils';

// Get theme for a specific VASP type
const sumsubTheme = getVaspTheme('sumsub');

// Use common button styles
<button className={commonStyles.buttons.primary}>Primary Button</button>;
```

### Component Styling

```tsx
import { theme, combineClasses } from '../styles/theme-utils';

// Combine multiple classes
const buttonClasses = combineClasses(
  theme.spacing.button,
  theme.radius.button,
  theme.shadow.button,
  theme.transition.colors
);

// Use in component
<button className={buttonClasses}>Styled Button</button>;
```

### Responsive Design

```tsx
import { responsiveClass } from '../styles/theme-utils';

// Responsive spacing
const containerClasses = responsiveClass(
  'p-4', // Base: 16px padding
  'sm:p-6', // Small screens: 24px padding
  'lg:p-8' // Large screens: 32px padding
);
```

### Conditional Styling

```tsx
import { conditionalClass } from '../styles/theme-utils';

// Conditional classes
const buttonClasses = conditionalClass(
  isActive,
  'bg-sumsub-600 text-white',
  'bg-neutral-100 text-neutral-700'
);
```

## 🎨 CSS Custom Properties

The theme system also provides CSS custom properties that can be used directly in CSS:

```css
.my-component {
  background-color: var(--color-sumsub-50);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  transition: var(--transition-normal);
}
```

## 🔄 Updating the Theme

### Adding New Colors

1. Add the color to `theme.ts` in the appropriate color section
2. Add the corresponding CSS variable to `theme-variables.css`
3. Update the Tailwind config if using custom color values

### Adding New Spacing

1. Add the spacing value to `theme.ts` in the spacing section
2. Add the corresponding CSS variable to `theme-variables.css`
3. Update the Tailwind config if using custom spacing values

### Adding New Components

1. Add the component styles to `getComponentStyles` in `theme.ts`
2. Create utility functions in `theme-utils.ts` if needed
3. Document the new component in this README

## 🧪 Testing

The theme system includes TypeScript types and should be tested for:

- Color contrast ratios (WCAG AA compliance)
- Consistent spacing across components
- Proper focus states and accessibility
- Responsive behavior on different screen sizes

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG Color Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
