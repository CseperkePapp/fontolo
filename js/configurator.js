// ===============================
// Fontolo Configurator (Token-driven)
// ===============================

// Single source of truth for all user-controlled values
const tokens = {};

// Helpers
const el = id => document.getElementById(id);
const toPx = v => `${parseFloat(v)}px`;
const hslStr = (h, s, l) => `hsl(${h}, ${s}%, ${l}%)`;

// Create override style node if missing
function ensureOverrideNode() {
    if (!document.getElementById('fontolo-overrides')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'fontolo-overrides';
        document.head.appendChild(styleEl);
    }
}
ensureOverrideNode();

// Build minimal CSS from tokens
function buildOverrideCss(tokenObj) {
    const rules = [];

    if (tokenObj.baseFontSize) rules.push(`--base-font-size: ${tokenObj.baseFontSize};`);
    if (tokenObj.goldenRatio) rules.push(`--scale-ratio: ${tokenObj.goldenRatio};`);
    if (tokenObj.lineHeight) rules.push(`--base-line-height: ${tokenObj.lineHeight};`);

    if (tokenObj.primaryHue !== undefined) {
        rules.push(`--color-primary: ${hslStr(tokenObj.primaryHue, tokenObj.primarySaturation, tokenObj.primaryLightness)};`);
    }
    if (tokenObj.secondaryHue !== undefined) {
        rules.push(`--color-secondary: ${hslStr(tokenObj.secondaryHue, tokenObj.secondarySaturation, tokenObj.secondaryLightness)};`);
    }
    if (tokenObj.accentHue !== undefined) {
        rules.push(`--color-accent: ${hslStr(tokenObj.accentHue, tokenObj.accentSaturation, tokenObj.accentLightness)};`);
    }
    if (tokenObj.neutralHue !== undefined) {
        rules.push(`--color-neutral: ${hslStr(tokenObj.neutralHue, tokenObj.neutralSaturation, tokenObj.neutralLightness)};`);
    }

    if (tokenObj.borderRadiusMd) rules.push(`--radius-md: ${tokenObj.borderRadiusMd};`);
    if (tokenObj.uiBorderWidth) rules.push(`--border-width: ${tokenObj.uiBorderWidth};`);
    if (tokenObj.animDuration) rules.push(`--anim-duration: ${tokenObj.animDuration};`);

    return `:root {\n  ${rules.join('\n  ')}\n}`;
}

// Apply overrides to the preview
function applyOverrides() {
    const css = buildOverrideCss(tokens);
    document.getElementById('fontolo-overrides').textContent = css;
}

// Update token + CSS variable helper
function bindControl(id, tokenKey, transformFn = v => v) {
    const control = el(id);
    if (!control) return;

    tokens[tokenKey] = transformFn(control.value);
    document.documentElement.style.setProperty(`--${tokenKey}`, tokens[tokenKey]);

    control.addEventListener('input', () => {
        tokens[tokenKey] = transformFn(control.value);
        document.documentElement.style.setProperty(`--${tokenKey}`, tokens[tokenKey]);
        applyOverrides();
    });
}

// Color triple binding (Hue, Saturation, Lightness)
function bindColorControls(prefix, tokenPrefix) {
    const hueId = `${prefix}Hue`;
    const satId = `${prefix}Saturation`;
    const lightId = `${prefix}Lightness`;

    tokens[`${tokenPrefix}Hue`] = parseInt(el(hueId).value);
    tokens[`${tokenPrefix}Saturation`] = parseInt(el(satId).value);
    tokens[`${tokenPrefix}Lightness`] = parseInt(el(lightId).value);

    [hueId, satId, lightId].forEach(id => {
        el(id).addEventListener('input', () => {
            tokens[`${tokenPrefix}Hue`] = parseInt(el(hueId).value);
            tokens[`${tokenPrefix}Saturation`] = parseInt(el(satId).value);
            tokens[`${tokenPrefix}Lightness`] = parseInt(el(lightId).value);
            document.documentElement.style.setProperty(
                `--color-${tokenPrefix.toLowerCase()}`,
                hslStr(tokens[`${tokenPrefix}Hue`], tokens[`${tokenPrefix}Saturation`], tokens[`${tokenPrefix}Lightness`])
            );
            applyOverrides();
        });
    });
}

// Init all bindings
function initConfigurator() {
    // Base settings
    bindControl('baseFontSize', 'baseFontSize', toPx);
    bindControl('goldenRatio', 'goldenRatio');
    bindControl('lineHeight', 'lineHeight');

    // Colors
    bindColorControls('primary', 'primary');
    bindColorControls('secondary', 'secondary');
    bindColorControls('accent', 'accent');
    bindColorControls('neutral', 'neutral');
    bindColorControls('background', 'background');

    // Frames
    bindControl('borderRadiusMd', 'borderRadiusMd', v => `${v}rem`);
    bindControl('uiBorderWidth', 'uiBorderWidth', toPx);

    // Animations
    bindControl('animDuration', 'animDuration', v => `${v}s`);

    // Apply once at startup
    applyOverrides();
}

// Expose tokens globally for export-manager
window.__FONT_TOKENS__ = tokens;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initConfigurator);
} else {
    initConfigurator();
}
