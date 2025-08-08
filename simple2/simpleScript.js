// ===============================
// Fontolo Simple Script
// Typography Research Configurator
// ===============================

// Get all controls
const textSizeSlider = document.getElementById('textSize');
const hueSlider = document.getElementById('hue');
const spacingSlider = document.getElementById('spacing');
const shiftPointSlider = document.getElementById('shiftPoint');

// Get value displays
const textSizeValue = document.getElementById('textSizeValue');
const hueValue = document.getElementById('hueValue');
const spacingValue = document.getElementById('spacingValue');
const shiftPointValue = document.getElementById('shiftPointValue');
const thresholdDisplay = document.getElementById('thresholdDisplay');

// Hybrid scaling calculation - SIMPLIFIED
function calculateHybridScaling() {
    if (!textSizeSlider || !shiftPointSlider) return;
    
    const textRatio = parseFloat(textSizeSlider.value);
    const shiftPoint = parseFloat(shiftPointSlider.value);
    
    if (textRatio <= shiftPoint) {
        // Below threshold: PROPORTIONAL scaling
        // Paragraph grows WITH the title
        const paragraphSize = textRatio;
        const largeSize = paragraphSize * 1.25;
        const xlargeSize = largeSize * 1.25;
        
        document.documentElement.style.setProperty('--paragraph-size-c', `${paragraphSize}rem`);
        document.documentElement.style.setProperty('--large-size-c', `${largeSize}rem`);
        document.documentElement.style.setProperty('--xlarge-size-c', `${xlargeSize}rem`);
        
        if (document.getElementById('currentMethod')) {
            document.getElementById('currentMethod').textContent = 'Proportional (below threshold)';
        }
    } else {
        // Above threshold: INVERSE scaling
        // Paragraph gets smaller as title gets bigger
        const inverseRatio = Math.max(0.8, Math.min(1.4, 1 / textRatio));
        const paragraphSize = inverseRatio;
        const largeSize = textRatio * 1.25;
        const xlargeSize = largeSize * 1.25;
        
        document.documentElement.style.setProperty('--paragraph-size-c', `${paragraphSize}rem`);
        document.documentElement.style.setProperty('--large-size-c', `${largeSize}rem`);
        document.documentElement.style.setProperty('--xlarge-size-c', `${xlargeSize}rem`);
        
        if (document.getElementById('currentMethod')) {
            document.getElementById('currentMethod').textContent = 'Inverse (above threshold)';
        }
    }
}

// Update all design tokens and displays
function updateDesign() {
    const textRatio = textSizeSlider ? textSizeSlider.value : '1.2';
    const hue = hueSlider ? hueSlider.value : '220';
    const spacing = spacingSlider ? spacingSlider.value : '1';
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--text-ratio', textRatio);
    document.documentElement.style.setProperty('--hue', hue);
    document.documentElement.style.setProperty('--spacing-ratio', spacing);
    
    // Update value displays
    if (textSizeValue) textSizeValue.textContent = textRatio;
    if (hueValue) hueValue.textContent = hue + '°';
    if (spacingValue) spacingValue.textContent = spacing;
    
    // Calculate hybrid scaling
    calculateHybridScaling();
}

// Add event listeners for main controls
if (textSizeSlider) {
    textSizeSlider.addEventListener('input', updateDesign);
}

if (hueSlider) {
    hueSlider.addEventListener('input', updateDesign);
}

if (spacingSlider) {
    spacingSlider.addEventListener('input', updateDesign);
}

// Add event listener for shift point slider
if (shiftPointSlider) {
    shiftPointSlider.addEventListener('input', function() {
        const value = this.value;
        if (shiftPointValue) shiftPointValue.textContent = value;
        if (thresholdDisplay) thresholdDisplay.textContent = value;
        document.documentElement.style.setProperty('--shift-point', value);
        calculateHybridScaling();
    });
}

// Generate CSS button functionality
const generateBtn = document.getElementById('generateCSS');
if (generateBtn) {
    generateBtn.addEventListener('click', function() {
        const textRatio = textSizeSlider ? textSizeSlider.value : '1.2';
        const hue = hueSlider ? hueSlider.value : '220';
        const spacing = spacingSlider ? spacingSlider.value : '1';
        const shiftPoint = shiftPointSlider ? shiftPointSlider.value : '1.4';
        
        const css = `:root {
    --text-ratio: ${textRatio};
    --hue: ${hue};
    --spacing-ratio: ${spacing};
    --shift-point: ${shiftPoint};
}`;
        
        // Save to localStorage for the grid page
        localStorage.setItem('fontolo-css', css);
        
        // Download CSS file
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fontolo-typography-tokens.css';
        a.click();
        URL.revokeObjectURL(url);
        
        alert('CSS saved! You can also load it on the grid page.');
    });
}

// Load CSS button functionality (for grid page)
const loadBtn = document.getElementById('loadCSS');
if (loadBtn) {
    loadBtn.addEventListener('click', function() {
        const savedCSS = localStorage.getItem('fontolo-css');
        if (savedCSS) {
            // Parse the CSS and apply the values
            const textMatch = savedCSS.match(/--text-ratio: ([\d.]+)/);
            const hueMatch = savedCSS.match(/--hue: (\d+)/);
            const spacingMatch = savedCSS.match(/--spacing-ratio: ([\d.]+)/);
            const shiftMatch = savedCSS.match(/--shift-point: ([\d.]+)/);
            
            if (textMatch) document.documentElement.style.setProperty('--text-ratio', textMatch[1]);
            if (hueMatch) document.documentElement.style.setProperty('--hue', hueMatch[1]);
            if (spacingMatch) document.documentElement.style.setProperty('--spacing-ratio', spacingMatch[1]);
            if (shiftMatch) document.documentElement.style.setProperty('--shift-point', shiftMatch[1]);
            
            // Recalculate hybrid scaling with loaded values
            if (textMatch && shiftMatch) {
                const textRatio = parseFloat(textMatch[1]);
                const shiftPoint = parseFloat(shiftMatch[1]);
                
                if (textRatio <= shiftPoint) {
                    document.documentElement.style.setProperty('--paragraph-size-c', `calc(var(--base-size) * ${textRatio})`);
                    document.documentElement.style.setProperty('--large-size-c', `calc(var(--paragraph-size-c) * 1.25)`);
                    document.documentElement.style.setProperty('--xlarge-size-c', `calc(var(--large-size-c) * 1.25)`);
                } else {
                    const inverseRatio = Math.max(1.1, Math.min(1.4, 1 / textRatio));
                    document.documentElement.style.setProperty('--paragraph-size-c', `calc(var(--base-size) * ${inverseRatio})`);
                    document.documentElement.style.setProperty('--large-size-c', `calc(var(--base-size) * ${textRatio} * 1.25)`);
                    document.documentElement.style.setProperty('--xlarge-size-c', `calc(var(--large-size-c) * 1.25)`);
                }
            }
            
            alert('Typography settings loaded!');
        } else {
            alert('No saved settings found. Use the configurator first!');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial values and calculate hybrid scaling
    updateDesign();
});

// Also run immediately in case DOMContentLoaded already fired
updateDesign();
