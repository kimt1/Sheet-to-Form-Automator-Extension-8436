/**
 * WORKING Options Script - DOUBLE-CHECKED AND FIXED
 */

class OptionsManager {
  constructor() {
    console.log('⚙️ Options manager initialized');
    
    this.elements = {
      sheetUrl: document.getElementById('sheetUrl'),
      saveBtn: document.getElementById('saveBtn'),
      testBtn: document.getElementById('testBtn'),
      statusMessage: document.getElementById('statusMessage')
    };
    
    this.validateElements();
    this.init();
  }
  
  validateElements() {
    const missing = [];
    for (const [key, element] of Object.entries(this.elements)) {
      if (!element) {
        missing.push(key);
      }
    }
    
    if (missing.length > 0) {
      console.error('❌ Missing DOM elements in options:', missing);
      alert(`Missing required elements: ${missing.join(', ')}`);
      return;
    }
    
    console.log('✅ All options DOM elements found');
  }
  
  init() {
    this.setupEventListeners();
    this.loadSettings();
  }
  
  setupEventListeners() {
    this.elements.saveBtn.addEventListener('click', () => this.saveSettings());
    this.elements.testBtn.addEventListener('click', () => this.testConnection());
    
    this.elements.sheetUrl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.saveSettings();
      }
    });
    
    this.elements.sheetUrl.addEventListener('input', () => {
      this.hideStatus();
    });
    
    console.log('✅ Options event listeners setup');
  }
  
  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['sheetUrl']);
      if (result.sheetUrl) {
        this.elements.sheetUrl.value = result.sheetUrl;
        console.log('✅ Loaded saved sheet URL');
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error);
      this.showStatus('Error loading saved settings', 'error');
    }
  }
  
  async saveSettings() {
    const sheetUrl = this.elements.sheetUrl.value.trim();
    
    if (!sheetUrl) {
      this.showStatus('Please enter a Google Sheet URL', 'error');
      return;
    }
    
    if (!this.isValidSheetUrl(sheetUrl)) {
      this.showStatus('Please enter a valid Google Sheets URL (must contain /spreadsheets/d/)', 'error');
      return;
    }
    
    try {
      await chrome.storage.sync.set({ sheetUrl });
      this.showStatus('✅ Settings saved successfully!', 'success');
      console.log('✅ Sheet URL saved:', sheetUrl);
      
      setTimeout(() => {
        this.hideStatus();
      }, 3000);
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      this.showStatus('❌ Error saving settings. Please try again.', 'error');
    }
  }
  
  async testConnection() {
    const sheetUrl = this.elements.sheetUrl.value.trim();
    
    if (!sheetUrl) {
      this.showStatus('Please enter a sheet URL first', 'error');
      return;
    }
    
    if (!this.isValidSheetUrl(sheetUrl)) {
      this.showStatus('Invalid Google Sheet URL format', 'error');
      return;
    }
    
    // Disable button and show loading state
    this.elements.testBtn.disabled = true;
    this.elements.testBtn.textContent = '🔄 Testing...';
    this.showStatus('🧪 Testing connection to Google Sheet...', 'info');
    
    try {
      const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        throw new Error('Could not extract sheet ID from URL');
      }
      
      const sheetId = match[1];
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
      
      console.log('🧪 Testing connection to:', csvUrl);
      
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Make sure the sheet is shared publicly (Anyone with link can view).');
        }
        if (response.status === 404) {
          throw new Error('Sheet not found. Please check the URL is correct.');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const csvData = await response.text();
      
      if (!csvData || csvData.trim() === '') {
        throw new Error('Sheet appears to be empty');
      }
      
      const lines = csvData.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Sheet must have at least a header row and one data row');
      }
      
      const dataRowCount = lines.length - 1; // Subtract header row
      this.showStatus(`✅ Connection successful! Found ${dataRowCount} data rows in the sheet.`, 'success');
      
      console.log('✅ Test connection successful:', {
        sheetId,
        totalLines: lines.length,
        dataRows: dataRowCount,
        firstDataLine: lines[1]?.substring(0, 100) + '...'
      });
      
    } catch (error) {
      console.error('❌ Test connection failed:', error);
      this.showStatus(`❌ Test failed: ${error.message}`, 'error');
    } finally {
      this.elements.testBtn.disabled = false;
      this.elements.testBtn.textContent = '🧪 Test Connection';
    }
  }
  
  isValidSheetUrl(url) {
    // More comprehensive validation
    const patterns = [
      /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/,
      /^https:\/\/sheets\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/
    ];
    
    return patterns.some(pattern => pattern.test(url));
  }
  
  showStatus(message, type) {
    this.elements.statusMessage.textContent = message;
    this.elements.statusMessage.className = `status-message status-${type}`;
    this.elements.statusMessage.style.display = 'block';
    
    console.log(`📊 Options Status: ${message}`);
  }
  
  hideStatus() {
    this.elements.statusMessage.style.display = 'none';
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('⚙️ Options page DOM loaded');
  try {
    new OptionsManager();
  } catch (error) {
    console.error('❌ Failed to initialize OptionsManager:', error);
  }
});