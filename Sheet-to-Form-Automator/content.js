/**
 * Sheet-to-Form Automator - NINJA MODE Enhanced Content Script
 * Ultimate anti-robot mechanisms with simultaneous actions and chaos mode
 */
class FormFiller {
  constructor() {
    this.successCount = 0;
    this.errorCount = 0;
    this.totalCount = 0;
    this.errors = [];
    this.isReady = true;
    this.mousePosition = { x: 0, y: 0 };
    console.log('🥷 NINJA MODE FormFiller initialized on:', window.location.href);
  }

  /**
   * Main form filling function with NINJA MODE
   */
  async fillForm(formData) {
    console.log('🚀 Starting NINJA MODE form fill process with', formData.length, 'fields');
    
    this.successCount = 0;
    this.errorCount = 0;
    this.totalCount = formData.length;
    this.errors = [];

    // Process each form field
    for (let i = 0; i < formData.length; i++) {
      const fieldData = formData[i];
      console.log(`🥷 NINJA processing field ${i + 1}/${formData.length}:`, fieldData.fieldName);

      try {
        // Check if this field should be processed
        if (this.shouldSkipField(fieldData)) {
          console.log(`⏭️ Skipping field: ${fieldData.fieldName} (disabled or OFF)`);
          continue;
        }

        await this.processField(fieldData);
        this.successCount++;
        console.log(`✅ NINJA successfully processed: ${fieldData.fieldName}`);
        
        // Add NINJA-level random delay
        const delay = this.getNinjaDelay(fieldData);
        await this.sleep(delay);
        
      } catch (error) {
        this.errorCount++;
        const errorInfo = {
          fieldName: fieldData.fieldName,
          selector: fieldData.selector,
          selectorType: fieldData.selectorType,
          error: error.message
        };
        this.errors.push(errorInfo);
        console.error(`❌ NINJA error processing ${fieldData.fieldName}:`, error.message);
      }
    }

    // Log summary
    console.log(`🥷 NINJA MODE completed: ${this.successCount}/${this.totalCount} successful`);
    if (this.errors.length > 0) {
      console.log('❌ NINJA errors encountered:', this.errors);
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
   * Check if field should be skipped based on trigger column
   */
  shouldSkipField(fieldData) {
    const trigger = (fieldData.trigger || '').toString().toUpperCase().trim();
    
    // If no trigger column, always process (backward compatibility)
    if (!fieldData.trigger) return false;
    
    // Skip if explicitly disabled
    const skipValues = ['OFF', 'NO', 'FALSE', '0', 'SKIP', 'DISABLED', 'PAUSE'];
    return skipValues.includes(trigger);
  }

  /**
   * Get NINJA-level random delay based on anti-robot settings
   */
  getNinjaDelay(fieldData) {
    const trigger = (fieldData.trigger || '').toString().toUpperCase().trim();
    
    // NINJA MODE - Always random, always changing!
    if (trigger === 'NINJA') {
      return this.randomDelay(800, 3500); // Ultra-random 0.8-3.5 seconds
    }
    
    // Enhanced delays with more randomness
    const baseDelays = {
      'FAST': this.randomDelay(50, 200),
      'NORMAL': this.randomDelay(200, 500),
      'SLOW': this.randomDelay(600, 1200),
      'HUMAN': this.randomDelay(800, 1800),
      'STEALTH': this.randomDelay(1500, 2800),
      'ULTRA': this.randomDelay(2500, 4000)
    };

    // Check for custom delay (e.g., "DELAY:500")
    if (trigger.startsWith('DELAY:')) {
      const customDelay = parseInt(trigger.split(':')[1]);
      const baseDelay = isNaN(customDelay) ? 300 : Math.max(50, customDelay);
      // Add ±30% randomness to custom delays
      const variance = baseDelay * 0.3;
      return this.randomDelay(baseDelay - variance, baseDelay + variance);
    }

    return baseDelays[trigger] || this.randomDelay(150, 400); // Default random delay
  }

  /**
   * Process a single form field with NINJA MODE logic
   */
  async processField(fieldData) {
    const { fieldName, selector, selectorType, value } = fieldData;

    // Find the element
    const element = await this.findElement(selector, selectorType);
    if (!element) {
      throw new Error(`Element not found with selector: ${selector} (type: ${selectorType})`);
    }

    // NINJA MODE preparation
    const isNinjaMode = (fieldData.trigger || '').toString().toUpperCase().trim() === 'NINJA';

    // Scroll element into view with chaos
    if (isNinjaMode) {
      await this.ninjaScrollToElement(element);
    } else {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await this.sleep(this.randomDelay(200, 400));
    }

    // Highlight element briefly for visual feedback
    this.highlightElement(element);

    // Perform the action with NINJA or enhanced logic
    if (isNinjaMode) {
      await this.performNinjaAction(element, value, fieldName, fieldData);
    } else {
      await this.performEnhancedAction(element, value, fieldName, fieldData);
    }
  }

  /**
   * NINJA MODE: Chaotic scrolling with multiple attempts
   */
  async ninjaScrollToElement(element) {
    // Multiple scroll attempts with different behaviors
    const scrollMethods = [
      () => element.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      () => element.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      () => element.scrollIntoView({ behavior: 'smooth', block: 'end' }),
      () => element.scrollIntoView({ behavior: 'auto', block: 'nearest' })
    ];

    // Pick random scroll method
    const randomMethod = scrollMethods[Math.floor(Math.random() * scrollMethods.length)];
    randomMethod();
    
    await this.sleep(this.randomDelay(100, 300));
    
    // Sometimes do a second scroll for chaos
    if (Math.random() > 0.5) {
      const secondMethod = scrollMethods[Math.floor(Math.random() * scrollMethods.length)];
      secondMethod();
      await this.sleep(this.randomDelay(50, 150));
    }
  }

  /**
   * NINJA MODE: Ultimate simultaneous action performer
   */
  async performNinjaAction(element, value, fieldName, fieldData) {
    const upperValue = value.toUpperCase();

    console.log(`🥷 NINJA MODE activated for: ${fieldName}`);

    if (upperValue === 'CLICK') {
      await this.ninjaClickElement(element);
      console.log(`🥷 NINJA clicked: ${fieldName}`);
    } else if (upperValue === 'CHECK') {
      if (element.type === 'checkbox' || element.type === 'radio') {
        if (!element.checked) {
          await this.ninjaClickElement(element);
          console.log(`🥷 NINJA checked: ${fieldName}`);
        }
      } else {
        throw new Error('CHECK action can only be used on checkbox or radio elements');
      }
    } else if (upperValue === 'UNCHECK') {
      if (element.type === 'checkbox' || element.type === 'radio') {
        if (element.checked) {
          await this.ninjaClickElement(element);
          console.log(`🥷 NINJA unchecked: ${fieldName}`);
        }
      } else {
        throw new Error('UNCHECK action can only be used on checkbox or radio elements');
      }
    } else if (upperValue === 'CLEAR') {
      await this.ninjaClearElement(element);
      console.log(`🥷 NINJA cleared: ${fieldName}`);
    } else if (upperValue === 'FOCUS') {
      await this.ninjaFocusElement(element);
      console.log(`🥷 NINJA focused: ${fieldName}`);
    } else {
      // NINJA value setting - THE ULTIMATE MODE!
      await this.ninjaSetValue(element, value);
      console.log(`🥷 NINJA set value "${value}" for: ${fieldName}`);
    }
  }

  /**
   * NINJA MODE: Ultimate simultaneous value setting - CHAOS MODE!
   */
  async ninjaSetValue(element, value) {
    console.log('🥷 ENTERING NINJA VALUE SET MODE - MAXIMUM CHAOS!');

    // Phase 1: Simultaneous positioning and preparation
    await this.ninjaSimultaneousPreparation(element);

    // Phase 2: CHAOS VALUE SETTING - Everything at once!
    await this.ninjaChaosValueSetting(element, value);

    // Phase 3: Random post-processing chaos
    await this.ninjaPostProcessingChaos(element);

    console.log('🥷 NINJA VALUE SET COMPLETE - CHAOS SUCCESSFUL!');
  }

  /**
   * NINJA Phase 1: Simultaneous preparation with multiple actions
   */
  async ninjaSimultaneousPreparation(element) {
    // Get element position for mouse simulation
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create multiple promises to run simultaneously
    const simultaneousActions = [
      // Mouse movement simulation
      this.ninjaMouseMovement(centerX, centerY),
      
      // Focus with random delay
      this.ninjaDelayedFocus(element),
      
      // Hover simulation
      this.ninjaHoverSimulation(element),
      
      // Random mouse events
      this.ninjaRandomMouseEvents(element)
    ];

    // Execute all actions simultaneously
    await Promise.all(simultaneousActions);
    
    // Random micro-delay
    await this.sleep(this.randomDelay(10, 50));
  }

  /**
   * NINJA Phase 2: CHAOS VALUE SETTING - Everything happens at once!
   */
  async ninjaChaosValueSetting(element, value) {
    // Clear existing value with chaos
    if (element.value) {
      // Multiple selection methods simultaneously
      const clearActions = [
        () => element.select(),
        () => element.setSelectionRange(0, element.value.length),
        () => { element.focus(); element.select(); }
      ];
      
      // Random clear method
      const randomClear = clearActions[Math.floor(Math.random() * clearActions.length)];
      randomClear();
      
      await this.sleep(this.randomDelay(5, 25));
    }

    // Set value with multiple simultaneous events
    element.value = value;

    // CHAOS EVENT STORM - Fire multiple events simultaneously!
    const chaosEvents = [
      // Input events
      () => element.dispatchEvent(new Event('input', { bubbles: true })),
      () => element.dispatchEvent(new InputEvent('input', { 
        bubbles: true, 
        inputType: 'insertText', 
        data: value 
      })),
      
      // Change events
      () => element.dispatchEvent(new Event('change', { bubbles: true })),
      
      // Keyboard events
      () => element.dispatchEvent(new KeyboardEvent('keydown', { 
        bubbles: true, 
        key: 'Enter',
        code: 'Enter'
      })),
      () => element.dispatchEvent(new KeyboardEvent('keyup', { 
        bubbles: true, 
        key: value.charAt(value.length - 1) || 'a'
      })),
      
      // Focus events
      () => element.dispatchEvent(new FocusEvent('focus', { bubbles: true })),
      
      // Additional chaos events
      () => element.dispatchEvent(new Event('paste', { bubbles: true })),
      () => element.dispatchEvent(new Event('textInput', { bubbles: true }))
    ];

    // Fire events in random order with micro-delays
    for (let i = 0; i < chaosEvents.length; i++) {
      try {
        chaosEvents[i]();
        // Random micro-delay between events
        if (Math.random() > 0.3) {
          await this.sleep(this.randomDelay(1, 15));
        }
      } catch (e) {
        // Ignore errors in chaos mode
      }
    }
  }

  /**
   * NINJA Phase 3: Post-processing chaos
   */
  async ninjaPostProcessingChaos(element) {
    // Random additional actions
    const postActions = [
      // Blur with random timing
      () => {
        setTimeout(() => {
          element.dispatchEvent(new Event('blur', { bubbles: true }));
        }, this.randomDelay(10, 100));
      },
      
      // Additional focus/blur cycle
      () => {
        element.focus();
        setTimeout(() => element.blur(), this.randomDelay(20, 80));
      },
      
      // Random click near the element
      () => this.ninjaRandomClickNear(element),
      
      // Random validation trigger
      () => element.dispatchEvent(new Event('invalid', { bubbles: true }))
    ];

    // Execute 1-3 random post actions
    const numActions = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numActions; i++) {
      const randomAction = postActions[Math.floor(Math.random() * postActions.length)];
      try {
        await randomAction();
      } catch (e) {
        // Ignore errors in chaos mode
      }
    }

    // Final chaos delay
    await this.sleep(this.randomDelay(50, 200));
  }

  /**
   * NINJA mouse movement simulation
   */
  async ninjaMouseMovement(targetX, targetY) {
    // Simulate realistic mouse movement path
    const steps = this.randomDelay(3, 8);
    const currentX = this.mousePosition.x || window.innerWidth / 2;
    const currentY = this.mousePosition.y || window.innerHeight / 2;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      // Add curve to movement for realism
      const curve = Math.sin(progress * Math.PI) * this.randomDelay(-10, 10);
      const x = currentX + (targetX - currentX) * progress + curve;
      const y = currentY + (targetY - currentY) * progress + curve;
      
      this.mousePosition = { x, y };
      
      // Random micro-delay
      if (i < steps) {
        await this.sleep(this.randomDelay(5, 25));
      }
    }
  }

