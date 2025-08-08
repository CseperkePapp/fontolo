# Fontolo - Live CSS Configurator and Design System

> **⚠️ CURRENT STATUS:** This repository is under major revision. The current version is functional but complex. We're building a simplified v2 in the `v2-simple` branch.
> 
> **For the cleanest experience:** Check back in 1-2 weeks for the simplified version, or try the current live demo at [fontolodemo.html](fontolodemo.html)

*Original description continues below...*


## 🎯 What is Fontolo?

Fontolo is a **living design system generator** that lets you visually configure design tokens and see them work in real-time. It's a complete UI framework that demonstrates itself through its own interface.

**Try a temporary version now:** [Live Configurator](fontolodemo.html)

**What makes Fontolo unique:**
- **Self-demonstrating system** - every UI component proves the design system works
- **Complete framework export** - get tokens, utilities, and battle-tested components
- **Live preview** - see changes instantly across typography, colors, spacing, and animations
- **Professional components** - tabs, accordions, forms, notifications, and more

## 🧠 A New Approach to Design Thinking

Fontolo represents a **novel paradigm** in web design tooling - instead of static mockups and disconnected style guides, you work with **living, interactive design systems**. Every change is instant, every component proves itself in real-time, and the entire interface demonstrates its own capabilities.

This approach opens up possibilities we're actively exploring:
- **Live documentation** that visitors can customize and interact with
- **Visual development environments** where design and code merge seamlessly  
- **Client presentation tools** with real-time design exploration
- **Interactive component libraries** that go beyond traditional style guides
- **Collaborative design systems** where teams can iterate together in real-time

*This is just the beginning - we have several exciting directions planned for expanding this foundation.*

## ✨ Current Features (Ready to Use)

### Live Configuration
- Real-time preview with instant updates.
- HSL color system with automatic variants.
- Modular typography scales (Golden ratio, custom ratios).
- Smart accessibility features with automatic contrast checking.
- Dynamic Google Fonts integration.

### Complete CSS Framework Export
- Design tokens as CSS custom properties. (This is messy now, but working on it)
- Utility class system for rapid development.
- Professional UI components (buttons, cards, forms, tabs, accordions).
- Three-layer spacing system with predictable layouts.
- Animation framework with easing functions.



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

### Phase 1: Core System (In progress)
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

## 🏗️ Current Status

Fontolo is in active refinement with a **functional core system** that already demonstrates something new in web design tooling. The live configurator works, exports complete CSS frameworks, and proves the concept of self-demonstrating design systems.

**What's working now:**
- Live configuration system in the main configurator (fontolodemo.html)
- Complete CSS framework export with production-ready code
- Professional UI component library demonstrated across multiple layout styles
- Novel three-layer CSS architecture that eliminates common spacing problems

**What we're refining:**
- Extending live configuration to all demo pages and layouts
- User experience and interface polish across different contexts
- Component library expansion and customization options

**Where we're heading:**
This foundation opens doors to entirely new approaches in visual web development. We're exploring how live design systems could transform everything from client presentations to collaborative development workflows. The self-demonstrating concept is just the beginning of what's possible when design tokens become interactive parameters rather than static files.

**Development philosophy:** Built for the joy of creation and shared openly because innovative tools should be accessible to everyone. This project grows through community engagement and real-world use cases.

---

## Support

Built by Cseperke Papp.

If Fontolo helps your projects:
- ⭐ Star this repository
- 🐞 Report bugs and suggest features

---

## License

[MIT License](LICENSE) - see the full license for details.
