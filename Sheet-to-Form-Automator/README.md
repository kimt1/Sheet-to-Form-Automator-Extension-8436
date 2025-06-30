# Sheet-to-Form Automator Chrome Extension

A powerful Chrome extension that automates form filling using data from Google Sheets with enhanced selector support.

## 🚀 Features

- **Google Sheets Integration**: Connect directly to your Google Sheets
- **18+ Selector Types**: Multiple ways to find form elements easily
- **Smart Auto-Detection**: Intelligent element finding with fallback strategies
- **Cross-Frame Support**: Works with iframes and embedded forms
- **Enhanced Actions**: Click, check, clear, focus, submit, and more
- **Real-time Feedback**: Visual progress and detailed error reporting
- **Sound Notifications**: Audio feedback for actions

## 📦 Installation

### Method 1: Load as Unpacked Extension
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `Sheet-to-Form-Automator` folder
4. The extension should appear in your extensions list

### Method 2: Generate Icons First
If you see icon loading errors:
1. Open `generate-icons.html` in your browser
2. Download all three icon files (16x16, 48x48, 128x128)
3. Place them in the `icons/` folder
4. Reload the extension in Chrome

## 🔧 Setup

1. **Configure Google Sheet**:
   - Create a Google Sheet with your form data
   - Make the sheet publicly viewable
   - Use the required column format (see below)

2. **Set Sheet URL**:
   - Click the extension icon
   - Click "Settings"
   - Enter your Google Sheet URL
   - Test the connection

3. **Fill Forms**:
   - Navigate to any web form
   - Click the extension icon
   - Click "Fill This Form"

## 📋 Sheet Format

Your Google Sheet must have exactly 4 columns:

| FieldName | Selector | SelectorType | Value |
|-----------|----------|--------------|-------|
| Email | email | id | user@example.com |
| Password | password | name | mypassword |
| Login Button | Sign In | text | CLICK |
| Newsletter | newsletter | auto | CHECK |

### Column Descriptions:
- **FieldName**: Descriptive name for logging
- **Selector**: Value used to find the element
- **SelectorType**: Method to find the element (see supported types below)
- **Value**: Data to enter, or special actions

## 🎯 Supported Selector Types

### Basic Selectors
- **`css`** - CSS selector (e.g., `#email`, `.submit-btn`)
- **`xpath`** - XPath expression (e.g., `//input[@type='email']`)
- **`id`** - Element ID (e.g., `email`, `login-form`)
- **`name`** - Name attribute (e.g., `username`, `password`)
- **`class`** - CSS class name (e.g., `form-input`, `btn-primary`)
- **`tag`** - HTML tag name (e.g., `input`, `button`)

### Text-Based Selectors
- **`text`** - Exact text content (e.g., `Sign In`, `Submit`)
- **`partialtext`** - Partial text match (e.g., `Sign`, `Submit Form`)
- **`placeholder`** - Placeholder text (e.g., `Enter your email`)
- **`label`** - Associated label text (e.g., `Email Address`)

### Attribute Selectors
- **`title`** - Title attribute (e.g., `Click to submit`)
- **`value`** - Value attribute (e.g., `Submit`, `Login`)
- **`type`** - Input type (e.g., `email`, `password`, `submit`)
- **`alt`** - Alt text for images (e.g., `Submit button`)
- **`role`** - ARIA role (e.g., `button`, `textbox`)
- **`data`** - Data attributes (e.g., `data-testid=login-btn`)

### Smart Selectors
- **`auto`** - Tries multiple detection methods automatically
- **`smart`** - Intelligent element detection with fallbacks

## 🎬 Special Actions

Instead of entering text, you can use these special values:

- **`CLICK`** - Click buttons, links, or any clickable element
- **`CHECK`** - Check checkboxes or radio buttons
- **`UNCHECK`** - Uncheck checkboxes or radio buttons
- **`CLEAR`** - Clear field contents
- **`FOCUS`** - Focus on element
- **`SUBMIT`** - Submit the form

## 💡 Pro Tips

1. **Start Simple**: Try `auto` selector type first - it automatically tries multiple methods
2. **Use Browser Tools**: Right-click → Inspect Element to find IDs, classes, and names
3. **Text is Powerful**: Use `text` type for buttons and links with visible text
4. **Data Attributes**: Use `data` type with format like "data-testid=login-btn"
5. **Test Gradually**: Start with one field, then add more as you confirm they work
6. **Partial Matching**: Use `partialtext` when exact text might have extra spaces

## 🛠️ Troubleshooting

### Extension Won't Load
- Check that all icon files exist in the `icons/` folder
- Verify manifest.json is valid
- Check Chrome Developer Console for errors

### Sheet Connection Fails
- Ensure the Google Sheet is publicly viewable
- Verify the URL format is correct
- Check your internet connection

### Form Fields Not Filling
- Try different selector types (start with `auto`)
- Use browser developer tools to inspect elements
- Check that elements are visible and enabled
- Try `smart` selector type for difficult elements

### Common Selector Examples

| Element Type | Selector | SelectorType | Notes |
|--------------|----------|--------------|-------|
| Email input with ID | `email` | `id` | Most reliable |
| Password by name | `password` | `name` | Common pattern |
| Submit button | `Submit` | `text` | Works with button text |
| Checkbox by label | `Remember me` | `label` | Finds by label text |
| Any element | `login-button` | `auto` | Tries multiple methods |
| Data attribute | `data-testid=submit` | `data` | Modern web apps |

## 📝 Development

### File Structure
```
Sheet-to-Form-Automator/
├── manifest.json          # Extension configuration
├── popup.html/js/css      # Extension popup interface
├── options.html/js/css    # Settings page
├── content.js            # Enhanced form filling logic
├── icons/               # Extension icons
├── sounds/             # Audio feedback files
└── README.md          # This file
```

### Key Enhancements
- **18+ selector types** for maximum compatibility
- **Smart auto-detection** with multiple fallback strategies
- **Enhanced error reporting** with detailed selector information
- **Additional actions** like CLEAR, FOCUS, SUBMIT, UNCHECK
- **Cross-frame element detection** for complex pages

## 🔒 Privacy & Security

- No data is stored on external servers
- Google Sheets data is fetched directly by your browser
- No tracking or analytics
- All processing happens locally

## 📄 License

© Jay Gomz Inc. All rights reserved.

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Try the `auto` selector type first
3. Verify your Google Sheet format
4. Test with simple forms first
5. Check browser console for error messages

The enhanced selector support makes finding elements much easier - when in doubt, use `auto` or `smart` selector types!