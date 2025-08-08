// js/export-manager.js

// ========================================= 
// 1. MODULE DEFINITIONS
// ========================================= 
const EXPORT_MODULES = {
  tokens: {
    name: 'Design Tokens',
    description: 'CSS variables only (colors, spacing, typography)',
    size: '~5KB',
    required: true,
    includes: ['tokens.css']
  },
  
  reset: {
    name: 'Base Reset',
    description: 'Normalize & typography defaults',
    size: '~3KB',
    requires: ['tokens'],
    includes: ['base.css']
  },
  
  layout: {
    name: 'Layout System',
    description: 'Stack patterns, grid system, spacing utilities',
    size: '~15KB',
    requires: ['tokens'],
    includes: ['layout.css']
  },
  
  components: {
    name: 'Components',
    description: 'Buttons, cards, forms, accordions',
    size: '~25KB',
    requires: ['tokens', 'layout'],
    includes: ['components.css']
  },
  
  utilities: {
    name: 'Utility Classes',
    description: 'Text colors, backgrounds, borders',
    size: '~10KB',
    requires: ['tokens'],
    includes: ['utilities.css']
  },
  
  examples: {
    name: 'HTML Examples',
    description: 'Sample HTML pages using the system',
    size: '~20KB',
    requires: ['tokens', 'layout', 'components'],
    includes: ['examples/index.html', 'examples/blog.html', 'examples/dashboard.html']
  }
};

// ========================================= 
// 2. MODAL UI FUNCTIONS
// ========================================= 
function createExportModal() {
  closeExportModal();
  
  const modal = document.createElement('div');
  modal.className = 'export-modal';
  modal.style.cssText = 'position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center;';
  
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeExportModal()" 
         style="position: absolute; inset: 0; background: rgba(0,0,0,0.5);"></div>
    <div class="card" style="position: relative; max-width: 600px; max-height: 80vh; overflow-y: auto; z-index: 1001;">
      <div class="stack">
        <h2 class="text-2xl">Export Design System</h2>
        <p class="text-secondary">Choose what to include in your download:</p>
        
        <div class="stack tight">
          ${Object.entries(EXPORT_MODULES).map(([key, module]) => `
            <div class="card ${module.required ? 'bg-light' : ''}" style="cursor: pointer;">
              <label class="flex items-start" style="cursor: pointer;">
                <input type="checkbox" 
                       value="${key}" 
                       ${module.required ? 'checked disabled' : ''}
                       data-requires="${(module.requires || []).join(',')}"
                       style="margin-right: var(--space-sm);">
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <strong>${module.name}</strong>
                    <span class="text-sm text-secondary">${module.size}</span>
                  </div>
                  <p class="text-sm text-secondary">${module.description}</p>
                </div>
              </label>
            </div>
          `).join('')}
        </div>
        
        <div class="card bg-light">
          <div class="stack">
            <h3 class="text-lg">Export Format:</h3>
            <div class="stack tight">
              <label class="flex items-center">
                <input type="radio" name="format" value="separate" checked style="margin-right: var(--space-xs);">
                <span>Separate Files (development)</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="format" value="combined" style="margin-right: var(--space-xs);">
                <span>Single CSS File (production)</span>
              </label>
              <label class="flex items-center">
                <input type="radio" name="format" value="zip" style="margin-right: var(--space-xs);">
                <span>ZIP Package (complete project)</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <div class="text-sm">
            Total size: <strong id="totalSize" class="text-primary">~5KB</strong> | 
            Files: <strong id="fileCount" class="text-primary">1 file</strong>
          </div>
        </div>
        
        <div class="button-group justify-between">
          <button class="btn btn-secondary" onclick="closeExportModal()">Cancel</button>
          <button class="btn btn-primary" onclick="executeExport()">Download</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add dependency management
  modal.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', handleModuleDependencies);
  });
  
  updateExportPreview();
}

