/**
 * Sheet-to-Form Automator - Content Script
 * Handles DOM manipulation and form filling on web pages
 */

class FormFiller {
  constructor() {
    this.successCount = 0;
    this.errorCount = 0;
    this.totalCount = 0;
    this.errors = [];
  }

  /**
   * Main form filling function
   */
  async fillForm(formData) {
    console.log('🚀 Starting form fill process with', formData.length, 'fields');
    
    this.successCount = 0;
    this.errorCount = 0;
    this.totalCount = formData.length;
    this.errors = [];

    // Process each form field
    for (let i = 0; i < formData.length; i++) {
      const fieldData = formData[i];
      console.log(`📝 Processing field ${i + 1}/${formData.length}:`, fieldData.fieldName);
      
      try {
        await this.processField(fieldData);
        this.successCount++;
        console.log(`✅ Successfully processed: ${fieldData.fieldName}`);
      } catch (error) {
        this.errorCount++;
        const errorInfo = {
          fieldName: fieldData.fieldName,
          selector: fieldData.selector,
          error: error.message
        };
        this.errors.push(errorInfo);
        console.error(`❌ Error processing ${fieldData.fieldName}:`, error.message);
      }
      
      // Small delay between fields to prevent overwhelming the page
      await this.sleep(50);
    }

    // Log summary
    console.log(`📊 Form fill completed: ${this.successCount}/${this.totalCount} successful`);
    if (this.errors.length > 0) {
      console.log('❌ Errors encountered:', this.errors);
    }

    return {
      success: true,
      successCount: this.successCount,
      errorCount: this.errorCount,
      totalCount: this.totalCount,
      errors: this.errors
    };
  }

  /**
   * Process a single form field
   */
  async processField(fieldData) {
    const { fieldName, selector, selectorType, value } = fieldData;
    
    // Find the element
    const element = await this.findElement(selector, selectorType);
    if (!element) {
      throw new Error(`Element not found with selector: ${selector}`);
    }

    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await this.sleep(100);

    // Perform the action based on value type
    await this.performAction(element, value, fieldName);
  }

  /**
   * Find element using CSS selector or XPath
   */
  async findElement(selector, selectorType) {
    let element = null;
    
    try {
      if (selectorType === 'css') {
        // Try to find in main document first
        element = document.querySelector(selector);
        
        // If not found, search in iframes
        if (!element) {
          element = await this.findInIframes(selector, 'css');
        }
      } else if (selectorType === 'xpath') {
        // Try to find in main document first
        const result = document.evaluate(
          selector,
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        element = result.singleNodeValue;
        
        // If not found, search in iframes
        if (!element) {
          element = await this.findInIframes(selector, 'xpath');
        }
      } else {
        throw new Error(`Unsupported selector type: ${selectorType}`);
      }
    } catch (error) {
      throw new Error(`Selector error: ${error.message}`);
    }

    return element;
  }

  /**
   * Search for element in iframes
   */
  async findInIframes(selector, selectorType) {
    const iframes = document.querySelectorAll('iframe');
    
    for (const iframe of iframes) {
      try {
        // Skip iframes that can't be accessed due to CORS
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (!iframeDoc) continue;

        let element = null;
        
        if (selectorType === 'css') {
          element = iframeDoc.querySelector(selector);
        } else if (selectorType === 'xpath') {
          const result = iframeDoc.evaluate(
            selector,
            iframeDoc,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
          );
          element = result.singleNodeValue;
        }
        
        if (element) {
          console.log(`🔍 Found element in iframe:`, iframe.src || iframe.id || 'unnamed iframe');
          return element;
        }
      } catch (error) {
        // Skip iframes that can't be accessed
        console.log('⚠️ Could not access iframe:', error.message);
      }
    }
    
    return null;
  }

  /**
   * Perform action on element based on value
   */
  async performAction(element, value, fieldName) {
    const upperValue = value.toUpperCase();
    
    if (upperValue === 'CLICK') {
      // Click action
      await this.clickElement(element);
      console.log(`🖱️ Clicked: ${fieldName}`);
      
    } else if (upperValue === 'CHECK') {
      // Check checkbox or radio button
      if (element.type === 'checkbox' || element.type === 'radio') {
        if (!element.checked) {
          await this.clickElement(element);
          console.log(`☑️ Checked: ${fieldName}`);
        }
      } else {
        throw new Error('CHECK action can only be used on checkbox or radio elements');
      }
      
    } else {
      // Set value
      await this.setValue(element, value);
      console.log(`📝 Set value "${value}" for: ${fieldName}`);
    }
  }

  /**
   * Click an element with proper event handling
   */
  async clickElement(element) {
    // Focus the element first
    element.focus();
    
    // Dispatch mouse events
    const mouseEvents = ['mousedown', 'mouseup', 'click'];
    for (const eventType of mouseEvents) {
      const event = new MouseEvent(eventType, {
        bubbles: true,
        cancelable: true,
        view: window
      });
      element.dispatchEvent(event);
    }
    
    await this.sleep(100);
  }

  /**
   * Set value on an element with proper event handling
   */
  async setValue(element, value) {
    // Focus the element
    element.focus();
    
    // Handle different element types
    if (element.tagName === 'SELECT') {
      // Handle select elements
      element.value = value;
      this.dispatchChangeEvents(element);
    } else if (element.type === 'file') {
      // Skip file inputs as they can't be programmatically set for security reasons
      throw new Error('File input fields cannot be filled programmatically');
    } else {
      // Handle input and textarea elements
      
      // Clear existing value
      element.value = '';
      
      // Set new value
      element.value = value;
      
      // Dispatch events to trigger any JavaScript listeners
      this.dispatchInputEvents(element);
    }
    
    await this.sleep(50);
  }

  /**
   * Dispatch input events for text inputs
   */
  dispatchInputEvents(element) {
    const events = [
      new Event('input', { bubbles: true }),
      new Event('change', { bubbles: true }),
      new KeyboardEvent('keyup', { bubbles: true })
    ];
    
    events.forEach(event => element.dispatchEvent(event));
  }

  /**
   * Dispatch change events for select elements
   */
  dispatchChangeEvents(element) {
    const events = [
      new Event('change', { bubbles: true }),
      new Event('input', { bubbles: true })
    ];
    
    events.forEach(event => element.dispatchEvent(event));
  }

  /**
   * Sleep function for delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global form filler instance
const formFiller = new FormFiller();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'fillForm') {
    console.log('📨 Received form fill request');
    
    formFiller.fillForm(request.data)
      .then(result => {
        console.log('✅ Form fill completed, sending response');
        sendResponse(result);
      })
      .catch(error => {
        console.error('❌ Form fill failed:', error);
        sendResponse({
          success: false,
          error: error.message
        });
      });
    
    // Return true to indicate we'll send a response asynchronously
    return true;
  }
});

console.log('🔧 Sheet-to-Form Automator content script loaded');