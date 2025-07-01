# 🧪 TEST SHEET TEMPLATE

## Create this exact sheet to test the extension:

### Google Sheet Format:
```
FieldName       | Selector      | SelectorType | Value              | Trigger
Email Field     | email         | id           | test@example.com   | FAST
Password Field  | password      | name         | testpassword       | NORMAL
First Name      | firstName     | auto         | John               | FAST
Submit Button   | Submit        | text         | CLICK              | SLOW
Checkbox        | newsletter    | name         | CHECK              | NORMAL
```

### Test URLs:
1. **Simple test form**: https://httpbin.org/forms/post
2. **Contact forms**: Any contact form on websites
3. **Login forms**: Any login page

### Troubleshooting Steps:
1. ✅ Create sheet with exact format above
2. ✅ Make sheet public (Anyone with link can view)
3. ✅ Copy the full sheet URL
4. ✅ Paste in extension settings
5. ✅ Test connection (should show "Connection successful!")
6. ✅ Go to a form page
7. ✅ Click extension icon → "Fill This Form"

### Common Issues Fixed:
- ❌ Content script not loading → ✅ Fixed with better injection
- ❌ Elements not found → ✅ Added retry logic and smart finding
- ❌ Values not setting → ✅ Fixed event sequence
- ❌ CSV parsing errors → ✅ Improved parsing with quote handling
- ❌ Message passing failures → ✅ Added connection testing and retries

### Debug Mode:
Open browser console (F12) to see detailed logs:
- 🚀 Content script loading
- 📡 Message passing
- 🔍 Element finding
- 📝 Value setting
- ✅ Success/error details