# Fontolo CSS Architecture: The Definitive Guide

## 1. Introduction: The Fontolo Philosophy

Welcome to the Fontolo CSS Architecture Guide. This document is the single source of truth for how we build user interfaces. It is designed to help us create UIs that are **consistent, maintainable, and intuitive** to work with.

### The Problem We're Solving

In many projects, CSS can become a tangled web of overrides, utility classes, and inline styles. This leads to:

* **Inconsistency:** Spacing and layouts differ slightly across the application.
* **Difficult Refactoring:** Changing a simple layout rule requires hunting down and editing dozens of HTML files.
* **Semantic Decay:** HTML becomes cluttered with presentational classes (`class="mt-4 p-6 text-blue-500"`), obscuring its actual structure and meaning.

### Our Solution: A System of Rules

This architecture solves these problems by establishing a clear, CSS-driven system where layout is predictable, composable, and decoupled from the content's structure. By following these principles, we ensure that our HTML remains clean and our CSS remains scalable.

---

## 2. Core Principles: The Three Pillars

Our entire system is built on three foundational pillars. Understanding these is key to using the system effectively.

### Pillar 1: Strict Separation of Concerns

* **HTML is for Meaning:** It defines the structure and semantics of the content. It should know nothing about how it will be styled.
* **CSS is for Presentation:** It controls all layout, spacing, colors, and visual relationships.
* **JavaScript is for Behavior:** It handles user interaction and dynamic states.

### Pillar 2: The "Inside vs. Outside" Rule

This is the most important concept in our system.

* **A component NEVER manages its own external space.** A component (like a `.btn` or `.card`) should never have an outer `margin`. It is self-contained.
* **A container ALWAYS manages the layout of its children.** The container is responsible for arranging the components inside it, using properties like `gap` or layout patterns like the "Stack."

This mental model is crucial. Before adding space, always ask: "Am I spacing items *inside* this box, or am I spacing this *entire box* from another one?"

### Pillar 3: The Right Tool for the Job

We don't use a single tool for all spacing. We use the best tool for the specific context.

* **`gap` Property:** For **internal, grid-like spacing** within a container (e.g., buttons in a group).
* **`margin` (via Stack Pattern):** For **external, flow-based spacing** between independent layout blocks (e.g., a header and the main content).

---

## 3. The Spacing System: A Three-Layer Model

Our spacing system is built in layers, from abstract tokens down to practical implementation.

### Layer 1: The Foundation (Design Tokens)

Everything starts in `css/tokens.css`. We define a global spacing scale using CSS Custom Properties. This is our single source of truth for all space in the application.

```css
/* css/tokens.css */
:root {
  --space-xs: 0.25rem;  /* 4px */
  --space-sm: 0.5rem;   /* 8px */
  --space-md: 1rem;     /* 16px */
  --space-lg: 1.5rem;   /* 24px */
  --space-xl: 2.5rem;   /* 40px */
}
```

### Layer 2: Internal Spacing (The `gap` Property)

**When to use:** When you need to create uniform space between direct children in a container.
**How it works:** You apply `display: flex` or `display: grid` to a container, and then a single `gap` property creates the space.

```css
/* css/layout.css */
.button-group {
  display: flex;
  flex-wrap: wrap; /* Allows buttons to wrap on small screens */
  gap: var(--space-md);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
}
```

### Layer 3: Flow Spacing (The "Stack" Pattern)

**When to use:** When you need to create vertical rhythm between independent, block-level elements like headings, paragraphs, and components.
**How it works:** We use the "lobotomized owl" selector (`* + *`) to apply a `margin-top` to every element that follows another, creating a "stack" of content.

We have several "flavors" of stacks for different semantic contexts:

| Class Name      | Default Spacing     | When to Use                                             |
| :-------------- | :------------------ | :------------------------------------------------------ |
| `.page-flow`    | `var(--space-xl)`   | For major page regions (`<header>`, `<main>`, `<footer>`). |
| `.section-flow` | `var(--space-lg)`   | For large content blocks within a page section.         |
| `.stack`        | `var(--space-md)`   | For general-purpose content stacking within a component.  |

```css
/* css/layout.css */
.page-flow > * + * {
  margin-top: var(--space-local, var(--space-xl));
}
.section-flow > * + * {
  margin-top: var(--space-local, var(--space-lg));
}
.stack > * + * {
  margin-top: var(--space-local, var(--space-md));
}
```

