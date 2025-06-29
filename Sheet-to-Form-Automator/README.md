# Sheet-to-Form Automator Chrome Extension

A powerful Chrome extension that automates form filling using data from Google Sheets.

## 🚀 Features

- **Google Sheets Integration**: Connect directly to your Google Sheets
- **Smart Form Detection**: Automatically finds and fills form fields
- **CSS & XPath Support**: Flexible element targeting
- **Cross-Frame Support**: Works with iframes and embedded forms
- **Real-time Feedback**: Visual progress and error reporting
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
|-----------|----------|--------------|--------|
| Email | #email | css | john@example.com |
| Password | //input[@type='password'] | xpath | mypassword |
| Submit | .submit-btn | css | CLICK |
| Newsletter | #newsletter | css | CHECK |

### Column Descriptions:

- **FieldName**: Descriptive name for logging
- **Selector**: CSS selector or XPath expression
- **SelectorType**: Either "css" or "xpath"
- **Value**: Data to enter, or "CLICK"/"CHECK" for actions

## 🎯 Special Values

- `CLICK`: Clicks buttons, links, or any clickable element
- `CHECK`: Checks checkboxes or radio buttons
- Any other value: Enters text into input fields

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
- Use browser developer tools to verify selectors
- Check that elements are visible and enabled
- Try different selector types (CSS vs XPath)

## 📝 Development

### File Structure
```
Sheet-to-Form-Automator/
├── manifest.json          # Extension configuration
├── popup.html/js/css      # Extension popup interface
├── options.html/js/css    # Settings page
├── content.js            # Form filling logic
├── icons/                # Extension icons
├── sounds/              # Audio feedback files
└── README.md           # This file
```

### Key Components

- **Popup**: Main interface for triggering form fills
- **Options**: Configuration page for Google Sheet URL
- **Content Script**: Injected into web pages to perform form filling
- **Background**: Chrome extension event handling

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
2. Verify your Google Sheet format
3. Test with simple forms first
4. Check browser console for error messages