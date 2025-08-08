// =========================================
// Fontolo Configuration Loader (Updated)
// Minimal script for non-configurator pages
// =========================================

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
                const style = document.createElement('style');
                style.id = 'fontolo-url-config';
                
                const rules = [];
                // A more robust mapping of token names to CSS custom property names.
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
                    darkLightness: '--color-neutral-dark-lightness',
                    mediumLightness: '--color-neutral-medium-lightness',
                    baseFontSize: '--base-font-size',
                    goldenRatio: '--golden-ratio',
                    lineHeight: '--base-line-height',
                    borderRadiusMd: '--border-radius-md',
                    uiBorderWidth: '--ui-border-width',
                    animDuration: '--anim-duration-medium',
                    fontFamilyBody: '--font-family-body',
                    fontFamilyHeading: '--font-family-heading',
                    borderStyle: '--ui-border-style',
                    borderImageSource: '--border-image-source',
                    borderImageSlice: '--border-image-slice',
                    borderImageWidth: '--border-image-width',
                    borderImageOutset: '--border-image-outset'
                };

                for (const [key, value] of Object.entries(delta)) {
                    const cssVar = tokenToCSSVar[key];
                    if (cssVar) {
                        // Add quotes to font families if they aren't already there
                        let finalValue = value;
                        if ((key === 'fontFamilyBody' || key === 'fontFamilyHeading') && typeof value === 'string' && value.indexOf("'") === -1 && value.indexOf('"') === -1) {
                           // No need to add extra quotes, the value from the token store is already correct.
                        }
                        rules.push(`  ${cssVar}: ${finalValue};`);
                    }
                }
                
                if(rules.length > 0) {
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
        link.href = 'css/fontolo-custom.css'; // Assumes it's in the css folder
        link.onload = () => {
            console.log('Fontolo custom CSS file loaded.');
        };
        link.onerror = () => {
            // This is now an expected outcome if using URL config, so we don't log an error.
            // console.log('No custom Fontolo CSS file found. Using defaults.');
        };
        document.head.appendChild(link);
    }

    /**
     * Main execution logic.
     * It first tries to load from the URL. If that fails, it falls back to loading the CSS file.
     */
    function initialize() {
        const loadedFromURL = loadFromURL();
        
        if (!loadedFromURL) {
            // Only try to load the CSS file if no config was found in the URL
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
