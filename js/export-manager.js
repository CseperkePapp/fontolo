// ===============================
// Fontolo Export Manager
// ===============================

class FontoloExportManager {
    constructor() {
        this.defaultTokens = this.captureDefaults();
    }

    // Capture default values from CSS on page load
    captureDefaults() {
        const computed = getComputedStyle(document.documentElement);
        return {
            primaryHue: 240,
            primarySaturation: 0,
            primaryLightness: 50,
            secondaryHue: 150,
            secondarySaturation: 0,
            secondaryLightness: 40,
            accentHue: 0,
            accentSaturation: 85,
            accentLightness: 50,
            neutralHue: 220,
            neutralSaturation: 0,
            neutralLightness: 50,
            backgroundHue: 220,
            backgroundSaturation: 0,
            backgroundLightness: 95,
            baseFontSize: '16px',
            goldenRatio: 1.618,
            lineHeight: 1.6,
            borderRadiusMd: '0.5rem',
            uiBorderWidth: '2px',
            animDuration: '0.5s'
        };
    }

    // Get only changed values (delta)
    getDelta() {
        const current = window.__FONT_TOKENS__ || {};
        const delta = {};
        
        for (const [key, value] of Object.entries(current)) {
            if (value !== this.defaultTokens[key]) {
                delta[key] = value;
            }
        }
        
        return delta;
    }

    // Generate minimal CSS override
    generateMinimalCSS() {
        const delta = this.getDelta();
        if (Object.keys(delta).length === 0) {
            return '/* No changes from defaults */';
        }

        const rules = [];
        
        // Map tokens to CSS custom properties
        const tokenToCSSVar = {
            primaryHue: '--color-primary-hue',
            primarySaturation: '--color-primary-saturation',
            primaryLightness: '--color-primary-lightness',
            secondaryHue: '--color-secondary-hue',
            secondarySaturation: '--color-secondary-saturation',
            secondaryLightness: '--color-secondary-lightness',
            accentHue: '--color-accent-hue',
            accentSaturation: '--color-accent-saturation',
            accentLightness: '--color-accent-lightness',
            neutralHue: '--color-neutral-hue',
            neutralSaturation: '--color-neutral-saturation',
            neutralLightness: '--color-neutral-lightness',
            backgroundHue: '--background-hue',
            backgroundSaturation: '--background-saturation',
            backgroundLightness: '--background-lightness',
            baseFontSize: '--base-font-size',
            goldenRatio: '--golden-ratio',
            lineHeight: '--base-line-height',
            borderRadiusMd: '--border-radius-md',
            uiBorderWidth: '--ui-border-width',
            animDuration: '--anim-duration-medium'
        };

        for (const [token, value] of Object.entries(delta)) {
            const cssVar = tokenToCSSVar[token];
            if (cssVar) {
                rules.push(`  ${cssVar}: ${value};`);
            }
        }

        return `:root {\n${rules.join('\n')}\n}`;
    }

    // Export as JSON config
    exportAsJSON() {
        return {
            version: '1.0',
            timestamp: new Date().toISOString(),
            delta: this.getDelta()
        };
    }

    // Import JSON config
    importFromJSON(jsonConfig) {
        if (!jsonConfig.delta) return false;
        
        for (const [key, value] of Object.entries(jsonConfig.delta)) {
            // Apply to DOM
            const cssVar = this.tokenToCSSVar[key];
            if (cssVar) {
                document.documentElement.style.setProperty(cssVar, value);
            }
            // Update token store
            if (window.__FONT_TOKENS__) {
                window.__FONT_TOKENS__[key] = value;
            }
        }
        return true;
    }

    // Download CSS file
    downloadCSS() {
        const css = this.generateMinimalCSS();
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fontolo-custom.css';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    // Copy CSS to clipboard
    async copyToClipboard() {
        const css = this.generateMinimalCSS();
        try {
            await navigator.clipboard.writeText(css);
            this.showNotification('CSS copied to clipboard!');
            return true;
        } catch (err) {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = css;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            this.showNotification('CSS copied to clipboard!');
            return true;
        }
    }

    // Get shareable URL with config
    getShareableURL() {
        const delta = this.getDelta();
        const encoded = btoa(JSON.stringify(delta));
        const baseURL = window.location.origin + window.location.pathname;
        return `${baseURL}?config=${encoded}`;
    }

    // Load from URL params
    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const config = params.get('config');
        if (config) {
            try {
                const delta = JSON.parse(atob(config));
                this.importFromJSON({ delta });
                return true;
            } catch (e) {
                console.error('Invalid config in URL');
            }
        }
        return false;
    }

    showNotification(message) {
        let notification = document.getElementById('export-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'export-notification';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--color-primary);
                color: white;
                padding: 12px 20px;
                border-radius: var(--border-radius-md);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(notification);
        }
        
        notification.textContent = message;
        notification.style.opacity = '1';
        
        setTimeout(() => {
            notification.style.opacity = '0';
        }, 3000);
    }
}

// Initialize and expose globally
const exportManager = new FontoloExportManager();

// Auto-load from URL on page load
document.addEventListener('DOMContentLoaded', () => {
    exportManager.loadFromURL();
    
    // Hook up the export button
    const exportBtn = document.getElementById('generateCssBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            exportManager.downloadCSS();
            await exportManager.copyToClipboard();
            
            // Show share URL option
            const shareURL = exportManager.getShareableURL();
            console.log('Share this configuration:', shareURL);
        });
    }
});

// Expose for other scripts
window.FontoloExport = exportManager;
