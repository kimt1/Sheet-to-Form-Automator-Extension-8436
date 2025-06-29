/**
 * Sheet-to-Form Automator - Options Script
 * Handles settings configuration and Google Sheet URL management
 */

class OptionsController {
  constructor() {
    this.sheetUrlInput = document.getElementById('sheetUrl');
    this.saveBtn = document.getElementById('saveBtn');
    this.testBtn = document.getElementById('testBtn');
    this.statusMessage = document.getElementById('statusMessage');
    
    this.initializeEventListeners();
    this.loadSavedSettings();
  }

  /**
   * Initialize event listeners for options page
   */
  initializeEventListeners() {
    this.saveBtn.addEventListener('click', () => this.saveSettings());
    this.testBtn.addEventListener('click', () => this.testConnection());
    this.sheetUrlInput.addEventListener('input', () => this.hideStatus());
    
    // Save on Enter key
    this.sheetUrlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveSettings();
      }
    });
  }

  /**
   * Load saved settings from chrome storage
   */
  async loadSavedSettings() {
    try {
      const result = await chrome.storage.sync.get(['sheetUrl']);
      if (result.sheetUrl) {
        this.sheetUrlInput.value = result.sheetUrl;
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      this.showStatus('Error loading saved settings', 'error');
    }
  }

  /**
   * Save settings to chrome storage
   */
  async saveSettings() {
    const sheetUrl = this.sheetUrlInput.value.trim();
    
    if (!sheetUrl) {
      this.showStatus('Please enter a Google Sheet URL', 'error');
      return;
    }

    if (!this.isValidGoogleSheetUrl(sheetUrl)) {
      this.showStatus('Please enter a valid Google Sheet URL', 'error');
      return;
    }

    try {
      await chrome.storage.sync.set({ sheetUrl });
      this.showStatus('Settings saved successfully!', 'success');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => this.hideStatus(), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showStatus('Error saving settings. Please try again.', 'error');
    }
  }

  /**
   * Test connection to the Google Sheet
   */
  async testConnection() {
    const sheetUrl = this.sheetUrlInput.value.trim();
    
    if (!sheetUrl) {
      this.showStatus('Please enter a Google Sheet URL first', 'error');
      return;
    }

    if (!this.isValidGoogleSheetUrl(sheetUrl)) {
      this.showStatus('Please enter a valid Google Sheet URL', 'error');
      return;
    }

    this.testBtn.disabled = true;
    this.testBtn.textContent = '🔄 Testing...';
    this.showStatus('Testing connection to Google Sheet...', 'info');

    try {
      const csvUrl = this.convertToCsvUrl(sheetUrl);
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const csvData = await response.text();
      const lines = csvData.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Sheet appears to be empty or has no data rows');
      }

      // Parse header row to check format
      const headerLine = lines[0];
      const headers = this.parseCSVLine(headerLine);
      
      if (headers.length < 4) {
        throw new Error('Sheet must have at least 4 columns: FieldName, Selector, SelectorType, Value');
      }

      const dataRowCount = lines.length - 1;
      this.showStatus(`✅ Connection successful! Found ${dataRowCount} data rows in the sheet.`, 'success');

    } catch (error) {
      console.error('Test connection error:', error);
      let errorMessage = 'Connection failed: ' + error.message;
      
      if (error.message.includes('HTTP 403')) {
        errorMessage = 'Access denied. Make sure the Google Sheet is publicly viewable.';
      } else if (error.message.includes('HTTP 404')) {
        errorMessage = 'Sheet not found. Please check the URL and make sure the sheet exists.';
      }
      
      this.showStatus(errorMessage, 'error');
    } finally {
      this.testBtn.disabled = false;
      this.testBtn.textContent = '🧪 Test Connection';
    }
  }

  /**
   * Validate Google Sheet URL format
   */
  isValidGoogleSheetUrl(url) {
    const googleSheetPattern = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/;
    return googleSheetPattern.test(url);
  }

  /**
   * Convert Google Sheet URL to CSV export URL
   */
  convertToCsvUrl(sheetUrl) {
    const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      throw new Error('Could not extract sheet ID from URL');
    }
    
    const sheetId = sheetIdMatch[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  }

  /**
   * Parse a single CSV line, handling quoted values
   */
  parseCSVLine(line) {
    const columns = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        columns.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    columns.push(current);
    return columns.map(col => col.replace(/^"|"$/g, ''));
  }

  /**
   * Show status message
   */
  showStatus(message, type) {
    this.statusMessage.textContent = message;
    this.statusMessage.className = `status-message status-${type}`;
    this.statusMessage.style.display = 'block';
  }

  /**
   * Hide status message
   */
  hideStatus() {
    this.statusMessage.style.display = 'none';
  }
}

// Initialize options controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OptionsController();
});