function handleModuleDependencies(e) {
  const checkbox = e.target;
  const requires = checkbox.dataset.requires?.split(',').filter(Boolean) || [];
  
  if (checkbox.checked) {
    // Auto-check required dependencies
    requires.forEach(dep => {
      const depCheckbox = document.querySelector(`input[value="${dep}"]`);
      if (depCheckbox && !depCheckbox.checked) {
        depCheckbox.checked = true;
        // Trigger change event to handle nested dependencies
        depCheckbox.dispatchEvent(new Event('change'));
      }
    });
  } else {
    // Check if anything depends on this
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(other => {
      const otherRequires = other.dataset.requires?.split(',').filter(Boolean) || [];
      if (otherRequires.includes(checkbox.value)) {
        other.checked = false;
        other.dispatchEvent(new Event('change'));
      }
    });
  }
  
  updateExportPreview();
}

function updateExportPreview() {
  const selected = Array.from(document.querySelectorAll('.export-modules input:checked'))
    .map(cb => cb.value);
  
  let totalSize = 0;
  let fileCount = 0;
  
  selected.forEach(key => {
    const module = EXPORT_MODULES[key];
    const sizeMatch = module.size.match(/~(\d+)KB/);
    if (sizeMatch) totalSize += parseInt(sizeMatch[1]);
    fileCount += module.includes.length;
  });
  
  document.getElementById('totalSize').textContent = `~${totalSize}KB`;
  document.getElementById('fileCount').textContent = `${fileCount} ${fileCount === 1 ? 'file' : 'files'}`;
}

function closeExportModal() {
  const modal = document.querySelector('.export-modal');
  if (modal) modal.remove();
}

// ========================================= 
// 3. EXPORT GENERATION
// ========================================= 
function executeExport() {
  const selectedModules = Array.from(
    document.querySelectorAll('.export-modules input:checked')
  ).map(cb => cb.value);
  
  const format = document.querySelector('input[name="format"]:checked').value;
  
  const exports = generateExports(selectedModules, format);
  
  switch(format) {
    case 'separate':
      downloadSeparateFiles(exports);
      break;
    case 'combined':
      downloadCombinedCSS(exports);
      break;
    case 'zip':
      downloadZipPackage(exports);
      break;
  }
  
  showNotification('Design system exported successfully!');
  closeExportModal();
}

function generateExports(modules, format) {
  const exports = {};
  
  if (modules.includes('tokens')) {
    exports['tokens.css'] = generateTokensCSS();
  }
  
  if (modules.includes('reset')) {
    exports['base.css'] = generateResetCSS();
  }
  
  if (modules.includes('layout')) {
    exports['layout.css'] = generateLayoutCSS();
  }
  
  if (modules.includes('components')) {
    exports['components.css'] = generateComponentsCSS();
  }
  
  if (modules.includes('utilities')) {
    exports['utilities.css'] = generateUtilitiesCSS();
  }
  
  if (modules.includes('examples')) {
    exports['examples/index.html'] = generateExampleHTML('landing');
    exports['examples/blog.html'] = generateExampleHTML('blog');
    exports['examples/dashboard.html'] = generateExampleHTML('dashboard');
  }
  
  return exports;
}

