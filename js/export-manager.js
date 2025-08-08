// ===============================
// Fontolo Export Manager (Minimal Delta Mode)
// ===============================

// Build minimal CSS from tokens
function buildCssFromTokens(tokens) {
    const rules = [];

    if (tokens.baseFontSize) rules.push(`--base-font-size: ${tokens.baseFontSize};`);
    if (tokens.goldenRatio) rules.push(`--scale-ratio: ${tokens.goldenRatio};`);
    if (tokens.lineHeight) rules.push(`--base-line-height: ${tokens.lineHeight};`);

    if (tokens.primaryHue !== undefined) {
        rules.push(`--color-primary: hsl(${tokens.primaryHue}, ${tokens.primarySaturation}%, ${tokens.primaryLightness}%);`);
    }
    if (tokens.secondaryHue !== undefined) {
        rules.push(`--color-secondary: hsl(${tokens.secondaryHue}, ${tokens.secondarySaturation}%, ${tokens.secondaryLightness}%);`);
    }
    if (tokens.accentHue !== undefined) {
        rules.push(`--color-accent: hsl(${tokens.accentHue}, ${tokens.accentSaturation}%, ${tokens.accentLightness}%);`);
    }
    if (tokens.neutralHue !== undefined) {
        rules.push(`--color-neutral: hsl(${tokens.neutralHue}, ${tokens.neutralSaturation}%, ${tokens.neutralLightness}%);`);
    }
    if (tokens.backgroundHue !== undefined) {
        rules.push(`--color-background: hsl(${tokens.backgroundHue}, ${tokens.backgroundSaturation}%, ${tokens.backgroundLightness}%);`);
    }

    if (tokens.borderRadiusMd) rules.push(`--radius-md: ${tokens.borderRadiusMd};`);
    if (tokens.uiBorderWidth) rules.push(`--border-width: ${tokens.uiBorderWidth};`);
    if (tokens.animDuration) rules.push(`--anim-duration: ${tokens.animDuration};`);

    return `:root {\n  ${rules.join('\n  ')}\n}`;
}

// Download helper
function download(filename, content) {
    const a = document.createElement('a');
    const blob = new Blob([content], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// Clipboard helper
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        return false;
    }
}

// Notification helper
function showNotification(msg) {
    let n = document.getElementById('notification');
    if (!n) {
        n = document.createElement('div');
        n.id = 'notification';
        n.style.position = 'fixed';
        n.style.right = '12px';
        n.style.bottom = '12px';
        n.style.padding = '8px 12px';
        n.style.background = '#111';
        n.style.color = '#fff';
        n.style.borderRadius = '6px';
        document.body.appendChild(n);
    }
    n.textContent = msg;
    n.style.opacity = 1;
    setTimeout(() => { n.style.opacity = 0; }, 3000);
}

// Init export button
function initExportManager() {
    const btn = document.getElementById('generateCssBtn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        const tokens = window.__FONT_TOKENS__ || {};
        const css = buildCssFromTokens(tokens);

        // Download minimal CSS
        download('fontolo-overrides.css', css);

        // Copy to clipboard
        const copied = await copyToClipboard(css);
        showNotification(copied ? 'Delta CSS downloaded and copied to clipboard' : 'Delta CSS downloaded');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExportManager);
} else {
    initExportManager();
}
