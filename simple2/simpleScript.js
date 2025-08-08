// Get all controls
const textSizeSlider = document.getElementById('textSize');
const hueSlider = document.getElementById('hue');
const spacingSlider = document.getElementById('spacing');

// Get value displays
const textSizeValue = document.getElementById('textSizeValue');
const hueValue = document.getElementById('hueValue');
const spacingValue = document.getElementById('spacingValue');

// Update CSS variables and displays
function updateDesign() {
    const textRatio = textSizeSlider.value;
    const hue = hueSlider.value;
    const spacing = spacingSlider.value;
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--text-ratio', textRatio);
    document.documentElement.style.setProperty('--hue', hue);
    document.documentElement.style.setProperty('--spacing-ratio', spacing);
    
    // Update value displays
    textSizeValue.textContent = textRatio;
    hueValue.textContent = hue + '°';
    spacingValue.textContent = spacing;
}

// Add event listeners
if (textSizeSlider) textSizeSlider.addEventListener('input', updateDesign);
if (hueSlider) hueSlider.addEventListener('input', updateDesign);
if (spacingSlider) spacingSlider.addEventListener('input', updateDesign);

// Generate CSS button
const generateBtn = document.getElementById('generateCSS');
if (generateBtn) {
    generateBtn.addEventListener('click', function() {
        const css = `:root {
    --text-ratio: ${textSizeSlider.value};
    --hue: ${hueSlider.value};
    --spacing-ratio: ${spacingSlider.value};
}`;
        
        // Save to localStorage for the other page
        localStorage.setItem('fontolo-css', css);
        
        // Download CSS file
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fontolo-tokens.css';
        a.click();
        
        alert('CSS saved! You can also load it on the grid page.');
    });
}

// Load CSS button
const loadBtn = document.getElementById('loadCSS');
if (loadBtn) {
    loadBtn.addEventListener('click', function() {
        const savedCSS = localStorage.getItem('fontolo-css');
        if (savedCSS) {
            // Parse the CSS and apply the values
            const textMatch = savedCSS.match(/--text-ratio: ([\d.]+)/);
            const hueMatch = savedCSS.match(/--hue: (\d+)/);
            const spacingMatch = savedCSS.match(/--spacing-ratio: ([\d.]+)/);
            
            if (textMatch) document.documentElement.style.setProperty('--text-ratio', textMatch[1]);
            if (hueMatch) document.documentElement.style.setProperty('--hue', hueMatch[1]);
            if (spacingMatch) document.documentElement.style.setProperty('--spacing-ratio', spacingMatch[1]);
            
            alert('Design tokens loaded!');
        } else {
            alert('No saved tokens found. Use the configurator first!');
        }
    });
}
// [Keep all existing code and add this hybrid calculation]

// Hybrid scaling calculation
function calculateHybridScaling() {
    const textRatio = parseFloat(textSizeSlider.value);
    const shiftPoint = parseFloat(document.getElementById('shiftPoint').value);
    
    if (textRatio <= shiftPoint) {
        // Below threshold: use proportional scaling
        document.documentElement.style.setProperty('--paragraph-size-c', `calc(var(--base-size) * ${textRatio})`);
        document.documentElement.style.setProperty('--large-size-c', `calc(var(--paragraph-size-c) * 1.25)`);
        document.documentElement.style.setProperty('--xlarge-size-c', `calc(var(--large-size-c) * 1.25)`);
        
        document.getElementById('currentMethod').textContent = 'Proportional (below threshold)';
        
        } else {
        // Above threshold: use INVERSE scaling (as described in HTML)
        const inverseRatio = Math.max(1.1, Math.min(1.4, 1 / textRatio));
        document.documentElement.style.setProperty('--paragraph-size-c', `calc(var(--base-size) * ${inverseRatio})`);
        document.documentElement.style.setProperty('--large-size-c', `calc(var(--base-size) * ${textRatio} * 1.25)`);
        document.documentElement.style.setProperty('--xlarge-size-c', `calc(var(--large-size-c) * 1.25)`);
        
        document.getElementById('currentMethod').textContent = 'Inverse (above threshold)';
    }
}
}

// Add shift point slider handling
const shiftPointSlider = document.getElementById('shiftPoint');
const shiftPointValue = document.getElementById('shiftPointValue');
const thresholdDisplay = document.getElementById('thresholdDisplay');

if (shiftPointSlider) {
    shiftPointSlider.addEventListener('input', function() {
        const value = this.value;
        shiftPointValue.textContent = value;
        thresholdDisplay.textContent = value;
        document.documentElement.style.setProperty('--shift-point', value);
        calculateHybridScaling();
    });
}

// Update the main updateDesign function to include hybrid calculation
function updateDesign() {
    const textRatio = textSizeSlider.value;
    const hue = hueSlider.value;
    const spacing = spacingSlider.value;
    
    // Update CSS custom properties
    document.documentElement.style.setProperty('--text-ratio', textRatio);
    document.documentElement.style.setProperty('--hue', hue);
    document.documentElement.style.setProperty('--spacing-ratio', spacing);
    
    // Update value displays
    textSizeValue.textContent = textRatio;
    hueValue.textContent = hue + '°';
    spacingValue.textContent = spacing;
    
    // Calculate hybrid scaling
    calculateHybridScaling();
}
