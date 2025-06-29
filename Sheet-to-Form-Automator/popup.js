/**
 * Sheet-to-Form Automator - Popup Script
 * Handles user interactions and form filling orchestration
 */

class PopupController {
  constructor() {
    this.fillBtn = document.getElementById('fillFormBtn');
    this.statusText = document.getElementById('statusText');
    this.statusArea = document.getElementById('statusArea');
    this.progressBar = document.getElementById('progressBar');
    this.optionsBtn = document.getElementById('optionsBtn');
    
    this.initializeEventListeners();
    this.checkSheetUrl();
  }

  /**
   * Initialize event listeners for popup interactions
   */
  initializeEventListeners() {
    this.fillBtn.addEventListener('click', () => this.handleFillForm());
    this.optionsBtn.addEventListener('click', () => this.openOptions());
  }

  /**
   * Check if Google Sheet URL is configured
   */
  async checkSheetUrl() {
    try {
      const result = await chrome.storage.sync.get(['sheetUrl']);
      if (!result.sheetUrl) {
        this.updateStatus('Please configure your Google Sheet URL in settings', 'error');
        this.fillBtn.disabled = true;
      }
    } catch (error) {
      console.error('Error checking sheet URL:', error);
      this.updateStatus('Error accessing storage', 'error');
    }
  }

  /**
   * Handle form filling process
   */
  async handleFillForm() {
    try {
      // Play click sound
      await this.playSound('click.mp3');
      
      this.fillBtn.disabled = true;
      this.updateStatus('Getting current page...', 'loading');
      this.showProgress(true);

      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        throw new Error('No active tab found');
      }

      // Get sheet URL from storage
      const result = await chrome.storage.sync.get(['sheetUrl']);
      if (!result.sheetUrl) {
        throw new Error('No Google Sheet URL configured');
      }

      this.updateStatus('Fetching data from Google Sheet...', 'loading');

      // Fetch and parse CSV data
      const csvData = await this.fetchSheetData(result.sheetUrl);
      const formData = this.parseCSVData(csvData);

      if (formData.length === 0) {
        throw new Error('No form data found in sheet');
      }

      this.updateStatus(`Processing ${formData.length} form fields...`, 'loading');

      // Inject content script and send data
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      // Send form data to content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'fillForm',
        data: formData
      });

      // Handle response
      if (response && response.success) {
        const successCount = response.successCount || 0;
        const totalCount = response.totalCount || 0;
        const errorCount = totalCount - successCount;

        if (errorCount === 0) {
          await this.playSound('success.mp3');
          this.updateStatus(`Success! Filled all ${successCount} fields.`, 'success');
        } else {
          await this.playSound('error.mp3');
          this.updateStatus(`Completed with ${errorCount} errors. Filled ${successCount} of ${totalCount} fields.`, 'error');
        }
      } else {
        throw new Error(response?.error || 'Unknown error occurred');
      }

    } catch (error) {
      console.error('Form filling error:', error);
      await this.playSound('error.mp3');
      this.updateStatus(`Error: ${error.message}`, 'error');
    } finally {
      this.fillBtn.disabled = false;
      this.showProgress(false);
    }
  }

  /**
   * Fetch data from Google Sheet as CSV
   */
  async fetchSheetData(sheetUrl) {
    // Convert Google Sheet URL to CSV export URL
    const csvUrl = this.convertToCsvUrl(sheetUrl);
    
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet data: ${response.status}`);
    }
    
    return await response.text();
  }

  /**
   * Convert Google Sheet URL to CSV export URL
   */
  convertToCsvUrl(sheetUrl) {
    // Extract sheet ID from various Google Sheets URL formats
    const sheetIdMatch = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!sheetIdMatch) {
      throw new Error('Invalid Google Sheet URL format');
    }
    
    const sheetId = sheetIdMatch[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  }

  /**
   * Parse CSV data into structured form data
   */
  parseCSVData(csvText) {
    const lines = csvText.split('\n');
    const formData = [];
    
    // Skip header row and process data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = this.parseCSVLine(line);
      if (columns.length >= 4) {
        const [fieldName, selector, selectorType, value] = columns;
        
        if (selector && selectorType && value) {
          formData.push({
            fieldName: fieldName.trim(),
            selector: selector.trim(),
            selectorType: selectorType.trim().toLowerCase(),
            value: value.trim()
          });
        }
      }
    }
    
    return formData;
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
   * Play sound effect
   */
  async playSound(soundFile) {
    try {
      const audio = new Audio(chrome.runtime.getURL(`sounds/${soundFile}`));
      audio.volume = 0.3;
      await audio.play();
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  }

  /**
   * Update status display
   */
  updateStatus(message, type = 'default') {
    this.statusText.textContent = message;
    this.statusText.className = `status-text ${type ? `status-${type}` : ''}`;
  }

  /**
   * Show/hide progress bar
   */
  showProgress(show) {
    this.progressBar.style.display = show ? 'block' : 'none';
  }

  /**
   * Open options page
   */
  openOptions() {
    chrome.runtime.openOptionsPage();
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});