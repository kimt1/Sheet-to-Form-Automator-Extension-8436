/**
 * Sheet-to-Form Automator - Options Script
 * Settings management for the extension
 */

class OptionsController {
  constructor() {
    this.sheetUrlInput = document.getElementById('sheetUrl');
    this.saveBtn = document.getElementById('saveBtn');
    this.testBtn = document.getElementById('testBtn');
    this.statusMessage = document.getElementById('statusMessage');
    
    this.initializeEventListeners();
    this.loadSavedSettings();
    
    console.log('✅ Options page initialized');
  }

  initializeEventListeners() {
    this.saveBtn.addEventListener('click', () => this.saveSettings());
    this.testBtn.addEventListener('click', () => this.testConnection());
    
    this.sheetUrlInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.saveSettings();
    });
  }

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
      this.showStatus('✅ Settings saved successfully!', 'success');
      
      setTimeout(() => this.hideStatus(), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showStatus('❌ Error saving settings', 'error');
    }
  }

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
    this.showStatus('🧪 Testing connection...', 'info');

    try {
      // Extract sheet ID from URL
      const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!sheetIdMatch) {
        throw new Error('Could not extract sheet ID from URL');
      }
      
      const sheetId = sheetIdMatch[1];
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
      
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Access denied. Make sure the sheet is publicly viewable.');
        } else if (response.status === 404) {
          throw new Error('Sheet not found. Check the URL.');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const csvData = await response.text();
      const lines = csvData.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        throw new Error('Sheet appears to be empty or has no data rows');
      }

      const dataRowCount = lines.length - 1; // Subtract header row
      this.showStatus(`✅ Connection successful! Found ${dataRowCount} data rows.`, 'success');
      
    } catch (error) {
      console.error('Test connection error:', error);
      this.showStatus(`❌ ${error.message}`, 'error');
    } finally {
      this.testBtn.disabled = false;
      this.testBtn.textContent = '🧪 Test Connection';
    }
  }

  isValidGoogleSheetUrl(url) {
    return /^https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9-_]+/.test(url);
  }

  showStatus(message, type) {
    this.statusMessage.textContent = message;
    this.statusMessage.className = `status-message status-${type}`;
    this.statusMessage.style.display = 'block';
  }

  hideStatus() {
    this.statusMessage.style.display = 'none';
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  new OptionsController();
});