// ========================================= 
// 4. CSS GENERATORS
// ========================================= 
function generateTokensCSS() {
  const computedStyle = getComputedStyle(document.documentElement);
  let css = `/* ========================================= */
/* FONTOLO DESIGN TOKENS                    */
/* Generated: ${new Date().toISOString()}    */
/* ========================================= */

:root {`;

  // Define token groups in order
  const tokenGroups = {
    'Base Units & Ratios': [
      '--base-font-size',
      '--base-line-height', 
      '--golden-ratio'
    ],
    'Color HSL Values': [
      '--color-primary-hue',
      '--color-primary-saturation',
      '--color-primary-lightness',
      '--color-secondary-hue',
      '--color-secondary-saturation',
      '--color-secondary-lightness',
      '--color-accent-hue',
      '--color-accent-saturation',
      '--color-accent-lightness',
      '--color-neutral-hue',
      '--color-neutral-saturation',
      '--color-neutral-lightness',
      '--color-neutral-dark-lightness',
      '--color-neutral-light-lightness',
      '--background-hue',
      '--background-saturation',
      '--background-lightness'
    ],
    'Derived Colors': [
      '--color-primary',
      '--color-primary-darker',
      '--color-primary-lighter',
      '--color-secondary',
      '--color-secondary-darker',
      '--color-accent',
      '--color-neutral',
      '--color-text-dark',
      '--color-text-light',
      '--color-text-default',
      '--color-text-secondary',
      '--color-background'
    ],
    'Typography': [
      '--font-family-body',
      '--font-family-heading',
      '--font-weight-light',
      '--font-weight-normal',
      '--font-weight-medium',
      '--font-weight-semibold',
      '--font-weight-bold',
      '--line-height-heading',
      '--font-size-xs',
      '--font-size-sm',
      '--font-size-base',
      '--font-size-lg',
      '--font-size-xl',
      '--font-size-2xl',
      '--font-size-3xl'
    ],
    'Spacing Scale': [
      '--space-xxs',
      '--space-xs',
      '--space-sm',
      '--space-md',
      '--space-lg',
      '--space-xl',
      '--space-xxl'
    ],
    'Border Radii': [
      '--border-radius-sm',
      '--border-radius-md',
      '--border-radius-lg',
      '--border-radius-full'
    ],
    'Animation': [
      '--anim-duration-medium',
      '--anim-duration-quick',
      '--anim-duration-short',
      '--anim-duration-long',
      '--ease-smooth',
      '--ease-accelerate',
      '--ease-decelerate',
      '--ease-constant',
      '--ease-springy',
      '--ease-snap'
    ],
    'UI Framework': [
      '--ui-border-width',
      '--ui-border-style',
      '--ui-border-color'
    ],
    'Heading Colors': [
      '--h1-color',
      '--h2-color',
      '--h3-color',
      '--h4-color',
      '--h5-color',
      '--h6-color'
    ]
  };

  Object.entries(tokenGroups).forEach(([group, tokens]) => {
    css += `\n  /* --- ${group} --- */\n`;
    tokens.forEach(token => {
      const value = computedStyle.getPropertyValue(token).trim();
      if (value) {
        css += `  ${token}: ${value};\n`;
      }
    });
  });

  css += `}\n`;
  return css;
}

function generateResetCSS() {
  return `/* ========================================= */
/* FONTOLO BASE STYLES                      */
/* Reset and typography defaults            */
/* ========================================= */

html {
  font-size: var(--base-font-size);
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: var(--font-family-body);
  font-size: var(--font-size-base);
  line-height: var(--base-line-height);
  color: var(--color-text-default);
  background-color: var(--color-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Typography Reset - NO DEFAULT MARGINS */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
  line-height: var(--line-height-heading);
  margin: 0;
}

h1 { font-size: var(--font-size-3xl); color: var(--h1-color); }
h2 { font-size: var(--font-size-2xl); color: var(--h2-color); }
h3 { font-size: var(--font-size-xl); color: var(--h3-color); }
h4 { font-size: var(--font-size-lg); color: var(--h4-color); }
h5 { font-size: var(--font-size-base); color: var(--h5-color); }
h6 { font-size: var(--font-size-sm); color: var(--h6-color); }

p, ul, ol {
  margin: 0;
  line-height: var(--base-line-height);
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Form Elements */
input, textarea, select, button {
  font-family: inherit;
  font-size: inherit;
}

fieldset, legend {
  margin: 0;
  padding: 0;
  border: none;
}`;
}

