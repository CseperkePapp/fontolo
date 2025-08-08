/* ========================================= */
/* Fontolo Configuration Loader (Refactored) */
/* ========================================= */

(function() {

    /**
     * Tries to load configuration from the URL's `?config=` parameter.
     * @returns {boolean} - True if config was found and applied, false otherwise.
     */
    function loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const config = params.get('config');
        
        if (config) {
            try {
                const delta = JSON.parse(atob(config));
                
                // Use the global map from fontolo-utils.js
                const tokenMap = window.FONTOLO_TOKEN_MAP || {};
                const rules = [];

                for (const [key, value] of Object.entries(delta)) {
                    const cssVar = tokenMap[key];
                    if (cssVar) {
                        rules.push(`  ${cssVar}: ${value};`);
                    }
                }
                
                if(rules.length > 0) {
                    const style = document.createElement('style');
                    style.id = 'fontolo-url-config';
                    style.textContent = `:root {\n${rules.join('\n')}\n}`;
                    document.head.appendChild(style);
                    console.log('Fontolo configuration applied from URL.');
                    return true; // Indicate success
                }

            } catch (e) {
                console.error('Invalid Fontolo config in URL:', e);
            }
        }
        return false; // Indicate no config was found
    }

    /**
     * Tries to load the `fontolo-custom.css` file.
     */
    function loadCustomCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/fontolo-custom.css';
        link.onload = () => console.log('Fontolo custom CSS file loaded.');
        document.head.appendChild(link);
    }

    /**
     * Main execution logic.
     */
    function initialize() {
        // First, check if FontoloUtils has loaded. If not, wait a moment.
        if (!window.FONTOLO_TOKEN_MAP) {
            setTimeout(initialize, 50); // Retry after 50ms
            return;
        }

        const loadedFromURL = loadFromURL();
        if (!loadedFromURL) {
            loadCustomCSS();
        }
    }

    // Run the initialization logic once the DOM is ready.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
