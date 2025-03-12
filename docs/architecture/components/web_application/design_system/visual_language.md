# Visual Design Language

## Overview

The AugmentedOS Visual Design Language defines the visual elements and principles that create a cohesive, recognizable, and accessible user experience across the platform. This document outlines the core visual elements, their usage guidelines, and implementation details.

## Color System

### Primary Colors

The primary color palette represents the AugmentedOS brand identity:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Primary | `#0055FF` | Primary actions, key UI elements |
| Primary Dark | `#0044CC` | Hover states, emphasis |
| Primary Light | `#4D8BFF` | Backgrounds, secondary elements |

### Secondary Colors

The secondary palette provides contrast and visual interest:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Secondary | `#6E31FF` | Secondary actions, accents |
| Secondary Dark | `#5826CC` | Hover states, emphasis |
| Secondary Light | `#9A70FF` | Backgrounds, decorative elements |

### Neutral Colors

Neutral colors form the foundation of the interface:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Gray 100 | `#F8F9FA` | Page backgrounds |
| Gray 200 | `#E9ECEF` | Element backgrounds |
| Gray 300 | `#DEE2E6` | Borders, dividers |
| Gray 400 | `#CED4DA` | Disabled elements |
| Gray 500 | `#ADB5BD` | Placeholder text |
| Gray 600 | `#6C757D` | Secondary text |
| Gray 700 | `#495057` | Primary text |
| Gray 800 | `#343A40` | Headings |
| Gray 900 | `#212529` | High-emphasis text |

### Semantic Colors

Colors that convey specific meanings:

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Success | `#28A745` | Positive actions, success states |
| Warning | `#FFC107` | Caution, warning states |
| Danger | `#DC3545` | Destructive actions, error states |
| Info | `#17A2B8` | Informational elements |

### Color Usage Guidelines

* Maintain sufficient contrast ratios (4.5:1 minimum for normal text)
* Use semantic colors consistently for their intended purposes
* Limit color usage to the defined palette
* Consider color blindness and other visual impairments

## Typography

### Font Families

| Font | Usage | Fallbacks |
|------|-------|-----------|
| Inter | Primary UI font | -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif |
| Roboto Mono | Code, technical content | "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace |

### Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| Display | 48px | 56px | 700 | Hero sections, major headings |
| H1 | 32px | 40px | 700 | Page titles |
| H2 | 24px | 32px | 600 | Section headings |
| H3 | 20px | 28px | 600 | Subsection headings |
| H4 | 18px | 24px | 600 | Card headings, minor sections |
| Body Large | 16px | 24px | 400 | Primary content |
| Body | 14px | 20px | 400 | Secondary content |
| Small | 12px | 16px | 400 | Captions, metadata |
| Tiny | 10px | 14px | 400 | Legal text, footnotes |

### Typography Guidelines

* Maintain consistent type hierarchy
* Use appropriate font weights for emphasis
* Ensure sufficient line height for readability
* Limit the number of font sizes and weights
* Consider responsive adjustments for different screen sizes

## Spacing System

### Spacing Scale

The spacing system uses a 4px base unit:

| Token | Value | Usage |
|-------|-------|-------|
| space-0 | 0px | No spacing |
| space-1 | 4px | Minimal spacing, tight relationships |
| space-2 | 8px | Default spacing between related elements |
| space-3 | 12px | Spacing between loosely related elements |
| space-4 | 16px | Standard component padding |
| space-5 | 24px | Spacing between distinct elements |
| space-6 | 32px | Section spacing |
| space-7 | 48px | Large section spacing |
| space-8 | 64px | Page section spacing |
| space-9 | 96px | Major page section spacing |

### Layout Grid

* Base grid of 8px
* 12-column layout system
* Responsive breakpoints:
  * Small: 576px
  * Medium: 768px
  * Large: 992px
  * Extra Large: 1200px
  * Extra Extra Large: 1400px

### Spacing Guidelines

* Use the spacing scale consistently
* Maintain consistent spacing within component types
* Adjust spacing proportionally across screen sizes
* Use appropriate spacing to indicate relationships between elements

## Iconography

### Icon System

* 24px base size with 1.5px stroke width
* Consistent visual style with rounded corners (2px radius)
* Clear silhouettes with minimal detail
* Available in outlined and filled variants

### Icon Categories

* Navigation icons
* Action icons
* Status icons
* Object icons
* Domain-specific icons

### Icon Usage Guidelines

* Use icons consistently for the same actions/concepts
* Pair icons with text for clarity when possible
* Ensure icons are recognizable at small sizes
* Maintain consistent visual weight within contexts

## Imagery

### Photography

* Clean, focused compositions
* Natural lighting
* Authentic representation of users and scenarios
* Consistent color treatment

### Illustrations

* Simple, geometric style
* Limited color palette from the design system
* Consistent line weights and proportions
* Purposeful use to explain concepts or add visual interest

### Data Visualization

* Clear, minimal design that emphasizes data
* Consistent color usage for data categories
* Appropriate chart types for different data relationships
* Accessible color combinations with sufficient contrast

## Motion

### Duration and Easing

| Type | Duration | Easing | Usage |
|------|----------|--------|-------|
| Micro | 100-150ms | ease-out | Small element changes |
| Base | 200-300ms | ease-in-out | Standard transitions |
| Complex | 300-500ms | custom | Multi-stage animations |

### Motion Principles

* Purpose: Animation should serve a purpose, not distract
* Natural: Movements should feel natural and expected
* Responsive: Animations should be quick and responsive
* Cohesive: Motion should be consistent across the platform

## Implementation

### Design Tokens

All visual elements are implemented as design tokens:

```json
{
  "color": {
    "primary": {
      "base": "#0055FF",
      "dark": "#0044CC",
      "light": "#4D8BFF"
    },
    "secondary": {
      "base": "#6E31FF",
      "dark": "#5826CC",
      "light": "#9A70FF"
    },
    // Additional color tokens
  },
  "typography": {
    "fontFamily": {
      "base": "Inter, -apple-system, BlinkMacSystemFont, ...",
      "mono": "Roboto Mono, SFMono-Regular, ..."
    },
    // Additional typography tokens
  },
  // Spacing, border, shadow tokens
}
```

### CSS Implementation

Design tokens are implemented in CSS:

```css
:root {
  /* Colors */
  --color-primary: #0055FF;
  --color-primary-dark: #0044CC;
  --color-primary-light: #4D8BFF;
  
  /* Typography */
  --font-family-base: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  --font-size-body: 14px;
  --line-height-body: 20px;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  
  /* Additional tokens */
}
```

## Related Documentation

* [Design System Overview](./overview.md)
* [Component Guidelines](./component_guidelines.md)
* [Accessibility](./accessibility.md)
* [UX Patterns](./ux_patterns.md) 