function generateLayoutCSS() {
  return `/* ========================================= */
/* FONTOLO LAYOUT SYSTEM                    */
/* Three-layer spacing model                */
/* ========================================= */

/* ========================================= */
/* LAYER 2: INTERNAL SPACING (gap property) */
/* ========================================= */

/* Basic Layout Primitives */
.flex {
  display: flex;
  gap: var(--space-local, var(--space-md));
}

.grid {
  display: grid;
  gap: var(--space-local, var(--space-md));
}

/* Specialized Containers */
.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-local, var(--space-md));
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-local, var(--space-lg));
}

.inline-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-local, var(--space-sm));
}

/* ========================================= */
/* LAYER 3: FLOW SPACING (Stack patterns)   */
/* ========================================= */

/* Page-level vertical rhythm */
.page-flow > * + * {
  margin-top: var(--space-local, var(--space-xl));
}

/* Section-level vertical rhythm */
.section-flow > * + * {
  margin-top: var(--space-local, var(--space-lg));
}

/* General-purpose content stacking */
.stack > * + * {
  margin-top: var(--space-local, var(--space-md));
}

/* Typography-specific rhythm */
.prose > * + * {
  margin-top: var(--space-local, var(--space-md));
}

.prose > h1 + *,
.prose > h2 + * {
  margin-top: var(--space-lg);
}

.prose > h3 + * {
  margin-top: var(--space-md);
}

/* ========================================= */
/* CONTEXTUAL SPACING MODIFIERS             */
/* ========================================= */

.tight { --space-local: var(--space-sm); }
.loose { --space-local: var(--space-lg); }
.extra-loose { --space-local: var(--space-xl); }

/* ========================================= */
/* CONTAINER SYSTEM                         */
/* ========================================= */

.container {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 var(--space-lg);
}

.container-narrow {
  max-width: 800px;
}

.container-wide {
  max-width: 1400px;
}

/* ========================================= */
/* FLEXBOX UTILITIES                        */
/* ========================================= */

.flex-row { flex-direction: row; }
.flex-col { flex-direction: column; }
.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }
.flex-wrap { flex-wrap: wrap; }
.flex-1 { flex: 1; }

/* ========================================= */
/* GRID UTILITIES                           */
/* ========================================= */

.grid-auto { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.grid-1 { grid-template-columns: 1fr; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* ========================================= */
/* RESPONSIVE DESIGN                        */
/* ========================================= */

@media (max-width: 768px) {
  .container {
    padding: 0 var(--space-md);
  }
  
  .grid-2,
  .grid-3,
  .grid-4 {
    grid-template-columns: 1fr;
  }
  
  .mobile-tight { --space-local: var(--space-xs); }
  .mobile-normal { --space-local: var(--space-sm); }
}`;
}

function generateComponentsCSS() {
  return `/* ========================================= */
/* FONTOLO COMPONENT SYSTEM                 */
/* Components with NO external margins      */
/* ========================================= */

/* ========================================= */
/* BUTTON COMPONENTS                        */
/* ========================================= */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-sm) var(--space-lg);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: white;
  border: 2px solid transparent;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.btn-primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-darker);
  border-color: var(--color-primary-darker);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-secondary {
  background-color: var(--color-secondary);
  border-color: var(--color-secondary);
}

.btn-secondary:hover {
  background-color: var(--color-secondary-darker);
  border-color: var(--color-secondary-darker);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-outline {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-outline:hover {
  background-color: var(--color-primary);
  color: white;
}

/* Button Sizes */
.btn-sm {
  padding: var(--space-xs) var(--space-md);
  font-size: var(--font-size-sm);
}

.btn-lg {
  padding: var(--space-md) var(--space-xl);
  font-size: var(--font-size-lg);
}

/* ========================================= */
/* CARD COMPONENTS                          */
/* ========================================= */

.card {
  background-color: white;
  border: 1px solid var(--ui-border-color);
  border-radius: var(--border-radius-md);
  padding: var(--space-lg);
  transition: all 0.2s ease-out;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-header {
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--ui-border-color);
  margin: 0 0 var(--space-md) 0;
}

.card-footer {
  padding-top: var(--space-md);
  border-top: 1px solid var(--ui-border-color);
  margin: var(--space-md) 0 0 0;
}

/* ========================================= */
/* FORM COMPONENTS                          */
/* ========================================= */

.form-group {
  /* NO external margins */
}

.form-label {
  display: block;
  margin-bottom: var(--space-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-default);
  font-size: var(--font-size-sm);
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--ui-border-color);
  border-radius: var(--border-radius-sm);
  background-color: white;
  color: var(--color-text-default);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.1);
}

/* ========================================= */
/* NOTIFICATION COMPONENTS                  */
/* ========================================= */

.notification {
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  max-width: 100%;
}

.notification-success {
  background-color: hsl(140, 70%, 40%);
  color: white;
}

.notification-error {
  background-color: hsl(0, 70%, 50%);
  color: white;
}

.notification-info {
  background-color: var(--color-primary);
  color: white;
}

.notification-warning {
  background-color: hsl(45, 100%, 50%);
  color: var(--color-text-dark);
}`;
}