  /**
   * NINJA delayed focus with randomness
   */
  async ninjaDelayedFocus(element) {
    await this.sleep(this.randomDelay(5, 30));
    element.focus();
    
    // Sometimes double focus for chaos
    if (Math.random() > 0.7) {
      await this.sleep(this.randomDelay(10, 40));
      element.focus();
    }
  }

  /**
   * NINJA hover simulation
   */
  async ninjaHoverSimulation(element) {
    const hoverEvents = [
      new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }),
      new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window })
    ];
    
    for (const event of hoverEvents) {
      element.dispatchEvent(event);
      await this.sleep(this.randomDelay(2, 15));
    }
  }

  /**
   * NINJA random mouse events
   */
  async ninjaRandomMouseEvents(element) {
    const randomEvents = [
      () => element.dispatchEvent(new MouseEvent('mousemove', { 
        bubbles: true, 
        clientX: this.randomDelay(0, window.innerWidth),
        clientY: this.randomDelay(0, window.innerHeight)
      })),
      () => element.dispatchEvent(new MouseEvent('mousedown', { 
        bubbles: true, 
        button: 0 
      })),
      () => element.dispatchEvent(new MouseEvent('mouseup', { 
        bubbles: true, 
        button: 0 
      }))
    ];
    
    // Fire 1-2 random events
    const numEvents = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numEvents; i++) {
      const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      randomEvent();
      await this.sleep(this.randomDelay(5, 20));
    }
  }

  /**
   * NINJA click with ultimate chaos
   */
  async ninjaClickElement(element) {
    console.log('🥷 NINJA CLICK MODE - MAXIMUM CHAOS!');
    
    // Simultaneous preparation
    await this.ninjaSimultaneousPreparation(element);
    
    // CHAOS CLICK STORM
    const clickEvents = [
      new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, button: 0 }),
      new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, button: 0 }),
      new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }),
      new PointerEvent('pointerdown', { bubbles: true, pointerId: 1 }),
      new PointerEvent('pointerup', { bubbles: true, pointerId: 1 }),
      new PointerEvent('click', { bubbles: true, pointerId: 1 })
    ];
    
    // Fire events with random micro-delays
    for (const event of clickEvents) {
      try {
        element.dispatchEvent(event);
        await this.sleep(this.randomDelay(1, 10));
      } catch (e) {
        // Ignore errors in ninja mode
      }
    }
    
    await this.sleep(this.randomDelay(30, 150));
  }

  /**
   * NINJA clear with chaos
   */
  async ninjaClearElement(element) {
    await this.ninjaSimultaneousPreparation(element);
    
    // Multiple clear methods
    element.select();
    element.value = '';
    
    // Chaos events
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete' }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  /**
   * NINJA focus with chaos
   */
  async ninjaFocusElement(element) {
    await this.ninjaSimultaneousPreparation(element);
    
    // Multiple focus attempts
    element.focus();
    element.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
    element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    
    await this.sleep(this.randomDelay(20, 100));
  }

  /**
   * NINJA random click near element
   */
  async ninjaRandomClickNear(element) {
    const rect = element.getBoundingClientRect();
    const randomX = rect.left + this.randomDelay(-20, rect.width + 20);
    const randomY = rect.top + this.randomDelay(-20, rect.height + 20);
    
    // Create click event at random position near element
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      clientX: randomX,
      clientY: randomY
    });
    
    document.dispatchEvent(clickEvent);
  }

  /**
   * Enhanced action performer with modern JS website support (non-NINJA)
   */
  async performEnhancedAction(element, value, fieldName, fieldData) {
    const upperValue = value.toUpperCase();
    const trigger = (fieldData.trigger || '').toString().toUpperCase().trim();

    if (upperValue === 'CLICK') {
      await this.enhancedClickElement(element, trigger);
      console.log(`🖱️ Enhanced clicked: ${fieldName}`);
    } else if (upperValue === 'CHECK') {
      if (element.type === 'checkbox' || element.type === 'radio') {
        if (!element.checked) {
          await this.enhancedClickElement(element, trigger);
          console.log(`☑️ Enhanced checked: ${fieldName}`);
        }
      } else {
        throw new Error('CHECK action can only be used on checkbox or radio elements');
      }
    } else if (upperValue === 'UNCHECK') {
      if (element.type === 'checkbox' || element.type === 'radio') {
        if (element.checked) {
          await this.enhancedClickElement(element, trigger);
          console.log(`☐ Enhanced unchecked: ${fieldName}`);
        }
      } else {
        throw new Error('UNCHECK action can only be used on checkbox or radio elements');
      }
    } else if (upperValue === 'CLEAR') {
      await this.enhancedClearElement(element, trigger);
      console.log(`🗑️ Enhanced cleared: ${fieldName}`);
    } else if (upperValue === 'FOCUS') {
      element.focus();
      console.log(`🎯 Focused: ${fieldName}`);
    } else {
      // Enhanced value setting for modern JS websites
      await this.enhancedSetValue(element, value, trigger);
      console.log(`📝 Enhanced set value "${value}" for: ${fieldName}`);
    }
  }

  /**
   * Enhanced click with human-like behavior (non-NINJA)
   */
  async enhancedClickElement(element, trigger) {
    const isStealthMode = ['STEALTH', 'ULTRA', 'HUMAN'].includes(trigger);
    
    // Scroll into view if needed
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await this.sleep(isStealthMode ? this.randomDelay(200, 400) : this.randomDelay(80, 150));

    // Focus first
    element.focus();
    await this.sleep(isStealthMode ? this.randomDelay(100, 200) : this.randomDelay(30, 80));

    // Mouse events sequence
    const events = [
      new MouseEvent('mouseenter', { bubbles: true, cancelable: true, view: window }),
      new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }),
      new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }),
      new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }),
      new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
    ];

    for (const event of events) {
      element.dispatchEvent(event);
      if (isStealthMode) await this.sleep(this.randomDelay(10, 60));
    }

    await this.sleep(isStealthMode ? this.randomDelay(150, 300) : this.randomDelay(50, 120));
  }

  /**
   * Enhanced value setting for modern JS websites (non-NINJA)
   */
  async enhancedSetValue(element, value, trigger) {
    const isStealthMode = ['STEALTH', 'ULTRA', 'HUMAN'].includes(trigger);
    
    // Step 1: Focus on the element to simulate user clicking into it
    element.focus();
    await this.sleep(isStealthMode ? this.randomDelay(80, 200) : this.randomDelay(30, 80));

    // Step 2: Clear existing value first if needed
    if (element.value) {
      element.select(); // Select all existing text
      await this.sleep(isStealthMode ? this.randomDelay(30, 80) : this.randomDelay(10, 30));
    }

    // Step 3: Set the value
    element.value = value;

    // Step 4: Dispatch input event to tell website that text is being entered
    element.dispatchEvent(new Event('input', { bubbles: true }));
    await this.sleep(isStealthMode ? this.randomDelay(40, 120) : this.randomDelay(15, 40));

    // Step 5: Dispatch change event to confirm value has been changed
    element.dispatchEvent(new Event('change', { bubbles: true }));
    await this.sleep(isStealthMode ? this.randomDelay(40, 120) : this.randomDelay(15, 40));

    // Step 6: Additional events for maximum compatibility
    element.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
    element.dispatchEvent(new Event('paste', { bubbles: true }));

    // Step 7: Blur the element to simulate user clicking away (triggers validation)
    element.dispatchEvent(new Event('blur', { bubbles: true }));
    
    // Final delay for stealth mode
    if (isStealthMode) {
      await this.sleep(this.randomDelay(80, 250));
    }
  }

  /**
   * Enhanced clear element (non-NINJA)
   */
  async enhancedClearElement(element, trigger) {
    const isStealthMode = ['STEALTH', 'ULTRA', 'HUMAN'].includes(trigger);
    
    element.focus();
    await this.sleep(isStealthMode ? this.randomDelay(60, 150) : this.randomDelay(20, 60));
    
    // Select all and delete
    element.select();
    await this.sleep(isStealthMode ? this.randomDelay(30, 80) : this.randomDelay(10, 30));
    
    element.value = '';
    
    // Dispatch events
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  // ... [Include all the findElement methods from previous version] ...

  /**
   * Enhanced element finder with multiple selector types
   */
  async findElement(selector, selectorType) {
    const type = selectorType.toLowerCase().trim();
    let element = null;

    console.log(`🔍 Finding element with selector: "${selector}" (type: ${type})`);

    try {
      switch (type) {
        case 'css':
        case 'selector':
          element = await this.findByCss(selector);
          break;
        case 'id':
          element = await this.findById(selector);
          break;
        case 'name':
          element = await this.findByName(selector);
          break;
        case 'class':
        case 'classname':
          element = await this.findByClassName(selector);
          break;
        case 'tag':
        case 'tagname':
          element = await this.findByTagName(selector);
          break;
        case 'text':
        case 'linktext':
          element = await this.findByText(selector);
          break;
        case 'placeholder':
          element = await this.findByPlaceholder(selector);
          break;
        case 'label':
          element = await this.findByLabel(selector);
          break;
        case 'xpath':
          element = await this.findByXPath(selector);
          break;
        case 'auto':
        case 'smart':
          element = await this.findElementSmart(selector);
          break;
        default:
          throw new Error(`Unsupported selector type: ${selectorType}. Use 'auto' for automatic detection.`);
      }
    } catch (error) {
      console.error(`Error with ${type} selector "${selector}":`, error.message);
      throw error;
    }

    if (element) {
      console.log(`✅ Found element:`, element);
    }
    return element;
  }

  async findByCss(selector) { return document.querySelector(selector); }
  async findById(id) { 
    const cleanId = id.replace(/^#/, '');
    return document.getElementById(cleanId);
  }
  async findByName(name) { return document.querySelector(`[name="${name}"]`); }
  async findByClassName(className) {
    const cleanClass = className.replace(/^\./, '');
    return document.querySelector(`.${cleanClass}`);
  }
  async findByTagName(tagName) { return document.querySelector(tagName.toLowerCase()); }
  async findByText(text) {
    const xpath = `//*[normalize-space(text())="${text}"]`;
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
  }
  async findByPlaceholder(placeholder) {
    let element = document.querySelector(`[placeholder="${placeholder}"]`);
    if (!element) {
      element = document.querySelector(`[placeholder*="${placeholder}"]`);
    }
    return element;
  }
  async findByLabel(labelText) {
    const labels = document.querySelectorAll('label');
    for (const label of labels) {
      if (label.textContent.trim().toLowerCase().includes(labelText.toLowerCase())) {
        const forAttr = label.getAttribute('for');
        if (forAttr) {
          return document.getElementById(forAttr);
        }
        const nestedInput = label.querySelector('input, select, textarea');
        if (nestedInput) {
          return nestedInput;
        }
      }
    }
    return document.querySelector(`[aria-label*="${labelText}"]`);
  }
  async findByXPath(xpath) {
    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
  }
  async findElementSmart(query) {
    console.log(`🧠 Smart finding element with query: "${query}"`);
    const strategies = [
      () => this.findById(query),
      () => this.findByName(query),
      () => this.findByClassName(query),
      () => this.findByCss(query),
      () => this.findByText(query),
      () => this.findByPlaceholder(query),
      () => this.findByLabel(query),
      () => document.querySelector(`[id*="${query}"]`),
      () => document.querySelector(`[class*="${query}"]`),
      () => document.querySelector(`[name*="${query}"]`),
      () => document.querySelector(`[placeholder*="${query}"]`),
      () => document.querySelector(`[aria-label*="${query}"]`),
      () => this.findByXPath(`//*[contains(@id, '${query}')]`),
      () => this.findByXPath(`//*[contains(@class, '${query}')]`),
      () => this.findByXPath(`//*[contains(text(), '${query}')]`)
    ];

    for (const strategy of strategies) {
      try {
        const element = await strategy();
        if (element) {
          console.log(`✅ Smart finder found element using strategy`);
          return element;
        }
      } catch (error) {
        continue;
      }
    }
    return null;
  }

  /**
   * Generate random delay for chaos mode
   */
  randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Highlight element for visual feedback
   */
  highlightElement(element) {
    const originalStyle = element.style.cssText;
    element.style.cssText += 'border: 2px solid #4CAF50 !important; background-color: rgba(76, 175, 80, 0.1) !important;';
    
    setTimeout(() => {
      element.style.cssText = originalStyle;
    }, 1000);
  }

  /**
   * Sleep function
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global form filler instance
const formFiller = new FormFiller();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Content script received message:', request.action);

  if (request.action === 'ping') {
    sendResponse({ success: true, ready: formFiller.isReady });
    return;
  }

  if (request.action === 'fillForm') {
    console.log('📨 Received NINJA MODE form fill request');
    formFiller.fillForm(request.data)
      .then(result => {
        console.log('✅ NINJA MODE form fill completed, sending response');
        sendResponse(result);
      })
      .catch(error => {
        console.error('❌ NINJA MODE form fill failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
});

console.log('🥷 NINJA MODE Sheet-to-Form Automator content script loaded and ready');