/**
 * Sheet-to-Form Automator - Enhanced Popup Script
 * Updated to support new trigger column format
 */
class PopupController {
  constructor() {
    this.fillBtn = document.getElementById('fillFormBtn');
    this.statusText = document.getElementById('statusText');
    this.progressBar = document.getElementById('progressBar');
    this.optionsBtn = document.getElementById('optionsBtn');
    this.helpBtn = document.getElementById('helpBtn');

    this.initializeEventListeners();
    this.checkSheetUrl();
    console.log('✅ Enhanced Popup initialized');
  }

  initializeEventListeners() {
    this.fillBtn.addEventListener('click', () => this.handleFillForm());
    this.optionsBtn.addEventListener('click', () => this.openOptions());
    this.helpBtn.addEventListener('click', () => this.showHelp());
  }

  async checkSheetUrl() {
    try {
      const result = await chrome.storage.sync.get(['sheetUrl']);
      if (!result.sheetUrl) {
        this.updateStatus('⚠️ Configure your Google Sheet URL in settings', 'error');
        this.fillBtn.disabled = true;
      } else {
        this.updateStatus('✅ Ready to fill forms with enhanced logic', 'success');
        this.fillBtn.disabled = false;
      }
    } catch (error) {
      console.error('Error checking sheet URL:', error);
      this.updateStatus('❌ Error checking settings', 'error');
    }
  }

  async handleFillForm() {
    console.log('🚀 Enhanced fill form button clicked');
    
    try {
      this.fillBtn.disabled = true;
      this.updateStatus('🚀 Starting enhanced form fill...', 'loading');
      this.showProgress(true);

      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        throw new Error('No active tab found');
      }

      console.log('📄 Current tab:', tab.url);

      // Check if we can access this tab
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        throw new Error('Cannot access Chrome system pages');
      }

      // Get sheet data
      const result = await chrome.storage.sync.get(['sheetUrl']);
      if (!result.sheetUrl) {
        throw new Error('No sheet URL configured');
      }

      this.updateStatus('📊 Getting enhanced sheet data...', 'loading');
      const formData = await this.getFormData(result.sheetUrl);

      if (!formData || formData.length === 0) {
        throw new Error('No form data found in sheet');
      }

      console.log('📋 Enhanced form data loaded:', formData);
      this.updateStatus(`📝 Filling ${formData.length} fields with enhanced logic...`, 'loading');

      // Inject content script and fill form
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      // Wait a bit for content script to load
      await this.sleep(500);

      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'fillForm',
        data: formData
      });

      console.log('📨 Enhanced content script response:', response);

      if (response.success) {
        this.updateStatus(`✅ Enhanced form filled! ${response.successCount}/${response.totalCount} fields`, 'success');
        if (response.errors && response.errors.length > 0) {
          console.log('⚠️ Some errors occurred:', response.errors);
        }
      } else {
        throw new Error(response.error || 'Enhanced form filling failed');
      }

      // Auto-close popup after 3 seconds
      setTimeout(() => {
        window.close();
      }, 3000);

    } catch (error) {
      console.error('❌ Enhanced error:', error);
      this.updateStatus(`❌ Error: ${error.message}`, 'error');
    } finally {
      this.fillBtn.disabled = false;
      this.showProgress(false);
    }
  }

  async getFormData(sheetUrl) {
    try {
      // Extract sheet ID from URL
      const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!sheetIdMatch) {
        throw new Error('Invalid Google Sheets URL');
      }

      const sheetId = sheetIdMatch[1];
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

      console.log('📡 Fetching from:', csvUrl);

      const response = await fetch(csvUrl);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Sheet access denied. Make sure it\'s publicly viewable.');
        }
        throw new Error(`Failed to fetch sheet data: ${response.status}`);
      }

      const csvText = await response.text();
      console.log('📄 CSV data received:', csvText.substring(0, 200) + '...');

      return this.parseCSV(csvText);
    } catch (error) {
      throw new Error(`Sheet error: ${error.message}`);
    }
  }

  parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    const formData = [];

    // Skip header row, start from index 1
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV parsing (handles quoted fields)
      const columns = this.parseCSVLine(line);
      
      if (columns.length >= 4) {
        const fieldEntry = {
          fieldName: columns[0],
          selector: columns[1],
          selectorType: columns[2],
          value: columns[3]
        };

        // Check for optional 5th column (trigger/anti-robot settings)
        if (columns.length >= 5 && columns[4].trim()) {
          fieldEntry.trigger = columns[4].trim();
        }

        formData.push(fieldEntry);
      }
    }

    console.log('📊 Parsed enhanced form data:', formData);
    return formData;
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"' && !inQuotes) {
        inQuotes = true;
      } else if (char === '"' && inQuotes) {
        if (nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateStatus(message, type = '') {
    this.statusText.textContent = message;
    this.statusText.className = `status-text ${type ? 'status-' + type : ''}`;
    console.log(`📊 Status: ${message}`);
  }

  showProgress(show) {
    this.progressBar.style.display = show ? 'block' : 'none';
  }

  openOptions() {
    chrome.runtime.openOptionsPage();
  }

  showHelp() {
    chrome.tabs.create({
      url: 'https://github.com/yourusername/sheet-to-form-automator'
    });
  }
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 DOM loaded, initializing enhanced popup');
  new PopupController();
});