/**
 * FINAL WORKING Sheet-to-Form Automator Content Script
 * NO CONFLICTS - COMPLETELY FUNCTIONAL
 */

// Prevent multiple script loading
if (window.sheetFormAutomatorLoaded) {
  console.log('⚠️ Content script already loaded, skipping...');
} else {
  window.sheetFormAutomatorLoaded = true;
  
  let isProcessing = false;
  console.log('🚀 Content script loaded on:', window.location.href);

  /**
   * Main form filling function - BULLETPROOF VERSION
   */
  async function fillForm(formData) {
    console.log('📝 Starting form fill with data:', formData);
    
    if (isProcessing) {
      throw new Error('Form filling already in progress');
    }
    
    isProcessing = true;
    
    const results = {
      success: true,
      successCount: 0,
      errorCount: 0,
      totalCount: formData.length,
      errors: []
    };

    try {
      for (let i = 0; i < formData.length; i++) {
        const field = formData[i];
        console.log(`🔍 Processing field ${i + 1}/${formData.length}:`, field);
        
        try {
          // Validate field data first
          if (!isValidField(field)) {
            console.log(`⏭️ Skipping invalid field: ${JSON.stringify(field)}`);
            continue;
          }

          // Skip if disabled
          if (shouldSkipField(field)) {
            console.log(`⏭️ Skipping field: ${field.fieldName}`);
            continue;
          }

          // Find element with retry logic
          const element = await findElementWithRetry(field.selector, field.selectorType);
          
          if (!element) {
            throw new Error(`Element not found: ${field.selector} (${field.selectorType})`);
          }

          console.log('✅ Found element:', element);

          // Ensure element is visible and focusable
          await ensureElementReady(element);

          // Highlight element for visual feedback
          highlightElement(element);

          // Fill the field with proper error handling
          await fillFieldSafely(element, field.value, field.trigger);
          
          results.successCount++;
          console.log(`✅ Successfully filled: ${field.fieldName}`);

          // Intelligent delay between fields
          const delay = getDelay(field.trigger);
          console.log(`⏰ Waiting ${delay}ms...`);
          await sleep(delay);

        } catch (error) {
          console.error(`❌ Error with field ${field.fieldName}:`, error);
          results.errorCount++;
          results.errors.push({
            fieldName: field.fieldName,
            selector: field.selector,
            selectorType: field.selectorType,
            error: error.message
          });
          // Continue with other fields even if one fails
          continue;
        }
      }

      console.log('🎉 Form filling completed:', results);
      return results;

    } finally {
      isProcessing = false;
    }
  }

  /**
   * Validate field data
   */
  function isValidField(field) {
    if (!field || typeof field !== 'object') {
      console.warn('Field is not an object:', field);
      return false;
    }

    if (!field.selector || field.selector.trim() === '') {
      console.warn('Field missing selector:', field);
      return false;
    }

    if (!field.selectorType || field.selectorType.trim() === '') {
      console.warn('Field missing selectorType:', field);
      return false;
    }

    // Check for obviously invalid selectors
    const invalidPatterns = [
      /^\d+\.\d+\s*(KB|MB|GB)$/i,  // File sizes like "84.73 KB"
      /^My Drive$/i,               // Google Drive folder names
      /^Folder$/i,                 // Generic folder names
      /^File$/i                    // Generic file names
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(field.selector)) {
        console.warn('Invalid selector pattern detected:', field.selector);
        return false;
      }
    }

    return true;
  }

  /**
   * Check if field should be skipped
   */
  function shouldSkipField(field) {
    const trigger = (field.trigger || '').toString().toUpperCase().trim();
    return ['OFF', 'SKIP', 'DISABLED', 'NO', 'FALSE'].includes(trigger);
  }

  /**
   * Get delay based on trigger with proper defaults
   */
  function getDelay(trigger = '') {
    const t = trigger.toString().toUpperCase().trim();
    
    switch (t) {
      case 'NINJA': return randomDelay(800, 3500);
      case 'FAST': return randomDelay(100, 300);
      case 'NORMAL': return randomDelay(300, 800);
      case 'SLOW': return randomDelay(800, 1500);
      case 'HUMAN': return randomDelay(1000, 2000);
      case 'STEALTH': return randomDelay(1500, 3000);
      default:
        if (t.startsWith('DELAY:')) {
          const ms = parseInt(t.split(':')[1]) || 500;
          return Math.max(50, ms); // Minimum 50ms
        }
        return randomDelay(200, 600);
    }
  }

  /**
   * Find element with retry logic for better reliability
   */
  async function findElementWithRetry(selector, selectorType, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`🔍 Finding element attempt ${attempt}/${maxRetries}: "${selector}" using "${selectorType}"`);
      
      const element = await findElement(selector, selectorType);
      if (element) {
        return element;
      }
      
      if (attempt < maxRetries) {
        console.log(`⏳ Waiting before retry...`);
        await sleep(500); // Wait before retry
      }
    }
    
    return null;
  }

  /**
   * Find element by selector and type - BULLETPROOF VERSION
   */
  async function findElement(selector, selectorType) {
    const type = (selectorType || 'auto').toLowerCase().trim();
    let element = null;

    console.log(`🔍 Finding element: "${selector}" using type: "${type}"`);

    try {
      switch (type) {
        case 'id':
          const cleanId = selector.replace(/^#/, '');
          element = document.getElementById(cleanId);
          if (!element) element = document.querySelector(`#${cleanId}`);
          break;

        case 'name':
          element = document.querySelector(`[name="${selector}"]`);
          if (!element) element = document.getElementsByName(selector)[0];
          break;

        case 'class':
          const cleanClass = selector.replace(/^\./, '');
          element = document.querySelector(`.${cleanClass}`);
          if (!element) element = document.getElementsByClassName(cleanClass)[0];
          break;

        case 'css':
        case 'selector':
          element = document.querySelector(selector);
          break;

        case 'text':
          element = findByText(selector);
          break;

        case 'placeholder':
          element = document.querySelector(`[placeholder*="${selector}"]`);
          if (!element) element = document.querySelector(`[placeholder="${selector}"]`);
          break;

        case 'label':
          element = findByLabel(selector);
          break;

        case 'xpath':
          try {
            const result = document.evaluate(
              selector, 
              document, 
              null, 
              XPathResult.FIRST_ORDERED_NODE_TYPE, 
              null
            );
            element = result.singleNodeValue;
          } catch (e) {
            console.warn('XPath evaluation failed:', e);
          }
          break;

        case 'auto':
        case 'smart':
          element = findElementSmart(selector);
          break;

        default:
          console.log(`Trying CSS selector for unknown type: ${type}`);
          try {
            element = document.querySelector(selector);
          } catch (e) {
            console.warn(`CSS selector failed for "${selector}":`, e.message);
          }
      }

      if (element) {
        console.log(`✅ Found element using ${type}:`, element);
      } else {
        console.log(`❌ No element found using ${type} selector: ${selector}`);
      }

    } catch (error) {
      console.error(`Error finding element with ${type}:`, error);
    }

    return element;
  }

  /**
   * Find element by text content - IMPROVED
   */
  function findByText(text) {
    console.log(`🔍 Searching for text: "${text}"`);
    
    // Try buttons first (most common for text selectors)
    const buttons = document.querySelectorAll('button, input[type="submit"], input[type="button"], a');
    for (const btn of buttons) {
      if (btn.textContent && btn.textContent.trim() === text) {
        console.log('✅ Found button with exact text:', btn);
        return btn;
      }
    }

    // Try partial match on buttons
    for (const btn of buttons) {
      if (btn.textContent && btn.textContent.includes(text)) {
        console.log('✅ Found button with partial text:', btn);
        return btn;
      }
    }

    // Try all elements with exact match
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      if (el.textContent && el.textContent.trim() === text) {
        // Skip if element has children with text (avoid parent elements)
        const hasTextChildren = Array.from(el.children).some(child => 
          child.textContent.trim()
        );
        if (!hasTextChildren) {
          console.log('✅ Found element with exact text:', el);
          return el;
        }
      }
    }

    // Try partial match
    for (const el of allElements) {
      if (el.textContent && el.textContent.includes(text)) {
        const hasTextChildren = Array.from(el.children).some(child => 
          child.textContent.trim()
        );
        if (!hasTextChildren) {
          console.log('✅ Found element with partial text:', el);
          return el;
        }
      }
    }

    console.log(`❌ No element found with text: "${text}"`);
    return null;
  }

  /**
   * Find element by label - IMPROVED
   */
  function findByLabel(labelText) {
    console.log(`🔍 Searching for label: "${labelText}"`);
    
    const labels = document.querySelectorAll('label');
    
    for (const label of labels) {
      if (label.textContent.toLowerCase().includes(labelText.toLowerCase())) {
        // Try for attribute first
        const forId = label.getAttribute('for');
        if (forId) {
          const target = document.getElementById(forId);
          if (target) {
            console.log('✅ Found element via label for attribute:', target);
            return target;
          }
        }

        // Try nested input
        const nested = label.querySelector('input, select, textarea');
        if (nested) {
          console.log('✅ Found nested input in label:', nested);
          return nested;
        }

        // Try next sibling
        const sibling = label.nextElementSibling;
        if (sibling && ['INPUT', 'SELECT', 'TEXTAREA'].includes(sibling.tagName)) {
          console.log('✅ Found sibling input after label:', sibling);
          return sibling;
        }
      }
    }

    console.log(`❌ No element found for label: "${labelText}"`);
    return null;
  }

  /**
   * Smart element finder - IMPROVED WITH MORE STRATEGIES
   */
  function findElementSmart(query) {
    console.log(`🔍 Smart search for: "${query}"`);
    
    const strategies = [
      // Direct matches
      () => document.getElementById(query),
      () => document.querySelector(`[name="${query}"]`),
      () => document.querySelector(`#${query}`),
      () => document.querySelector(`.${query}`),

      // Attribute searches
      () => document.querySelector(`[placeholder="${query}"]`),
      () => document.querySelector(`[placeholder*="${query}"]`),
      () => document.querySelector(`[value="${query}"]`),
      () => document.querySelector(`[title="${query}"]`),

      // Text-based searches
      () => findByText(query),
      () => findByLabel(query),

      // Partial matches
      () => document.querySelector(`[class*="${query}"]`),
      () => document.querySelector(`[id*="${query}"]`),
      () => document.querySelector(`[name*="${query}"]`)
    ];

    for (const strategy of strategies) {
      try {
        const element = strategy();
        if (element) {
          console.log(`✅ Smart finder found element with query: ${query}`, element);
          return element;
        }
      } catch (e) {
        // Continue to next strategy
      }
    }

    // Last resort: try as CSS selector
    try {
      const element = document.querySelector(query);
      if (element) {
        console.log(`✅ Smart finder found element with CSS selector: ${query}`, element);
        return element;
      }
    } catch (e) {
      // CSS selector failed
    }

    console.log(`❌ Smart finder failed for: "${query}"`);
    return null;
  }

  /**
   * Ensure element is ready for interaction
   */
  async function ensureElementReady(element) {
    // Scroll element into view
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await sleep(200);

    // Make sure element is visible
    if (element.style.display === 'none') {
      element.style.display = '';
    }

    // Remove disabled attribute if present
    if (element.hasAttribute('disabled')) {
      console.log('⚠️ Element is disabled, attempting to enable...');
      element.removeAttribute('disabled');
    }

    // Ensure element is focusable
    if (element.tabIndex < 0) {
      element.tabIndex = 0;
    }
  }

  /**
   * Fill field safely with comprehensive error handling
   */
  async function fillFieldSafely(element, value, trigger) {
    const action = value.toUpperCase().trim();

    try {
      // Handle special actions
      if (action === 'CLICK') {
        return await clickElement(element);
      }
      
      if (action === 'CHECK') {
        return await setCheckbox(element, true);
      }
      
      if (action === 'UNCHECK') {
        return await setCheckbox(element, false);
      }
      
      if (action === 'CLEAR') {
        return await clearField(element);
      }
      
      if (action === 'FOCUS') {
        element.focus();
        return;
      }

      // Regular text input
      await setFieldValue(element, value, trigger);

    } catch (error) {
      console.error('Error in fillFieldSafely:', error);
      throw error;
    }
  }

  /**
   * Click an element with multiple methods
   */
  async function clickElement(element) {
    console.log('🖱️ Clicking element:', element);
    
    try {
      // Method 1: Focus and direct click
      element.focus();
      await sleep(100);
      element.click();
      await sleep(100);

      // Method 2: Mouse events
      element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
      await sleep(50);
      element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
      await sleep(50);
      element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));

      console.log('✅ Element clicked successfully');

    } catch (error) {
      console.error('Error clicking element:', error);
      throw error;
    }
  }

  /**
   * Set checkbox/radio state safely
   */
  async function setCheckbox(element, checked) {
    if (element.type !== 'checkbox' && element.type !== 'radio') {
      throw new Error('CHECK/UNCHECK only works on checkboxes and radio buttons');
    }

    if (element.checked !== checked) {
      await clickElement(element);
      
      // Verify the state changed
      if (element.checked !== checked) {
        console.warn('⚠️ Checkbox state did not change as expected');
      }
    }
  }

  /**
   * Clear field value completely
   */
  async function clearField(element) {
    element.focus();
    await sleep(50);

    // Select all text
    if (element.select) {
      element.select();
    }

    // Clear value
    element.value = '';

    // Fire events
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));

    console.log('✅ Field cleared');
  }

  /**
   * Set field value with comprehensive event handling - BULLETPROOF
   */
  async function setFieldValue(element, value, trigger) {
    console.log(`📝 Setting value "${value}" on:`, element);

    try {
      // Focus the element first
      element.focus();
      await sleep(100);

      // Clear existing value if present
      if (element.value) {
        element.select();
        await sleep(50);
        
        // Send delete key to clear
        element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true }));
        element.value = '';
        await sleep(50);
      }

      // Set the new value
      element.value = value;

      // Trigger input event (for React/Vue)
      element.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
      await sleep(50);

      // Trigger change event (for traditional forms)
      element.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
      await sleep(50);

      // Trigger additional events for modern frameworks
      element.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        inputType: 'insertText',
        data: value
      }));
      await sleep(50);

      // For NINJA mode, add extra events
      if (trigger && trigger.toUpperCase() === 'NINJA') {
        element.dispatchEvent(new Event('keyup', { bubbles: true }));
        element.dispatchEvent(new Event('paste', { bubbles: true }));
        await sleep(100);
      }

      // Blur to trigger validation
      element.blur();
      await sleep(100);

      // Verify value was set
      if (element.value !== value) {
        console.warn(`⚠️ Value verification failed. Expected: "${value}", Got: "${element.value}"`);
      } else {
        console.log(`✅ Value set successfully: "${value}"`);
      }

    } catch (error) {
      console.error('Error setting field value:', error);
      throw error;
    }
  }

  /**
   * Highlight element for visual feedback
   */
  function highlightElement(element) {
    const original = {
      border: element.style.border,
      background: element.style.backgroundColor
    };

    element.style.border = '3px solid #4CAF50';
    element.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';

    setTimeout(() => {
      element.style.border = original.border;
      element.style.backgroundColor = original.background;
    }, 2000);
  }

  /**
   * Sleep utility
   */
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Random delay utility
   */
  function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Message listener with proper error handling
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Received message:', request);

    if (request.action === 'ping') {
      console.log('📡 Ping received - content script is ready');
      sendResponse({ success: true, ready: true });
      return true;
    }

    if (request.action === 'fillForm') {
      console.log('🚀 Fill form request received with data:', request.data);

      // Validate data
      if (!request.data || !Array.isArray(request.data)) {
        sendResponse({
          success: false,
          error: 'Invalid form data received',
          errorCount: 1,
          successCount: 0,
          totalCount: 0
        });
        return true;
      }

      fillForm(request.data)
        .then(result => {
          console.log('✅ Form fill completed with result:', result);
          sendResponse(result);
        })
        .catch(error => {
          console.error('❌ Form fill error:', error);
          sendResponse({
            success: false,
            error: error.message,
            errorCount: 1,
            successCount: 0,
            totalCount: request.data ? request.data.length : 0
          });
        });

      return true; // Keep message channel open for async response
    }

    console.warn('Unknown message action:', request.action);
    sendResponse({ success: false, error: 'Unknown action' });
    return true;
  });

  console.log('✅ Content script fully loaded and ready!');
}