function generateUtilitiesCSS() {
  return `/* ========================================= */
/* FONTOLO UTILITY CLASSES                  */
/* Visual-only utilities - NO SPACING       */
/* ========================================= */

/* Typography Utilities */
.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }
.text-2xl { font-size: var(--font-size-2xl); }
.text-3xl { font-size: var(--font-size-3xl); }

/* Font Weights */
.font-light { font-weight: var(--font-weight-light); }
.font-normal { font-weight: var(--font-weight-normal); }
.font-medium { font-weight: var(--font-weight-medium); }
.font-semibold { font-weight: var(--font-weight-semibold); }
.font-bold { font-weight: var(--font-weight-bold); }

/* Text Colors */
.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-secondary); }
.text-accent { color: var(--color-accent); }
.text-neutral { color: var(--color-neutral); }
.text-dark { color: var(--color-text-dark); }
.text-light { color: var(--color-text-light); }

/* Background Colors */
.bg-primary { background-color: var(--color-primary); }
.bg-secondary { background-color: var(--color-secondary); }
.bg-accent { background-color: var(--color-accent); }
.bg-neutral { background-color: var(--color-neutral); }
.bg-light { background-color: var(--color-background); }
.bg-white { background-color: white; }
.bg-transparent { background-color: transparent; }

/* Text Alignment */
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

/* Display Properties */
.block { display: block; }
.inline { display: inline; }
.inline-block { display: inline-block; }
.hidden { display: none; }

/* Border Utilities */
.border { border: var(--ui-border-width) var(--ui-border-style) var(--ui-border-color); }
.border-t { border-top: var(--ui-border-width) var(--ui-border-style) var(--ui-border-color); }
.border-r { border-right: var(--ui-border-width) var(--ui-border-style) var(--ui-border-color); }
.border-b { border-bottom: var(--ui-border-width) var(--ui-border-style) var(--ui-border-color); }
.border-l { border-left: var(--ui-border-width) var(--ui-border-style) var(--ui-border-color); }
.border-0 { border: none; }

/* Border Radius Utilities */
.rounded-sm { border-radius: var(--border-radius-sm); }
.rounded { border-radius: var(--border-radius-md); }
.rounded-lg { border-radius: var(--border-radius-lg); }
.rounded-full { border-radius: var(--border-radius-full); }
.rounded-none { border-radius: 0; }`;
}

