/* ========================================= */
/* FONTOLO CONFIGURATOR                     */
/* Live CSS design system configuration     */
/* ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    
    // ========================================= 
    // 1. CONFIGURATION & CONSTANTS
    // ========================================= 
    const CONFIG = {
        ratioValues: [
            { value: 1.125, symbol: "1.125" }, { value: 1.25, symbol: "1.25" },
            { value: 1.333, symbol: "1.333" }, { value: 1.414, symbol: "√2" },
            { value: 1.5, symbol: "1.5" }, { value: 1.618, symbol: "φ" },
            { value: 1.75, symbol: "1.75" }, { value: 2.0, symbol: "2.0" }
        ],
        
        colorOptions: [
            { value: 'default', text: 'Default' },
            { value: 'primary', text: 'Primary' },
            { value: 'secondary', text: 'Secondary' },
            { value: 'accent', text: 'Accent' },
            { value: 'neutral', text: 'Neutral' }
        ],
        
        tabSectionMap: {
            sample: 'base',
            palette: 'colors',
            headers: 'fonts',
            cards: 'frames',
            interaction: 'frames',
            animations: 'animations'
        }
    };

    // ========================================= 
    // 2. DOM ELEMENT SELECTION
    // ========================================= 
    const elements = {
        controls: {
            baseFontSize: document.getElementById('baseFontSize'),
            goldenRatio: document.getElementById('goldenRatio'),
            lineHeight: document.getElementById('lineHeight'),
            primaryHue: document.getElementById('primaryHue'),
            primarySaturation: document.getElementById('primarySaturation'),
            primaryLightness: document.getElementById('primaryLightness'),
            secondaryHue: document.getElementById('secondaryHue'),
            secondarySaturation: document.getElementById('secondarySaturation'),
            secondaryLightness: document.getElementById('secondaryLightness'),
            accentHue: document.getElementById('accentHue'),
            accentSaturation: document.getElementById('accentSaturation'),
            accentLightness: document.getElementById('accentLightness'),
            neutralHue: document.getElementById('neutralHue'),
            neutralSaturation: document.getElementById('neutralSaturation'),
            neutralLightness: document.getElementById('neutralLightness'),
            backgroundHue: document.getElementById('backgroundHue'),
            backgroundSaturation: document.getElementById('backgroundSaturation'),
            backgroundLightness: document.getElementById('backgroundLightness'),
            darkLightness: document.getElementById('darkLightness'),
            mediumLightness: document.getElementById('mediumLightness'),
            fontFamilyBody: document.getElementById('fontFamilyBody'),
            fontFamilyHeading: document.getElementById('fontFamilyHeading'),
            borderRadiusMd: document.getElementById('borderRadiusMd'),
            uiBorderWidth: document.getElementById('uiBorderWidth'),
            animDuration: document.getElementById('animDuration'),
            borderColor: document.getElementById('borderColor'),
            borderStyle: document.getElementById('borderStyle'),
            borderImageSource: document.getElementById('borderImageSource'),
            borderImageSlice: document.getElementById('borderImageSlice'),
            borderImageWidth: document.getElementById('borderImageWidth'),
            borderImageOutset: document.getElementById('borderImageOutset'),
            accessibilityLock: document.getElementById('accessibilityLock')
        },

        valueDisplays: {
            baseFontSize: document.getElementById('baseFontSizeValue'),
            goldenRatio: document.getElementById('goldenRatioValue'),
            lineHeight: document.getElementById('lineHeightValue'),
            primaryHue: document.getElementById('primaryHueValue'),
            primarySaturation: document.getElementById('primarySaturationValue'),
            primaryLightness: document.getElementById('primaryLightnessValue'),
            secondaryHue: document.getElementById('secondaryHueValue'),
            secondarySaturation: document.getElementById('secondarySaturationValue'),
            secondaryLightness: document.getElementById('secondaryLightnessValue'),
            accentHue: document.getElementById('accentHueValue'),
            accentSaturation: document.getElementById('accentSaturationValue'),
            accentLightness: document.getElementById('accentLightnessValue'),
            neutralHue: document.getElementById('neutralHueValue'),
            neutralSaturation: document.getElementById('neutralSaturationValue'),
            neutralLightness: document.getElementById('neutralLightnessValue'),
            backgroundHue: document.getElementById('backgroundHueValue'),
            backgroundSaturation: document.getElementById('backgroundSaturationValue'),
            backgroundLightness: document.getElementById('backgroundLightnessValue'),
            darkLightness: document.getElementById('darkLightnessValue'),
            mediumLightness: document.getElementById('mediumLightnessValue'),
            borderRadiusMd: document.getElementById('borderRadiusMdValue'),
            uiBorderWidth: document.getElementById('uiBorderWidthValue'),
            animDuration: document.getElementById('animDurationValue')
        },
        
        colorValueDisplays: {
            primary: document.getElementById('primary-color-value'),
            primaryDark: document.getElementById('primary-dark-color-value'),
            primaryLight: document.getElementById('primary-light-color-value'),
            secondary: document.getElementById('secondary-color-value'),
            accent: document.getElementById('accent-color-value'),
            background: document.getElementById('background-color-value')
        },
        
        spacingValueDisplays: {
            xxs: document.getElementById('spaceXxsValue'),
            xs: document.getElementById('spaceXsValue'),
            sm: document.getElementById('spaceSmValue'),
            md: document.getElementById('spaceMdValue'),
            lg: document.getElementById('spaceLgValue'),
            xl: document.getElementById('spaceXlValue')
        },
        
        ui: {
            notification: document.getElementById('notification'),
            generateCssBtn: document.getElementById('generateCssBtn'),
            tabControls: document.querySelector('.tab-controls'),
            nav: document.querySelector('.nav'),
            sectionsContainer: document.getElementById('sections-container')
        }
    };

    // ========================================= 
    // 3. UTILITY FUNCTIONS
    // ========================================= 
    const updateCSSVariable = (property, value) => {
        document.documentElement.style.setProperty(property, value);
    };

    const showNotification = (message, isError = false) => {
        const notification = elements.ui.notification;
        notification.textContent = message;
        notification.className = isError ? 'notification error show' : 'notification success show';
        setTimeout(() => notification.classList.remove('show'), 4000);
    };

    // ========================================= 
    // 4. TOKEN MANAGEMENT
    // ========================================= 
    function updateColorPreviews() {
        const previews = {
            primaryColorPreview: `hsl(${elements.controls.primaryHue.value}, ${elements.controls.primarySaturation.value}%, ${elements.controls.primaryLightness.value}%)`,
            secondaryColorPreview: `hsl(${elements.controls.secondaryHue.value}, ${elements.controls.secondarySaturation.value}%, ${elements.controls.secondaryLightness.value}%)`,
            accentColorPreview: `hsl(${elements.controls.accentHue.value}, ${elements.controls.accentSaturation.value}%, ${elements.controls.accentLightness.value}%)`,
            neutralColorPreview: `hsl(${elements.controls.neutralHue.value}, ${elements.controls.neutralSaturation.value}%, ${elements.controls.neutralLightness.value}%)`,
            backgroundColorPreview: `hsl(${elements.controls.backgroundHue.value}, ${elements.controls.backgroundSaturation.value}%, ${elements.controls.backgroundLightness.value}%)`,
            neutralDarkColorPreview: `hsl(${elements.controls.neutralHue.value}, ${elements.controls.neutralSaturation.value}%, ${elements.controls.darkLightness.value}%)`,
            neutralMediumColorPreview: `hsl(${elements.controls.neutralHue.value}, ${elements.controls.neutralSaturation.value}%, ${elements.controls.mediumLightness.value}%)`
        };

        Object.entries(previews).forEach(([id, color]) => {
            const element = document.getElementById(id);
            if (element) element.style.backgroundColor = color;
        });
    }
    
    function updateCalculatedValues() {
        const computedStyle = getComputedStyle(document.documentElement);
        
        // Update color value displays
        Object.keys(elements.colorValueDisplays).forEach(key => {
            const cssVar = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            const element = elements.colorValueDisplays[key];
            if (element) element.textContent = computedStyle.getPropertyValue(cssVar).trim();
        });
        
        // Update spacing value displays
        Object.keys(elements.spacingValueDisplays).forEach(key => {
            const element = elements.spacingValueDisplays[key];
            if (element) {
                const value = parseFloat(computedStyle.getPropertyValue(`--space-${key}`));
                element.textContent = value.toFixed(3) + 'rem';
            }
        });
        
        // Check accessibility if enabled
        if (elements.controls.accessibilityLock && elements.controls.accessibilityLock.checked) {
            checkAndAdjustContrast();
        }
    }

    // ========================================= 
    // 5. INPUT HANDLING
    // ========================================= 
    function handleInputChange(e) {
        const { id, value } = e.target;
        const valueDisplay = elements.valueDisplays[id];
        let unit = '';
        let displayValue = value;

        // Handle different input types
        switch(id) {
            case 'baseFontSize': 
                updateCSSVariable('--base-font-size', value + 'px'); 
                unit = 'px'; 
                break;
            case 'lineHeight': 
                updateCSSVariable('--base-line-height', value); 
                break;
            case 'goldenRatio': 
                const ratio = CONFIG.ratioValues[parseInt(value)]; 
                updateCSSVariable('--golden-ratio', ratio.value); 
                displayValue = `${ratio.symbol} ${ratio.value}`; 
                break;
            case 'primaryHue': 
                updateCSSVariable('--color-primary-hue', value); 
                break;
            case 'primarySaturation': 
                updateCSSVariable('--color-primary-saturation', value + '%'); 
                unit = '%'; 
                break;
            case 'primaryLightness': 
                updateCSSVariable('--color-primary-lightness', value + '%'); 
                unit = '%'; 
                break;
            case 'secondaryHue': 
                updateCSSVariable('--color-secondary-hue', value); 
                break;
            case 'secondarySaturation': 
                updateCSSVariable('--color-secondary-saturation', value + '%'); 
                unit = '%'; 
                break;
            case 'secondaryLightness': 
                updateCSSVariable('--color-secondary-lightness', value + '%'); 
                unit = '%'; 
                break;
            case 'accentHue': 
                updateCSSVariable('--color-accent-hue', value); 
                break;
            case 'accentSaturation': 
                updateCSSVariable('--color-accent-saturation', value + '%'); 
                unit = '%'; 
                break;
            case 'accentLightness': 
                updateCSSVariable('--color-accent-lightness', value + '%'); 
                unit = '%'; 
                break;
            case 'neutralHue': 
                updateCSSVariable('--color-neutral-hue', value); 
                break;
            case 'neutralSaturation': 
                updateCSSVariable('--color-neutral-saturation', value + '%'); 
                unit = '%'; 
                break;
            case 'neutralLightness': 
                updateCSSVariable('--color-neutral-lightness', value + '%'); 
                unit = '%'; 
                break;
            case 'backgroundHue': 
                updateCSSVariable('--background-hue', value); 
                break;
            case 'backgroundSaturation': 
                updateCSSVariable('--background-saturation', value + '%'); 
                unit = '%'; 
                break;
            case 'backgroundLightness': 
                updateCSSVariable('--background-lightness', value + '%'); 
                unit = '%'; 
                break;
            case 'darkLightness': 
                updateCSSVariable('--color-neutral-dark-lightness', value + '%'); 
                unit = '%'; 
                break;
            case 'mediumLightness': 
                updateCSSVariable('--color-neutral-medium-lightness', value + '%'); 
                unit = '%'; 
                break;
            case 'fontFamilyBody': 
                updateCSSVariable('--font-family-body', value); 
                break;
            case 'fontFamilyHeading': 
                updateCSSVariable('--font-family-heading', value); 
                break;
            case 'borderRadiusMd': 
                updateCSSVariable('--border-radius-md', value + 'rem'); 
                unit = 'rem'; 
                break;
            case 'uiBorderWidth': 
                updateCSSVariable('--ui-border-width', value + 'px'); 
                unit = 'px'; 
                break;
            case 'borderStyle': 
                updateCSSVariable('--ui-border-style', value); 
                break;
            case 'borderImageSource': 
                updateCSSVariable('--border-image-source', `url(${value})`); 
                break;
            case 'borderImageSlice': 
                updateCSSVariable('--border-image-slice', value); 
                break;
            case 'borderImageWidth': 
                updateCSSVariable('--border-image-width', `${value}px`); 
                break;
            case 'borderImageOutset': 
                updateCSSVariable('--border-image-outset', `${value}px`); 
                break;
            case 'animDuration': 
                updateCSSVariable('--anim-duration-medium', value + 's'); 
                unit = 's'; 
                break;
        }

        // Update value display
        if (valueDisplay) valueDisplay.textContent = displayValue + unit;
        
        // Update UI
        updateColorPreviews();
        updateCalculatedValues();
        document.querySelectorAll('.custom-select').forEach(select => {
            if (select) createCustomSelect(select, select.dataset.selectedValue);
        });
    }

    // ========================================= 
    // 6. FONT MANAGEMENT
    // ========================================= 
    function loadDynamicFont(fontFamilyValue, type) {
        const fontName = fontFamilyValue.split(',')[0].trim().replace(/['"]/g, '');

        // Don't load generic families
        if (!fontName || ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'system-ui'].includes(fontName.toLowerCase())) {
            return;
        }

        const formattedFontName = fontName.replace(/ /g, '+');
        const existingLink = document.getElementById(`dynamic-font-${type}`);
        const fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFontName}:wght@300;400;500;600;700&display=swap`;

        if (existingLink && existingLink.href === fontUrl) return;
        
        showNotification(`Loading font: ${fontName}...`, false);

        if (existingLink) {
            existingLink.href = fontUrl;
        } else {
            const link = document.createElement('link');
            link.id = `dynamic-font-${type}`;
            link.rel = 'stylesheet';
            link.href = fontUrl;
            document.head.appendChild(link);
        }
    }

    // ========================================= 
    // 7. UI INTERACTIONS
    // ========================================= 
    function handleTabSwitch(e) {
        if (!e.target.matches('.tab-btn')) return;
        const tabId = e.target.dataset.tab;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Update preview panels
        document.querySelectorAll('#preview-container .panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`tab-${tabId}-preview`).classList.add('active');

        // Update sidebar section
        const sectionId = CONFIG.tabSectionMap[tabId];
        document.querySelector(`.nav-btn[data-section="${sectionId}"]`).click();
    }

    function handleSidebarNav(e) {
        if (!e.target.matches('.nav-btn')) return;
        const sectionId = e.target.dataset.section;

        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Update panels
        document.querySelectorAll('#sections-container .panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${sectionId}-section`).classList.add('active');
    }
    
    function handleAccordionToggle(clickedHeader) {
        const parent = clickedHeader.closest('.panel');
        if (!parent) return;

        const content = clickedHeader.nextElementSibling;
        const wasActive = clickedHeader.classList.contains('active');

        // Close all accordions in this section
        parent.querySelectorAll('.accordion-header').forEach(header => {
            header.classList.remove('active');
            if (header.nextElementSibling) {
                header.nextElementSibling.classList.remove('active');
            }
        });
        
        // Open clicked accordion if it wasn't active
        if (!wasActive) {
            clickedHeader.classList.add('active');
            content.classList.add('active');
        }
    }

    // ========================================= 
    // 8. CUSTOM SELECT COMPONENTS
    // ========================================= 
    function createCustomSelect(container, selectedValue) {
        if (!container) return;
        
        const computedStyle = getComputedStyle(document.documentElement);
        container.dataset.selectedValue = selectedValue;
        
        const getColor = (val) => {
            if (val === 'default') {
                return computedStyle.getPropertyValue('--ui-border-color').trim();
            }
            return computedStyle.getPropertyValue(`--color-${val}`).trim();
        };
        
        const selected = CONFIG.colorOptions.find(o => o.value === selectedValue) || CONFIG.colorOptions[0];

        container.innerHTML = `
            <button type="button" class="select-trigger">
                <span style="color: ${getColor(selected.value)}">${selected.text}</span>
            </button>
            <div class="select-options">
                ${CONFIG.colorOptions.map(o => `
                    <div class="select-option" data-value="${o.value}">
                        <span class="color-preview" style="background-color: ${getColor(o.value)}; margin-right: var(--space-sm);"></span>
                        <span style="color: ${getColor(o.value)}">${o.text}</span>
                    </div>
                `).join('')}
            </div>`;
    }

    function handleCustomSelectEvents(e) {
        const trigger = e.target.closest('.select-trigger');
        if (trigger) {
            const container = trigger.parentElement;
            document.querySelectorAll('.custom-select.open').forEach(openSelect => { 
                if (openSelect !== container) openSelect.classList.remove('open'); 
            });
            container.classList.toggle('open');
        } else if (e.target.closest('.select-option')) {
            const option = e.target.closest('.select-option');
            const container = option.closest('.custom-select');
            const value = option.dataset.value;
            const property = container.id === 'borderColor' ? '--ui-border-color' : `--${container.dataset.heading}-color`;
            const colorVar = value === 'default' ? 
                'hsl(var(--color-neutral-hue), var(--color-neutral-saturation), calc(var(--color-neutral-medium-lightness) + 35%))' : 
                `var(--color-${value})`;
            
            updateCSSVariable(property, colorVar);
            createCustomSelect(container, value);
            container.classList.remove('open');
        } else if (!e.target.closest('.custom-select')) {
            document.querySelectorAll('.custom-select.open').forEach(s => s.classList.remove('open'));
        }
    }

    // ========================================= 
    // 9. ACCESSIBILITY
    // ========================================= 
    function getLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function getContrast(rgb1, rgb2) {
        const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
        const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }

    function hslToRgb(h, s, l) {
        s /= 100; 
        l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s;
        let x = c * (1 - Math.abs((h / 60) % 2 - 1));
        let m = l - c/2;
        let r = 0, g = 0, b = 0;
        
        if (0 <= h && h < 60) { r = c; g = x; b = 0; }
        else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
        else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
        else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
        else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
        else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
        
        r = Math.round((r + m) * 255); 
        g = Math.round((g + m) * 255); 
        b = Math.round((b + m) * 255);
        return [r, g, b];
    }

    function checkAndAdjustContrast() {
        if (!elements.controls.backgroundHue) return;
        
        const bgRgb = hslToRgb(
            elements.controls.backgroundHue.value, 
            elements.controls.backgroundSaturation.value, 
            elements.controls.backgroundLightness.value
        );
        const darkTextRgb = hslToRgb(
            elements.controls.neutralHue.value, 
            elements.controls.neutralSaturation.value, 
            elements.controls.darkLightness.value
        );

        const contrastWithDark = getContrast(bgRgb, darkTextRgb);
        
        if (contrastWithDark < 4.5) {
            updateCSSVariable('--color-text-default', 'var(--color-text-light)');
            showNotification('Switched to light text for accessibility.', false);
        } else {
            updateCSSVariable('--color-text-default', 'var(--color-text-dark)');
        }
    }

    // ========================================= 
    // 10. EXPORT FUNCTIONALITY
    // ========================================= 
    function generateAndDownloadCSS() {
        // Collect all CSS from the linked stylesheets
        const cssContent = Array.from(document.styleSheets)
            .filter(sheet => sheet.href && sheet.href.includes('css/'))
            .map(sheet => {
                try {
                    return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
                } catch (e) {
                    return '/* Could not access external stylesheet */';
                }
            })
            .join('\n\n');

        // Create organized export
        const exportContent = `/* Generated by Fontolo - Live CSS Configurator */
/* https://github.com/CseperkePapp/fontolo */

${cssContent}

/* Current Configuration */
${document.documentElement.style.cssText}`;

        const blob = new Blob([exportContent], { type: 'text/css' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'fontolo-design-system.css';
        a.click();
        URL.revokeObjectURL(a.href);
        showNotification('Design system CSS downloaded!', false);
    }

    // ========================================= 
    // 11. INITIALIZATION
    // ========================================= 
    function initializeUI() {
        // Add event listeners to all controls
        Object.values(elements.controls).forEach(control => { 
            if (control) control.addEventListener('input', handleInputChange); 
        });
        
        // Font loading listeners
        if (elements.controls.fontFamilyBody) {
            elements.controls.fontFamilyBody.addEventListener('change', (e) => 
                loadDynamicFont(e.target.value, 'body'));
        }
        if (elements.controls.fontFamilyHeading) {
            elements.controls.fontFamilyHeading.addEventListener('change', (e) => 
                loadDynamicFont(e.target.value, 'heading'));
        }

        // UI event listeners
        elements.ui.nav.addEventListener('click', handleSidebarNav);
        elements.ui.tabControls.addEventListener('click', handleTabSwitch);
        elements.ui.generateCssBtn.addEventListener('click', generateAndDownloadCSS);
        
        // Accordion listeners
        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => handleAccordionToggle(header));
        });
        
        // Accessibility listener
        if (elements.controls.accessibilityLock) {
            elements.controls.accessibilityLock.addEventListener('change', updateCalculatedValues);
        }

        // Custom select setup
        const defaultHeadingColors = { h1: 'primary', h2: 'primary', h3: 'primary', h4: 'secondary' };
        document.querySelectorAll('.custom-select').forEach(select => {
            if (select.id === 'borderColor') {
                createCustomSelect(select, 'default');
            } else if (select.dataset.heading) {
                createCustomSelect(select, defaultHeadingColors[select.dataset.heading]);
            }
        });
        document.body.addEventListener('click', handleCustomSelectEvents);

        // Initial state
        Object.values(elements.controls).forEach(control => { 
            if (control) control.dispatchEvent(new Event('input')); 
        });
        updateColorPreviews();
        updateCalculatedValues();
        
        // Activate first tab and section
        document.querySelector('.tab-btn[data-tab="sample"]').click();
        
        // Open first accordion in each section
        document.querySelectorAll('.panel').forEach(panel => {
            const firstAccordion = panel.querySelector('.accordion-header');
            if (firstAccordion) {
                handleAccordionToggle(firstAccordion);
            }
        });
    }

    // Start the application
    initializeUI();
});
