# 🔧 How to Create Icons for Chrome Extension

## Method 1: Use the HTML Generator (EASIEST)

1. Open `create-real-icons.html` in your browser
2. Click "Generate Icons" 
3. Right-click each icon image and "Save image as..."
4. Save them in the `icons/` folder with these exact names:
   - `icon16.png`
   - `icon48.png` 
   - `icon128.png`

## Method 2: Use Online Icon Generator

1. Go to https://www.favicon-generator.org/ 
2. Upload any image (could be a screenshot of a spreadsheet)
3. Download the generated favicon package
4. Rename the files to:
   - `favicon-16x16.png` → `icon16.png`
   - `favicon-32x32.png` → `icon48.png` (resize if needed)
   - `android-chrome-192x192.png` → `icon128.png` (resize if needed)

## Method 3: Use Any Image Editor

Create 3 PNG files with these dimensions:
- 16x16 pixels → `icon16.png`
- 48x48 pixels → `icon48.png`
- 128x128 pixels → `icon128.png`

## ⚠️ IMPORTANT

After creating the icons:

1. Put them in `Sheet-to-Form-Automator/icons/` folder
2. Make sure the file names are EXACTLY:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`
3. The manifest.json is already configured to use these files

## 🧪 Test the Extension

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `Sheet-to-Form-Automator` folder
5. You should see the extension with proper icons!

---

**The HTML method is the easiest - just open the HTML file and save the generated images!**