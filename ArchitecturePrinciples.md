# Fontolo CSS Architecture & Guidelines

## Table of Contents
1. [Architecture Principles](#architecture-principles)
2. [CSS Organization](#css-organization)
3. [Spacing System](#spacing-system)
4. [Component Guidelines](#component-guidelines)
5. [HTML Standards](#html-standards)
6. [Implementation Roadmap](#implementation-roadmap)
7. [File Specifications](#file-specifications)

---

## Architecture Principles

### 1. Separation of Concerns
- **HTML:** Content structure and semantics only
- **CSS:** All spacing, layout, and visual relationships
- **JavaScript:** Interactive behavior only

### 2. Component Responsibility Model
Each CSS component manages its own spacing relationships to other elements. No spacing utility classes in HTML.

```css
/* ✅ Component defines its relationship to following elements */
.hero { margin-bottom: var(--space-xxl); }
.section { margin-bottom: var(--space-xl); }
.button-group { margin-bottom: var(--space-lg); }

/* ✅ Last instance removes bottom margin */
.section:last-child { margin-bottom: 0; }
```

### 3. CSS-First Approach
Layout and spacing logic lives in CSS files, not scattered across HTML as utility classes.

```html
<!-- ✅ GOOD: Clean, semantic HTML -->
<section class="hero">
    <h1>Title</h1>
    <div class="button-group flex">
        <button class="btn btn-primary">Action</button>
        <button class="btn btn-secondary">Secondary</button>
    </div>
</section>

<!-- ❌ BAD: Spacing responsibilities in HTML -->
<section class="hero mb-xxl">
    <h1 class="mb-md">Title</h1>
    <div class="flex gap-md mb-lg">
        <button class="btn btn-primary mr-md">Action</button>
        <button class="btn btn-secondary">Secondary</button>
    </div>
</section>
```

---

## CSS Organization

### File Structure
```
css/
├── tokens.css        # Design tokens (spacing, colors, typography scales)
├── base.css          # Element defaults (h1, h2, p, a, body)
├── layout.css        # Layout components (.container, .grid, .flex)
├── components.css    # UI components (.btn, .card, .accordion)
├── utilities.css     # Visual-only utilities (.text-center, .hidden, .text-primary)
└── [page].css        # Page-specific layouts (index.css, landing.css)
```

### Loading Order
Always load CSS files in this order:
```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/utilities.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/[page].css">
```

---

## Spacing System

### Design Tokens
```css
/* Base spacing scale (from tokens.css) */
--space-xxs: calc(0.25rem / var(--golden-ratio));  /* ~2.5px */
--space-xs: 0.25rem;                               /* 4px */
--space-sm: 0.5rem;                                /* 8px */
--space-md: 1rem;                                  /* 16px */
--space-lg: calc(1rem * var(--golden-ratio));     /* ~26px */
--space-xl: calc(1rem * var(--golden-ratio) * var(--golden-ratio)); /* ~42px */
--space-xxl: calc(1rem * var(--golden-ratio) * var(--golden-ratio) * var(--golden-ratio)); /* ~68px */
```

### Spacing Applications

#### A. Vertical Spacing (Component-to-Component)
```css
/* Large page sections */
.hero, .main-section { 
    margin-bottom: var(--space-xxl); 
}

/* Content sections */  
.section { 
    margin-bottom: var(--space-xl); 
}

/* Component groups */
.button-group, .card-grid, .feature-list { 
    margin-bottom: var(--space-lg); 
}

/* Typography elements */
h1, h2, h3, h4, h5, h6 { 
    margin-bottom: var(--space-md); 
}

p, ul, ol { 
    margin-bottom: var(--space-md); 
}

/* Remove bottom margin from last elements */
.section:last-child,
.button-group:last-child,
p:last-child { 
    margin-bottom: 0; 
}
```

#### B. Horizontal Spacing (Within Components)
```css
/* Flex containers auto-space children */
.flex > * + * { 
    margin-left: var(--space-md); 
}

/* Spacing variants */
.flex-tight > * + * { 
    margin-left: var(--space-sm); 
}

.flex-loose > * + * { 
    margin-left: var(--space-lg); 
}

/* Grid uses CSS gap */
.grid { 
    gap: var(--space-md); 
}

.grid-tight { 
    gap: var(--space-sm); 
}

.grid-loose { 
    gap: var(--space-lg); 
}
```

#### C. Container Spacing (Internal Padding)
```css
/* Page containers */
.container { 
    padding: var(--space-lg); 
}

/* Component containers */
.card { 
    padding: var(--space-lg); 
}

.btn { 
    padding: var(--space-sm) var(--space-lg); 
}

.sidebar { 
    padding: var(--space-lg); 
}

.section { 
    padding: var(--space-xl) var(--space-lg); 
}
```

---

## Component Guidelines

### Button Components
```css
.btn {
    /* Base button styles */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-sm) var(--space-lg);
    border-radius: var(--border-radius-md);
    transition: all var(--anim-default-transition);
    /* No external margins - let container handle spacing */
}

.button-group {
    /* Container handles button spacing */
    display: flex;
    margin-bottom: var(--space-lg);
}

.button-group > * + * {
    margin-left: var(--space-md);
}
```

### Card Components
```css
.card {
    padding: var(--space-lg);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--ui-border-color);
    /* No external margins - let container handle spacing */
}

.card-grid {
    display: grid;
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
}
```

### Typography Components
```css
/* Typography handles its own bottom spacing */
h1 { 
    font-size: var(--font-size-3xl);
    margin-bottom: var(--space-lg);
}

h2 { 
    font-size: var(--font-size-2xl);
    margin-bottom: var(--space-md);
}

h3 { 
    font-size: var(--font-size-xl);
    margin-bottom: var(--space-md);
}

p { 
    margin-bottom: var(--space-md);
}

/* Last child removes bottom margin */
h1:last-child,
h2:last-child,
h3:last-child,
p:last-child {
    margin-bottom: 0;
}
```

---

## HTML Standards

### Clean HTML Patterns

#### Page Structure
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- meta tags -->
    <link rel="stylesheet" href="css/tokens.css">
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/utilities.css">
    <link rel="stylesheet" href="css/layout.css">
    <link rel="stylesheet" href="css/components.css">
    <link rel="stylesheet" href="css/[page].css">
</head>
<body>
    <div class="container">
        <section class="hero">
            <!-- hero content -->
        </section>
        
        <section class="section">
            <!-- section content -->
        </section>
    </div>
</body>
</html>
```

#### Component Combinations
```html
<!-- Button groups -->
<div class="button-group flex">
    <button class="btn btn-primary">Primary Action</button>
    <button class="btn btn-secondary">Secondary Action</button>
</div>

<!-- Card grids -->
<div class="card-grid">
    <div class="card">
        <h3>Card Title</h3>
        <p>Card content</p>
    </div>
    <div class="card">
        <h3>Card Title</h3>
        <p>Card content</p>
    </div>
</div>

<!-- Typography sections -->
<section class="section">
    <h2>Section Title</h2>
    <p>Section content with proper spacing.</p>
    <p>Multiple paragraphs space themselves correctly.</p>
</section>
```

### Forbidden Patterns
```html
<!-- ❌ NO spacing utilities in HTML -->
<div class="mb-lg">
<h2 class="mb-md">
<div class="gap-md">
<button class="mr-md">

<!-- ❌ NO manual spacing -->
<div style="margin-bottom: 20px;">
<div style="gap: 16px;">
```

### Utility Class Guidelines
Utilities should only handle **visual properties**, not layout or spacing:

```html
<!-- ✅ ALLOWED utilities -->
<h2 class="text-center text-primary">Centered Primary Heading</h2>
<p class="text-secondary">Secondary text color</p>
<div class="hidden">Hidden content</div>

<!-- ❌ FORBIDDEN utilities -->
<div class="mb-lg gap-md p-xl">Layout handled by utilities</div>
```

---

## Implementation Roadmap

### Phase 1: Foundation CSS Rules
1. **Update `css/layout.css`**
   - Add flex and grid spacing rules
   - Add container padding standards
   - Add responsive breakpoint handling

2. **Update `css/components.css`**
   - Add component-to-component spacing rules
   - Remove any existing margin utilities
   - Ensure last-child margin removal

3. **Update `css/base.css`**
   - Add typography spacing standards
   - Add element default spacing

### Phase 2: Clean HTML Templates
1. **Create standard HTML patterns**
   - Document common component combinations
   - Create reusable page templates
   - Establish semantic structure guidelines

2. **Audit existing HTML files**
   - Remove all spacing utility classes
   - Apply new semantic structure
   - Test spacing relationships

### Phase 3: Utility Cleanup
1. **Clean `css/utilities.css`**
   - Remove all spacing utilities (margin, padding, gap)
   - Keep only visual utilities (colors, text alignment, visibility)
   - Document the utilities vs components distinction

2. **Documentation**
   - Create component usage guide
   - Document common patterns
   - Create troubleshooting guide

---

## File Specifications

### css/layout.css Rules to Add
```css
/* Flex spacing */
.flex {
    display: flex;
}

.flex > * + * {
    margin-left: var(--space-md);
}

.flex-tight > * + * {
    margin-left: var(--space-sm);
}

.flex-loose > * + * {
    margin-left: var(--space-lg);
}

/* Grid spacing */
.grid {
    display: grid;
    gap: var(--space-md);
}

.grid-tight {
    gap: var(--space-sm);
}

.grid-loose {
    gap: var(--space-lg);
}

/* Container spacing */
.container {
    padding: var(--space-lg);
}

.section {
    margin-bottom: var(--space-xl);
}

.section:last-child {
    margin-bottom: 0;
}
```

### css/components.css Rules to Add
```css
/* Button spacing */
.button-group {
    margin-bottom: var(--space-lg);
}

.button-group:last-child {
    margin-bottom: 0;
}

/* Card spacing */
.card-grid {
    display: grid;
    gap: var(--space-lg);
    margin-bottom: var(--space-xl);
}

.card-grid:last-child {
    margin-bottom: 0;
}

/* Hero spacing */
.hero {
    margin-bottom: var(--space-xxl);
}

.hero:last-child {
    margin-bottom: 0;
}
```

### css/base.css Rules to Add
```css
/* Typography spacing */
h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: var(--space-md);
}

h1 {
    margin-bottom: var(--space-lg);
}

p, ul, ol {
    margin-top: 0;
    margin-bottom: var(--space-md);
}

/* Last child margin removal */
h1:last-child,
h2:last-child,
h3:last-child,
h4:last-child,
h5:last-child,
h6:last-child,
p:last-child,
ul:last-child,
ol:last-child {
    margin-bottom: 0;
}
```

### css/utilities.css - Keep Only Visual Utilities
```css
/* Typography Utilities - VISUAL ONLY */
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }

/* Font Weights - VISUAL ONLY */
.font-light { font-weight: var(--font-weight-light); }
.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }

/* Text Colors - VISUAL ONLY */
.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-secondary); }
.text-accent { color: var(--color-accent); }
.text-neutral { color: var(--color-neutral); }
.text-dark { color: var(--color-text-dark); }
.text-light { color: var(--color-text-light); }

/* Text Alignment - VISUAL ONLY */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Display Properties - BEHAVIORAL ONLY */
.block { display: block; }
.inline { display: inline; }
.inline-block { display: inline-block; }
.hidden { display: none; }

/* 
REMOVE ALL SPACING UTILITIES:
- No margin utilities (.m-*, .mt-*, .mr-*, .mb-*, .ml-*, .mx-*, .my-*)
- No padding utilities (.p-*, .pt-*, .pr-*, .pb-*, .pl-*, .px-*, .py-*)
- No gap utilities (.gap-*, .row-gap-*, .col-gap-*)
*/
```

---

## Next Steps

1. **Review and approve this architecture document**
2. **Implement the CSS rules in each file according to specifications**
3. **Create one clean HTML template as a reference**
4. **Apply the template approach to all existing HTML files**
5. **Test and refine the spacing relationships**
6. **Document common patterns and component combinations**

This architecture ensures Fontolo demonstrates best practices for design system implementation while maintaining clean, maintainable code.