---

## 4. The Layout Toolkit: Your Building Blocks

This is your reference for the primary layout classes available in `css/layout.css`.

### Layout Primitives

* `.flex`: A simple flex container. Uses `gap` for spacing.
* `.grid`: A simple grid container. Uses `gap` for spacing.
* `.stack`, `.section-flow`, `.page-flow`: Vertical stacking containers.

### Contextual Spacing Modifiers

These classes work by overriding the `--space-local` variable used by our layout primitives. This allows you to easily adjust spacing without writing new CSS.

```css
/* css/layout.css */
.tight { --space-local: var(--space-sm); }
.loose { --space-local: var(--space-lg); }
```

**How to use them:**

```html
<!-- A normal stack -->
<div class="stack">...</div>

<!-- A stack with tighter spacing -->
<div class="stack tight">...</div>

<!-- A button group with looser spacing -->
<div class="button-group loose">...</div>
```

---

## 5. Component Guidelines

* **No External Margins:** All components (`.btn`, `.card`, `.accordion`, etc.) MUST NOT have `margin` applied to them directly.
* **Self-Contained:** Components should be able to be dropped into any layout container and have the spacing "just work."

```css
/* css/components.css */
.card {
  padding: var(--space-lg);
  border: 1px solid var(--ui-border-color);
  border-radius: var(--border-radius-md);
  /* NO MARGINS! */
}
```

---

## 6. Handling Exceptions: The "Escape Hatch"

No system is perfect. In rare cases, you may need a one-off spacing adjustment that doesn't fit the system. For these scenarios, and only after considering all other options, use the sanctioned `data-space` attribute.

```html
<!-- To be used only when absolutely necessary -->
<div class="card" data-margin-top="--space-xl">
  <!-- A code comment explaining why this was needed is required -->
  <!-- Example: This card must align with a dynamic element -->
</div>
```

A small JavaScript snippet can be used to apply these as inline styles. This keeps exceptions visible and searchable in the codebase. **Use this power wisely.**

---

## 7. Recipes: Common UI Patterns

This is where the system comes to life. Let's see how to build common layouts.

### Recipe 1: A Page Header

**Goal:** A header with a logo on the left and navigation links on the right.
**Tools:** A `.flex` container with `justify-content: space-between` and a `.button-group` for the nav links.

```html
<header class="flex items-center justify-between p-lg">
  <div class="logo">...</div>
  <nav class="button-group">
    <a href="#" class="btn">Home</a>
    <a href="#" class="btn">About</a>
    <a href="#" class="btn btn-primary">Contact</a>
  </nav>
</header>
```

### Recipe 2: A Blog Post Article

**Goal:** A clean, readable flow of text with proper typographic rhythm.
**Tools:** The `.prose` layout class, which is a specialized `stack` for typography.

```html
<article class="prose">
  <h1>The Art of CSS Architecture</h1>
  <p>It begins with a solid foundation...</p>
  <h2>Core Principles</h2>
  <p>The first pillar is separation of concerns.</p>
  <blockquote>"HTML is for meaning."</blockquote>
</article>
```

### Recipe 3: A Dashboard with Cards

**Goal:** A responsive grid of metric cards.
**Tools:** A `.page-flow` for the overall layout and a `.card-grid` for the cards themselves.

```html
<main class="page-flow p-lg">
  <div class="stack">
    <h1>Dashboard</h1>
    <p>Welcome back, User!</p>
  </div>

  <div class="card-grid">
    <div class="card">Metric 1</div>
    <div class="card">Metric 2</div>
    <div class="card">Metric 3</div>
    <div class="card">Metric 4</div>
  </div>
</main>
```

---

## 8. Appendix

### Rationale for Key Decisions

* **Why reset all default margins?** Browsers apply inconsistent default margins to elements like `<h1>` and `<p>`. We reset them all to `0` in `base.css` so that our layout system has full and predictable control over all spacing.
* **Why `--space-local`?** This generic variable name allows our spacing modifiers (`.tight`, `.loose`) to work on both `gap` and `margin`-based layouts without needing separate classes.

### Browser Support

This system relies on CSS Custom Properties, Flexbox `gap`, and Grid. These features are supported in all modern browsers (Chrome, Firefox, Safari, Edge) since early 2021. This architecture is safe for all projects that do not need to support Internet Explorer 11.
