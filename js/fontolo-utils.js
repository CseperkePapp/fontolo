/* =============================== */
/* FONTOLO CENTRAL UTILITIES         */
/* =============================== */
/* This file is the single source of truth for token-to-CSS-variable mapping.
/* It follows the DRY (Don't Repeat Yourself) principle.
/* =============================== */

(function() {
    // Expose the master map on the global window object so other scripts can access it.
    window.FONTOLO_TOKEN_MAP = {
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
})();
