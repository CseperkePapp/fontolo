// ===============================
// Fontolo Configuration Loader
// Minimal script for non-configurator pages
// ===============================

(function() {
    // Check for custom CSS file first
    function loadCustomCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/fontolo-custom.css';
        link.onerror = () => {
            console.log('No custom Fontolo configuration found');
        };
        document.head.appendChild(link);
    }

    // Check for URL config
    function loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const config = params.get('config');
        
        if (config) {
            try {
                const delta = JSON.parse(atob(config));
                const style = document.createElement('style');
                style.id = 'fontolo-url-config';
                
                const rules = [];
                for (const [key, value] of Object.entries(delta)) {
                    // Simple mapping - expand as needed
                    const varName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    rules.push(`--${varName}: ${value};`);
                }
                
                style.textContent = `:root { ${rules.join(' ')} }`;
                document.head.appendChild(style);
            } catch (e) {
                console.error('Invalid Fontolo config in URL');
            }
        }
    }

    // Load on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadFromURL();
            loadCustomCSS();
        });
    } else {
        loadFromURL();
        loadCustomCSS();
    }
})();