// ========================================= 
// 5. HTML EXAMPLE GENERATORS
// ========================================= 
function generateExampleHTML(type) {
  const templates = {
    landing: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Landing Page - Fontolo Design System</title>
    <link rel="stylesheet" href="../tokens.css">
    <link rel="stylesheet" href="../base.css">
    <link rel="stylesheet" href="../layout.css">
    <link rel="stylesheet" href="../components.css">
    <link rel="stylesheet" href="../utilities.css">
</head>
<body>
    <header class="hero bg-light">
        <div class="container text-center page-flow">
            <h1 class="text-3xl">Welcome to Your New Site</h1>
            <p class="text-lg text-secondary">Built with Fontolo Design System</p>
            <div class="button-group justify-center">
                <a href="#" class="btn btn-primary btn-lg">Get Started</a>
                <a href="#" class="btn btn-outline btn-lg">Learn More</a>
            </div>
        </div>
    </header>
    
    <section class="container section-flow">
        <h2 class="text-2xl text-center">Features</h2>
        <div class="card-grid">
            <div class="card">
                <div class="stack">
                    <h3 class="text-xl">Responsive</h3>
                    <p>Works beautifully on all screen sizes</p>
                </div>
            </div>
            <div class="card">
                <div class="stack">
                    <h3 class="text-xl">Customizable</h3>
                    <p>Easy to adjust colors, spacing, and typography</p>
                </div>
            </div>
            <div class="card">
                <div class="stack">
                    <h3 class="text-xl">Accessible</h3>
                    <p>Built with accessibility in mind</p>
                </div>
            </div>
        </div>
    </section>
    
    <footer class="bg-light text-center">
        <div class="container stack">
            <p>Built with Fontolo Design System</p>
            <p class="text-sm text-secondary">© 2025 Your Company</p>
        </div>
    </footer>
</body>
</html>`,

    blog: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog Post - Fontolo Design System</title>
    <link rel="stylesheet" href="../tokens.css">
    <link rel="stylesheet" href="../base.css">
    <link rel="stylesheet" href="../layout.css">
    <link rel="stylesheet" href="../components.css">
    <link rel="stylesheet" href="../utilities.css">
</head>
<body>
    <article class="container-narrow prose">
        <header class="stack">
            <h1>The Art of Design Systems</h1>
            <div class="flex items-center text-sm text-secondary">
                <time>January 1, 2025</time>
                <span>•</span>
                <span>5 min read</span>
            </div>
        </header>
        
        <p class="text-lg">
            Design systems are more than just collections of components. They're 
            living, breathing ecosystems that enable teams to build consistent, 
            beautiful interfaces at scale.
        </p>
        
        <h2>Why Design Systems Matter</h2>
        <p>
           In today's digital landscape, consistency is key. Users expect seamless 
           experiences across all touchpoints, and design systems help deliver that 
           consistency while improving development efficiency.
       </p>
       
       <h3>Benefits for Teams</h3>
       <ul>
           <li>Faster development with reusable components</li>
           <li>Consistent user experience across products</li>
           <li>Easier onboarding for new team members</li>
           <li>Reduced design debt over time</li>
       </ul>
       
       <blockquote>
           "A design system isn't a project. It's a product serving products." 
           — Nathan Curtis
       </blockquote>
       
       <h2>Getting Started</h2>
       <p>
           Building a design system doesn't have to be overwhelming. Start small 
           with core tokens like colors and spacing, then gradually add components 
           as patterns emerge in your products.
       </p>
       
       <div class="card bg-light">
           <div class="stack">
               <h4>Pro Tip</h4>
               <p>Use CSS custom properties for your design tokens. They make 
               theming and customization much easier.</p>
           </div>
       </div>
       
       <footer class="border-t">
           <div class="flex justify-between items-center">
               <a href="#" class="btn btn-outline btn-sm">← Previous Post</a>
               <a href="#" class="btn btn-outline btn-sm">Next Post →</a>
           </div>
       </footer>
   </article>
</body>
</html>`,

   dashboard: `<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Dashboard - Fontolo Design System</title>
   <link rel="stylesheet" href="../tokens.css">
   <link rel="stylesheet" href="../base.css">
   <link rel="stylesheet" href="../layout.css">
   <link rel="stylesheet" href="../components.css">
   <link rel="stylesheet" href="../utilities.css">
</head>
<body>
   <div class="flex" style="min-height: 100vh;">
       <!-- Sidebar -->
       <aside class="bg-light border-r" style="width: 250px; padding: var(--space-lg);">
           <div class="stack">
               <h2 class="text-lg font-bold">Dashboard</h2>
               <nav class="stack tight">
                   <a href="#" class="text-primary">Overview</a>
                   <a href="#" class="text-secondary">Analytics</a>
                   <a href="#" class="text-secondary">Reports</a>
                   <a href="#" class="text-secondary">Settings</a>
               </nav>
           </div>
       </aside>
       
       <!-- Main Content -->
       <main class="flex-1" style="padding: var(--space-xl);">
           <div class="section-flow">
               <header class="flex justify-between items-center">
                   <h1 class="text-2xl">Overview</h1>
                   <div class="button-group">
                       <button class="btn btn-outline btn-sm">Export</button>
                       <button class="btn btn-primary btn-sm">Add New</button>
                   </div>
               </header>
               
               <!-- Metrics Grid -->
               <div class="grid grid-4">
                   <div class="card">
                       <div class="stack tight">
                           <p class="text-sm text-secondary">Total Users</p>
                           <p class="text-2xl font-bold">1,234</p>
                           <p class="text-xs text-accent">+12% from last month</p>
                       </div>
                   </div>
                   <div class="card">
                       <div class="stack tight">
                           <p class="text-sm text-secondary">Revenue</p>
                           <p class="text-2xl font-bold">$45.2k</p>
                           <p class="text-xs text-accent">+8% from last month</p>
                       </div>
                   </div>
                   <div class="card">
                       <div class="stack tight">
                           <p class="text-sm text-secondary">Active Projects</p>
                           <p class="text-2xl font-bold">12</p>
                           <p class="text-xs text-secondary">2 pending review</p>
                       </div>
                   </div>
                   <div class="card">
                       <div class="stack tight">
                           <p class="text-sm text-secondary">Completion Rate</p>
                           <p class="text-2xl font-bold">89%</p>
                           <p class="text-xs text-accent">+5% from last month</p>
                       </div>
                   </div>
               </div>
               
               <!-- Table -->
               <div class="card">
                   <h2 class="text-xl">Recent Activity</h2>
                   <table style="width: 100%; margin-top: var(--space-md);">
                       <thead>
                           <tr class="border-b">
                               <th class="text-left text-sm">User</th>
                               <th class="text-left text-sm">Action</th>
                               <th class="text-left text-sm">Date</th>
                           </tr>
                       </thead>
                       <tbody>
                           <tr class="border-b">
                               <td>John Doe</td>
                               <td>Created new project</td>
                               <td>2 hours ago</td>
                           </tr>
                           <tr class="border-b">
                               <td>Jane Smith</td>
                               <td>Updated settings</td>
                               <td>5 hours ago</td>
                           </tr>
                           <tr class="border-b">
                               <td>Bob Johnson</td>
                               <td>Completed task</td>
                               <td>1 day ago</td>
                           </tr>
                       </tbody>
                   </table>
               </div>
           </div>
       </main>
   </div>
</body>
</html>`
 };

 return templates[type] || templates.landing;
}

