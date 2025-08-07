# Fontolo - Live CSS Configurator and Design System

**Currently refining** - Functional live configurator with full CSS framework export.

*A customizable, token-driven design system and live CSS configuration tool for modern web development.*

## What is Fontolo?

Fontolo is a **living design system generator** that lets you visually configure design tokens and see them work in real-time. It's a complete UI framework that demonstrates itself through its own interface.

**Try it now:** [Live Configurator](fontolodemo.html)

**What makes Fontolo unique:**
- **Self-demonstrating system** - every UI component proves the design system works.
- **Complete framework export** - get tokens, utilities, and battle-tested components.
- **Live preview** - see changes instantly across typography, colors, spacing, and animations.
- **Professional components** - tabs, accordions, forms, notifications, and more.

---

## Current Features (Ready to Use)

### Live Configuration
- Real-time preview with instant updates.
- HSL color system with automatic variants.
- Modular typography scales (Golden ratio, custom ratios).
- Smart accessibility features with automatic contrast checking.
- Dynamic Google Fonts integration.

### Complete CSS Framework Export
- Design tokens as CSS custom properties.
- Utility class system for rapid development.
- Professional UI components (buttons, cards, forms, tabs, accordions).
- Three-layer spacing system with predictable layouts.
- Animation framework with easing functions.

### Battle-Tested Components
All components are built and proven within Fontolo itself:
- Navigation and tab controls
- Form elements with custom styling
- Accordion panels with smooth animations
- Notification system
- Card layouts and grid systems

---

## Quick Start

1.  **Try Online:** Open [fontolodemo.html](fontolodemo.html).
2.  **Adjust colors, fonts, and spacing** in the left panel.
3.  **See changes instantly** in the preview area.
4.  **Click "Generate & Download CSS"** when satisfied.
5.  **Use the exported CSS** in your project.

Or run locally:
```bash
git clone [https://github.com/CseperkePapp/fontolo.git](https://github.com/CseperkePapp/fontolo.git)
cd fontolo
open fontolodemo.html
```

---

## Project Structure

```
fontolo/
├── fontolodemo.html          # Main configurator application
├── index.html               # Entry point with style selector
├── app-intro.html           # App-style introduction
├── landing-intro.html       # Landing-style introduction  
├── css/
│   ├── tokens.css           # Design tokens and CSS custom properties
│   ├── base.css             # Typography and browser resets
│   ├── layout.css           # Spacing system and layout utilities
│   ├── components.css       # UI components library
│   └── utilities.css        # Visual utility classes
├── js/
│   └── configurator.js      # Live configuration functionality
└── docs/
    └── ArchitecturePrinciples.md  # Detailed CSS architecture guide
```

---

## Roadmap

### Phase 1: Core System (Complete)
- Live CSS configuration with real-time preview
- Complete utility class generation
- Professional component library
- Framework export functionality

### Phase 2: Platform Integration (Refining)
- WordPress integration - `theme.json` generation
- Tailwind CSS export - `tailwind.config.js` generation
- Framework adapters - React/Vue component examples
- Enhanced component library - Additional UI patterns

### Phase 3: Advanced Features (Planned)
- Figma integration - Design token sync
- Advanced animations - Rive integration
- Team collaboration - Shared design systems
- Template marketplace - Community contributions

---

## Perfect For

- **Frontend developers** - Working with any CSS framework or vanilla CSS.
- **WordPress developers** - Building custom themes (`theme.json` export coming soon).
- **Design system architects** - Creating scalable token foundations.
- **Agencies and freelancers** - Rapid design system prototyping.
- **No-code builders** - Visual design system creation.

---

## Contributing

Fontolo is open source and community-driven! We welcome:
- Bug reports with reproduction steps
- Feature requests and use case descriptions
- Code contributions for bug fixes and improvements
- Documentation improvements and examples
- Design contributions - component variants, themes, templates

See `CONTRIBUTING.md` for details.

---

## Current Status

Fontolo is in active refinement with a functional core system. The live configurator works, exports complete CSS frameworks, and demonstrates professional UI components. We're currently:
- Refining the user experience and interface
- Expanding the component library
- Preparing platform integrations (WordPress, Tailwind, etc.)
- Building documentation and examples

---

## Support

Built by Cseperke Papp.

If Fontolo helps your projects:
- ⭐ Star this repository
- 🐞 Report bugs and suggest features

---

## License

[MIT License](LICENSE) - see the full license for details.
