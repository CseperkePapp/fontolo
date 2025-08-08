// ===============================
// Fontolo Export Manager (Refactored)
// ===============================

class FontoloExportManager {
    constructor() {
        // This object holds the default values to compare against.
        this.defaultTokens = {
            primaryHue: 240, primarySaturation: 0, primaryLightness: 50,
            secondaryHue: 150, secondarySaturation: 0, secondaryLightness: 40,
            accentHue: 0, accentSaturation: 85, accentLightness: 50,
            neutralHue: 220, neutralSaturation: 0, neutralLightness: 50,
            backgroundHue: 220, backgroundSaturation: 0, backgroundLightness: 95,
            baseFontSize: '16px', goldenRatio: 1.618, lineHeight: 1.6,
            borderRadiusMd: '0.5rem', uiBorderWidth: '2px', animDuration: '0.5s'
        };
    }

    // Get only changed values (the "delta") by comparing current tokens to defaults.
    getDelta() {
        const current = window.__FONT_TOKENS__ || {};
        const delta = {};
        for (const [key, value] of Object.entries(current)) {
            if (String(value) !== String(this.defaultTokens[key])) {
                delta[key] = value;
            }
        }
        return delta;
    }

    // Generate minimal CSS override using the central token map.
    generateMinimalCSS() {
        const delta = this.getDelta();
        if (Object.keys(delta).length === 0) {
            return '/* No changes from defaults */';
        }

        const rules = [];
        // Use the global map from fontolo-utils.js
        const tokenMap = window.FONTOLO_TOKEN_MAP || {};

        for (const [token, value] of Object.entries(delta)) {
            const cssVar = tokenMap[token];
            if (cssVar) {
                rules.push(`  ${cssVar}: ${value};`);
            }
        }

        return `:root {\n${rules.join('\n')}\n}`;
    }

    // Download the generated CSS file.
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

    // Copy the generated CSS to the clipboard.
    async copyToClipboard() {
        const css = this.generateMinimalCSS();
        try {
            await navigator.clipboard.writeText(css);
            this.showNotification('CSS copied to clipboard!');
            return true;
        } catch (err) {
            this.showNotification('Failed to copy CSS.', true);
            return false;
        }
    }

    // Get a shareable URL with the configuration embedded.
    getShareableURL() {
        const delta = this.getDelta();
        if (Object.keys(delta).length === 0) return null;

        const encoded = btoa(JSON.stringify(delta));
        const baseURL = window.location.origin + window.location.pathname;
        return `${baseURL}?config=${encoded}`;
    }
    
    // Show a temporary notification to the user.
    showNotification(message, isError = false) {
        let notification = document.getElementById('export-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'export-notification';
            notification.style.cssText = `
                position: fixed; bottom: 20px; right: 20px;
                background: ${isError ? 'var(--color-accent)' : 'var(--color-primary)'};
                color: white; padding: 12px 20px;
                border-radius: var(--border-radius-md);
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 10000; opacity: 0;
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

// Initialize and expose globally.
window.FontoloExport = new FontoloExportManager();

// Hook up the export button once the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('generateCssBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            const exportManager = window.FontoloExport;
            exportManager.downloadCSS();
            await exportManager.copyToClipboard();
            
            const shareURL = exportManager.getShareableURL();
            if (shareURL) {
                // Instead of just logging, show a prompt to the user.
                window.prompt('Copy this shareable URL to preview your design:', shareURL);
            } else {
                exportManager.showNotification('No changes to share.');
            }
        });
    }
});
