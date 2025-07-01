/**
 * FIXED Popup Script - Form Filling Now Works
 */

class FormAutomator {
  constructor() {
    console.log('🚀 Initializing FormAutomator');
    
    this.elements = {
      fillBtn: document.getElementById('fillFormBtn'),
      statusText: document.getElementById('statusText'),
      progressBar: document.getElementById('progressBar'),
      optionsBtn: document.getElementById('optionsBtn'),
      helpBtn: document.getElementById('helpBtn')
    };

    // Validate all elements exist
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
      console.error('❌ Missing DOM elements:', missing);
      throw new Error(`Missing required elements: ${missing.join(', ')}`);
    }

    console.log('✅ All DOM elements found');
  }

  async init() {
    this.setupEventListeners();
    await this.checkConfiguration();
  }

  setupEventListeners() {
    this.elements.fillBtn.addEventListener('click', () => this.handleFillForm());
    this.elements.optionsBtn.addEventListener('click', () => this.openOptions());
    this.elements.helpBtn.addEventListener('click', () => this.showHelp());
    
    console.log('✅ Event listeners setup complete');
  }

  async checkConfiguration() {
    try {
      const result = await chrome.storage.sync.get(['sheetUrl']);
      const sheetUrl = result.sheetUrl;

      if (!sheetUrl || sheetUrl.trim() === '') {
        this.updateStatus('⚠️ Configure Google Sheet URL in settings', 'error');
        this.elements.fillBtn.disabled = true;
        console.log('❌ No sheet URL configured');
      } else {
        this.updateStatus('✅ Ready to fill forms', 'success');
        this.elements.fillBtn.disabled = false;
        console.log('✅ Configuration OK, sheet URL:', sheetUrl);
      }

    } catch (error) {
      console.error('❌ Configuration check failed:', error);
      this.updateStatus('❌ Error checking configuration', 'error');
      this.elements.fillBtn.disabled = true;
    }
  }

  async handleFillForm() {
    console.log('🎯 Starting form fill process');

    try {
      // Disable button to prevent multiple clicks
      this.elements.fillBtn.disabled = true;
      this.updateStatus('🚀 Starting...', 'loading');
      this.showProgress(true);

      // Get active tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab = tabs[0];

      if (!tab) {
        throw new Error('No active tab found');
      }

      console.log('📄 Active tab:', tab.url);

      // Check if we can access the tab
      if (tab.url.startsWith('chrome://') || 
          tab.url.startsWith('chrome-extension://') || 
          tab.url.startsWith('edge://') || 
          tab.url.startsWith('about:')) {
        throw new Error('Cannot access browser system pages. Please navigate to a regular website.');
      }

      // Get sheet data first
      this.updateStatus('📊 Loading sheet data...', 'loading');
      const formData = await this.getSheetData();

      if (!formData || formData.length === 0) {
        throw new Error('No form data found in sheet. Make sure your sheet has data rows.');
      }

      console.log('📋 Loaded form data:', formData);

      // Inject content script (in case it's not already there)
      this.updateStatus('🔧 Preparing form filler...', 'loading');
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        });
        console.log('✅ Content script injected');
      } catch (injectError) {
        console.log('⚠️ Content script injection note:', injectError.message);
        // This is OK - script might already be loaded
      }

      // Wait for content script to initialize
      await this.sleep(1500);

      // Test content script connection with retry
      this.updateStatus('📡 Connecting to page...', 'loading');
      let connected = false;

      for (let attempt = 1; attempt <= 5; attempt++) {
        try {
          const pingResult = await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
          console.log(`📡 Ping attempt ${attempt} result:`, pingResult);
          
          if (pingResult && pingResult.success) {
            connected = true;
            break;
          }
        } catch (pingError) {
          console.log(`⚠️ Ping attempt ${attempt} failed:`, pingError.message);
          if (attempt < 5) {
            await this.sleep(1000);
          }
        }
      }

      if (!connected) {
        throw new Error('Cannot connect to page. Please refresh the page and try again.');
      }

      // Fill the form
      this.updateStatus(`📝 Filling ${formData.length} fields...`, 'loading');
      
      const result = await chrome.tabs.sendMessage(tab.id, {
        action: 'fillForm',
        data: formData
      });

      console.log('✅ Form fill result:', result);

      // Process results
      if (result && result.success) {
        let message = `✅ Success! ${result.successCount}/${result.totalCount} fields filled`;
        
        if (result.errorCount > 0) {
          message += ` (${result.errorCount} errors)`;
          console.warn('⚠️ Some errors occurred:', result.errors);
        }
        
        this.updateStatus(message, 'success');

        // Auto-close after success
        setTimeout(() => {
          if (window.close) {
            window.close();
          }
        }, 3000);

      } else {
        throw new Error(result?.error || 'Form filling failed');
      }

    } catch (error) {
      console.error('❌ Fill form error:', error);
      this.updateStatus(`❌ ${error.message}`, 'error');

    } finally {
      this.elements.fillBtn.disabled = false;
      this.showProgress(false);
    }
  }

  async getSheetData() {
    const result = await chrome.storage.sync.get(['sheetUrl']);
    const sheetUrl = result.sheetUrl;

    if (!sheetUrl) {
      throw new Error('No sheet URL configured. Please configure it in settings.');
    }

    // Extract sheet ID with better regex
    const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      throw new Error('Invalid Google Sheets URL format. Please check the URL.');
    }

    const sheetId = match[1];
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

    console.log('📡 Fetching sheet data from:', csvUrl);

    const response = await fetch(csvUrl);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Sheet access denied. Make sure the sheet is shared publicly (Anyone with link can view).');
      }
      if (response.status === 404) {
        throw new Error('Sheet not found. Please check the URL is correct.');
      }
      throw new Error(`Failed to fetch sheet data (HTTP ${response.status}). Please check the sheet URL.`);
    }

    const csvText = await response.text();

    if (!csvText || csvText.trim() === '') {
      throw new Error('Sheet appears to be empty.');
    }

    console.log('📄 CSV data received:', csvText.substring(0, 200) + '...');
    return this.parseCSVData(csvText);
  }

  parseCSVData(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());

    if (lines.length < 2) {
      throw new Error('Sheet must have at least a header row and one data row.');
    }

    console.log(`📊 Processing ${lines.length} lines from CSV`);
    const data = [];

    // Skip header row (index 0), process data rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const columns = this.parseCSVLine(line);

        if (columns.length >= 4) {
          const row = {
            fieldName: this.cleanValue(columns[0]) || `Field ${i}`,
            selector: this.cleanValue(columns[1]),
            selectorType: this.cleanValue(columns[2]) || 'auto',
            value: this.cleanValue(columns[3]) || ''
          };

          // Optional trigger column (5th column)
          if (columns.length >= 5) {
            row.trigger = this.cleanValue(columns[4]) || 'NORMAL';
          }

          // Only add row if selector is provided
          if (row.selector && row.selector.trim() !== '') {
            data.push(row);
            console.log(`📋 Parsed row ${i}:`, row);
          } else {
            console.log(`⏭️ Skipping row ${i}: no selector`);
          }
        } else {
          console.log(`⏭️ Skipping row ${i}: insufficient columns (${columns.length})`);
        }

      } catch (parseError) {
        console.warn(`⚠️ Error parsing row ${i}:`, parseError.message);
      }
    }

    if (data.length === 0) {
      throw new Error('No valid form fields found in sheet. Check your sheet format.');
    }

    console.log(`📊 Successfully parsed ${data.length} form fields`);
    return data;
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Column separator
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    // Add last column
    result.push(current);
    return result;
  }

  cleanValue(value) {
    if (!value) return '';
    
    let cleaned = value.toString().trim();
    
    // Remove surrounding quotes
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }
    
    // Replace escaped quotes
    cleaned = cleaned.replace(/""/g, '"');
    
    return cleaned.trim();
  }

  updateStatus(message, type = '') {
    this.elements.statusText.textContent = message;
    this.elements.statusText.className = `status-text ${type ? 'status-' + type : ''}`;
    console.log(`📊 Status Update: ${message}`);
  }

  showProgress(show) {
    this.elements.progressBar.style.display = show ? 'block' : 'none';
  }

  openOptions() {
    try {
      chrome.runtime.openOptionsPage();
    } catch (error) {
      console.error('Error opening options:', error);
      // Fallback - try to open in new tab
      chrome.tabs.create({ url: chrome.runtime.getURL('options.html') });
    }
  }

  showHelp() {
    const helpContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Sheet-to-Form Automator Help</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f2f2f2; }
    h1, h2 { color: #333; }
    .example { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
    code { background: #e9ecef; padding: 2px 4px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>📋 Sheet-to-Form Automator Help</h1>
  
  <h2>Required Sheet Format</h2>
  <p>Your Google Sheet must have these columns in order:</p>
  
  <table>
    <tr>
      <th>Column</th>
      <th>Name</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
    <tr>
      <td>A</td>
      <td>FieldName</td>
      <td>Descriptive name for the field</td>
      <td>Email Field</td>
    </tr>
    <tr>
      <td>B</td>
      <td>Selector</td>
      <td>How to find the element</td>
      <td>email</td>
    </tr>
    <tr>
      <td>C</td>
      <td>SelectorType</td>
      <td>Method to find element</td>
      <td>id</td>
    </tr>
    <tr>
      <td>D</td>
      <td>Value</td>
      <td>Value to enter or action</td>
      <td>test@example.com</td>
    </tr>
    <tr>
      <td>E</td>
      <td>Trigger (Optional)</td>
      <td>Speed/behavior setting</td>
      <td>FAST</td>
    </tr>
  </table>
  
  <h2>Example Sheet</h2>
  <div class="example">
    <table>
      <tr>
        <th>FieldName</th>
        <th>Selector</th>
        <th>SelectorType</th>
        <th>Value</th>
        <th>Trigger</th>
      </tr>
      <tr>
        <td>Email</td>
        <td>email</td>
        <td>id</td>
        <td>test@example.com</td>
        <td>FAST</td>
      </tr>
      <tr>
        <td>Password</td>
        <td>password</td>
        <td>name</td>
        <td>mypassword</td>
        <td>NORMAL</td>
      </tr>
      <tr>
        <td>Submit</td>
        <td>Sign In</td>
        <td>text</td>
        <td>CLICK</td>
        <td>SLOW</td>
      </tr>
    </table>
  </div>
  
  <h2>Selector Types</h2>
  <ul>
    <li><code>id</code> - Find by element ID</li>
    <li><code>name</code> - Find by name attribute</li>
    <li><code>class</code> - Find by CSS class</li>
    <li><code>css</code> - CSS selector</li>
    <li><code>text</code> - Find by text content</li>
    <li><code>placeholder</code> - Find by placeholder text</li>
    <li><code>label</code> - Find by label text</li>
    <li><code>auto</code> - Try multiple methods</li>
  </ul>
  
  <h2>Special Values</h2>
  <ul>
    <li><code>CLICK</code> - Click the element</li>
    <li><code>CHECK</code> - Check checkbox</li>
    <li><code>UNCHECK</code> - Uncheck checkbox</li>
    <li><code>CLEAR</code> - Clear field</li>
    <li><code>FOCUS</code> - Focus element</li>
  </ul>
  
  <h2>Trigger Options</h2>
  <ul>
    <li><code>FAST</code> - Quick filling (100-300ms delays)</li>
    <li><code>NORMAL</code> - Normal speed (300-800ms delays)</li>
    <li><code>SLOW</code> - Slower filling (800-1500ms delays)</li>
    <li><code>HUMAN</code> - Human-like timing (1-2s delays)</li>
    <li><code>NINJA</code> - Ultimate stealth mode (800-3500ms delays)</li>
    <li><code>OFF</code> - Skip this field</li>
  </ul>
  
  <h2>Setup Instructions</h2>
  <ol>
    <li>Create a Google Sheet with the format above</li>
    <li>Make the sheet public (Anyone with link can view)</li>
    <li>Copy the sheet URL</li>
    <li>Go to extension settings and paste the URL</li>
    <li>Test the connection</li>
    <li>Navigate to a form and click "Fill This Form"</li>
  </ol>
</body>
</html>
    `;
    
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(helpContent);
    chrome.tabs.create({ url: dataUrl });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 Popup DOM loaded');
  
  try {
    new FormAutomator();
  } catch (error) {
    console.error('❌ Failed to initialize FormAutomator:', error);
  }
});