// ========================================= 
// 6. DOWNLOAD METHODS
// ========================================= 
function downloadSeparateFiles(exports) {
 Object.entries(exports).forEach(([filename, content]) => {
   // Create appropriate MIME type
   const mimeType = filename.endsWith('.html') ? 'text/html' : 'text/css';
   downloadFile(filename.replace('/', '-'), content, mimeType);
 });
}

function downloadCombinedCSS(exports) {
 // Combine all CSS in the right order
 const order = ['tokens.css', 'base.css', 'layout.css', 'components.css', 'utilities.css'];
 let combined = `/* ========================================= */
/* FONTOLO DESIGN SYSTEM - COMPLETE BUNDLE  */
/* Generated: ${new Date().toISOString()}    */
/* Modules: ${Object.keys(exports).filter(k => k.endsWith('.css')).join(', ')} */
/* ========================================= */\n\n`;
 
 order.forEach(filename => {
   if (exports[filename]) {
     combined += exports[filename] + '\n\n';
   }
 });
 
 downloadFile('fontolo-design-system.css', combined, 'text/css');
}

async function downloadZipPackage(exports) {
 // Check if JSZip is available
 if (typeof JSZip === 'undefined') {
   // Fallback to downloading files separately
   console.warn('JSZip not found, downloading files separately');
   downloadSeparateFiles(exports);
   return;
 }
 
 const zip = new JSZip();
 
 // Add README
 zip.file('README.md', generateReadme(Object.keys(exports)));
 
 // Add all export files
 Object.entries(exports).forEach(([path, content]) => {
   zip.file(path, content);
 });
 
 // Add package.json for npm users
 if (Object.keys(exports).some(k => k.endsWith('.css'))) {
   zip.file('package.json', generatePackageJson());
 }
 
 // Generate and download zip
 const blob = await zip.generateAsync({ type: 'blob' });
 downloadFile('fontolo-design-system.zip', blob, 'application/zip');
}

