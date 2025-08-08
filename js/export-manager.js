// js/export-manager.js

const EXPORT_MODULES = {
  tokens: {
    name: 'Design Tokens',
    description: 'CSS variables only (colors, spacing, typography)',
    size: '~5KB',
    required: true, // Always included
    includes: ['tokens.css']
  },
  
  layout: {
    name: 'Layout System',
    description: 'Stack patterns, grid system, spacing utilities',
    size: '~15KB',
    requires: ['tokens'],
    includes: ['layout.css']
  },
  
  components: {
    name: 'Components',
    description: 'Buttons, cards, forms, accordions',
    size: '~25KB',
    requires: ['tokens', 'layout'],
    includes: ['components.css']
  },
  
  utilities: {
    name: 'Utility Classes',
    description: 'Text colors, backgrounds, borders',
    size: '~10KB',
    requires: ['tokens'],
    includes: ['utilities.css']
  },
  
  reset: {
    name: 'Base Reset',
    description: 'Normalize & typography defaults',
    size: '~3KB',
    requires: ['tokens'],
    includes: ['base.css']
  },
  
  examples: {
    name: 'HTML Examples',
    description: 'Sample HTML pages using the system',
    size: '~20KB',
    requires: ['tokens', 'layout', 'components'],
    includes: ['examples/index.html', 'examples/blog.html', 'examples/dashboard.html']
  }
};

function createExportModal() {
  const modal = document.createElement('div');
  modal.className = 'export-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <h2>Export Design System</h2>
      <p>Choose what to include in your download:</p>
      
      <div class="export-modules">
        ${Object.entries(EXPORT_MODULES).map(([key, module]) => `
          <label class="module-option ${module.required ? 'required' : ''}">
            <input type="checkbox" 
                   value="${key}" 
                   ${module.required ? 'checked disabled' : ''}
                   data-requires="${(module.requires || []).join(',')}">
            <div class="module-info">
              <div class="module-header">
                <strong>${module.name}</strong>
                <span class="module-size">${module.size}</span>
              </div>
              <small>${module.description}</small>
            </div>
          </label>
        `).join('')}
      </div>
      
      <div class="export-format">
        <h3>Export Format:</h3>
        <label>
          <input type="radio" name="format" value="separate" checked>
          Separate Files (development)
        </label>
        <label>
          <input type="radio" name="format" value="combined">
          Single CSS File (production)
        </label>
        <label>
          <input type="radio" name="format" value="zip">
          ZIP Package (complete project)
        </label>
      </div>
      
      <div class="export-preview">
        <div class="preview-size">Total size: <strong id="totalSize">~5KB</strong></div>
        <div class="preview-files">Files: <strong id="fileCount">1 file</strong></div>
      </div>
      
      <div class="modal-actions">
        <button class="btn btn-secondary" onclick="closeExportModal()">Cancel</button>
        <button class="btn btn-primary" onclick="executeExport()">Download</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add dependency management
  modal.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', handleModuleDependencies);
  });
  
  updateExportPreview();
}

function handleModuleDependencies(e) {
  const checkbox = e.target;
  const requires = checkbox.dataset.requires?.split(',').filter(Boolean) || [];
  
  if (checkbox.checked) {
    // Auto-check required dependencies
    requires.forEach(dep => {
      const depCheckbox = document.querySelector(`input[value="${dep}"]`);
      if (depCheckbox) depCheckbox.checked = true;
    });
  } else {
    // Check if anything depends on this
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(other => {
      const otherRequires = other.dataset.requires?.split(',').filter(Boolean) || [];
      if (otherRequires.includes(checkbox.value)) {
        other.checked = false;
      }
    });
  }
  
  updateExportPreview();
}

function updateExportPreview() {
  const selected = Array.from(document.querySelectorAll('.export-modules input:checked'))
    .map(cb => cb.value);
  
  let totalSize = 0;
  let fileCount = 0;
  
  selected.forEach(key => {
    const module = EXPORT_MODULES[key];
    const sizeMatch = module.size.match(/~(\d+)KB/);
    if (sizeMatch) totalSize += parseInt(sizeMatch[1]);
    fileCount += module.includes.length;
  });
  
  document.getElementById('totalSize').textContent = `~${totalSize}KB`;
  document.getElementById('fileCount').textContent = `${fileCount} ${fileCount === 1 ? 'file' : 'files'}`;
}
