# 🧪 QUICK TEST - WORKING EXAMPLE

## 1. Create Test Google Sheet

Copy this EXACT format into a new Google Sheet:

| FieldName    | Selector     | SelectorType | Value              | Trigger |
|-------------|--------------|--------------|-------------------|---------|
| Email Field | email        | id           | test@example.com  | FAST    |
| Name Field  | firstName    | name         | John Doe          | NORMAL  |
| Message     | message      | auto         | Hello World!      | SLOW    |
| Submit      | Submit       | text         | CLICK             | NORMAL  |

## 2. Make Sheet Public
1. Click "Share" in Google Sheets
2. Change to "Anyone with the link"
3. Set permission to "Viewer"
4. Copy the URL

## 3. Configure Extension
1. Click extension icon
2. Click "Settings"
3. Paste your sheet URL
4. Click "Test Connection" (should show success)
5. Click "Save Settings"

## 4. Test on Sample Form
Go to this test form: https://httpbin.org/forms/post

Then:
1. Click extension icon
2. Click "Fill This Form"
3. Watch it fill automatically!

## 5. Debug Console
Press F12 to open console and see detailed logs:
- 🚀 Content script loading
- 📡 Message passing
- 🔍 Element finding
- 📝 Value setting
- ✅ Success confirmations

## Common Test Sites:
- https://httpbin.org/forms/post
- https://www.w3schools.com/html/tryit.asp?filename=tryhtml_form_submit
- Any contact form on websites

## Fixed Issues:
✅ Element finding now works with all selector types
✅ Value setting works on modern websites
✅ Error handling shows specific issues
✅ Retry logic for better reliability
✅ Console logging for debugging
✅ Connection testing before form filling