function downloadFile(filename, content, mimeType) {
 const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
 const a = document.createElement('a');
 a.href = URL.createObjectURL(blob);
 a.download = filename;
 a.click();
 URL.revokeObjectURL(a.href);
}

// ========================================= 
// 7. HELPER FUNCTIONS
// ========================================= 
function generateReadme(modules) {
 return `# Fontolo Design System

Generated: ${new Date().toISOString()}

## Included Modules

${modules.map(m => `- ${m}`).join('\n')}

## Quick Start

### For Static Sites

Link the CSS files in your HTML:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
   <link rel="stylesheet" href="tokens.css">
   <link rel="stylesheet" href="base.css">
   <link rel="stylesheet" href="layout.css">
   <link rel="stylesheet" href="components.css">
   <link rel="stylesheet" href="utilities.css">
</head>
<body>
   <!-- Your content here -->
</body>
</html>
\`\`\`

### For Single File Usage

If you downloaded the combined CSS:

\`\`\`html
<link rel="stylesheet" href="fontolo-design-system.css">
\`\`\`

## Layout System

This design system uses a three-layer spacing model:

1. **Design Tokens** - CSS custom properties for all values
2. **Internal Spacing** - Use \`gap\` for spacing between children
3. **Flow Spacing** - Use stack patterns for vertical rhythm

### Example: Card Grid

\`\`\`html
<div class="card-grid">
   <div class="card">
       <div class="stack">
           <h3>Card Title</h3>
           <p>Card content goes here</p>
           <button class="btn btn-primary">Action</button>
       </div>
   </div>
   <!-- More cards... -->
</div>
\`\`\`

### Example: Page Layout

\`\`\`html
<body>
   <div class="page-flow">
       <header class="container">
           <!-- Header content -->
       </header>
       
       <main class="container section-flow">
           <!-- Main content -->
       </main>
       
       <footer class="container">
           <!-- Footer content -->
       </footer>
   </div>
</body>
\`\`\`

## Components

### Buttons

\`\`\`html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-outline">Outline</button>
\`\`\`

### Cards

\`\`\`html
<div class="card">
   <div class="stack">
       <h3>Card Title</h3>
       <p>Card content</p>
   </div>
</div>
\`\`\`

## Customization

All design tokens can be customized by overriding CSS custom properties:

\`\`\`css
:root {
   /* Override primary color */
   --color-primary: hsl(220, 90%, 50%);
   
   /* Override spacing */
   --space-md: 1.5rem;
   
   /* Override fonts */
   --font-family-body: 'Your Font', sans-serif;
}
\`\`\`

## Documentation

For complete documentation and the visual configurator, visit:
https://github.com/CseperkePapp/fontolo

## License

MIT License - See LICENSE file for details.
`;
}

function generatePackageJson() {
 return JSON.stringify({
   name: "fontolo-design-system",
   version: "1.0.0",
   description: "Design system generated by Fontolo CSS Configurator",
   main: "tokens.css",
   style: "fontolo-design-system.css",
   keywords: [
     "css",
     "design-system",
     "design-tokens",
     "fontolo",
     "ui-framework"
   ],
   author: "Generated by Fontolo",
   license: "MIT",
   homepage: "https://github.com/CseperkePapp/fontolo",
   repository": {
     "type": "git",
     "url": "https://github.com/CseperkePapp/fontolo.git"
   }
 }, null, 2);
}

// ========================================= 
// 8. UTILITY: NOTIFICATION
// ========================================= 
function showNotification(message, isError = false) {
 // Check if notification element exists
 let notification = document.getElementById('notification');
 if (!notification) {
   notification = document.createElement('div');
   notification.id = 'notification';
   notification.className = 'notification';
   document.body.appendChild(notification);
 }
 
 notification.textContent = message;
 notification.className = isError ? 'notification error show' : 'notification success show';
 
 setTimeout(() => {
   notification.classList.remove('show');
 }, 4000);
}

// Make functions globally available for onclick handlers
window.closeExportModal = closeExportModal;
window.executeExport = executeExport;
window.createExportModal = createExportModal;
