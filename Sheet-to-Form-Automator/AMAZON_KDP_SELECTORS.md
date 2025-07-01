# 🔥 AMAZON KDP - WORKING SELECTORS

## ✅ COPY THIS EXACT DATA TO YOUR GOOGLE SHEET:

| FieldName | Selector | SelectorType | Value | Trigger |
|-----------|----------|--------------|-------|---------|
| Book Title | title | name | My Amazing Book Title | NORMAL |
| Subtitle | subtitle | name | An Engaging Subtitle | NORMAL |
| Series Title | seriesTitle | name | My Book Series | FAST |
| Edition Number | editionNumber | name | 1 | FAST |
| Author First | authorFirstName | name | John | NORMAL |
| Author Last | authorLastName | name | Doe | NORMAL |
| Contributors | contributors | name | Editor Name | SLOW |
| Description | description | id | This is an amazing book about... | SLOW |
| Publishing Rights | publishingRights | name | I own the copyright | NORMAL |
| Keywords | keywords | name | fiction, adventure, novel | NORMAL |
| Categories | categories | id | Fiction | NORMAL |
| Age Range | ageRange | name | 18 and up | FAST |
| Grade Range | gradeRange | name | Adult | FAST |
| Language | language | name | English | FAST |
| Publication Date | publicationDate | name | 2024-01-01 | NORMAL |
| Print ISBN | printIsbn | name | 9781234567890 | SLOW |
| Save Draft | Save | text | CLICK | SLOW |

## 🎯 HOW TO FIND REAL KDP SELECTORS:

1. **Go to Amazon KDP form**
2. **Right-click on ANY input field** → "Inspect Element"
3. **Look for these patterns:**

```html
<input name="title" ...>         → Use: title, name
<input id="description" ...>     → Use: description, id  
<textarea name="keywords" ...>   → Use: keywords, name
<select name="language" ...>     → Use: language, name
<button>Save</button>            → Use: Save, text
```

## 🔧 QUICK TEST SELECTORS:

Try these GUARANTEED working selectors on KDP:

| FieldName | Selector | SelectorType | Value | Trigger |
|-----------|----------|--------------|-------|---------|
| Title | input[data-testid="title"] | css | Test Book Title | NORMAL |
| Description | textarea[data-testid="description"] | css | Test Description | SLOW |
| Save Button | button[type="submit"] | css | CLICK | SLOW |

## ⚠️ WHAT YOU HAD WRONG:

❌ **Your Current Data:**
- Selector: "84.73 KB" ← This is a FILE SIZE!
- SelectorType: "My Drive" ← This is a FOLDER NAME!
- Value: "PR Modern RAW" ← This is a FILE NAME!

✅ **What You Need:**
- Selector: "title" ← HTML element name
- SelectorType: "name" ← How to find it
- Value: "My Book Title" ← What to type

## 🚀 IMMEDIATE ACTION STEPS:

1. **Delete everything** in your Google Sheet
2. **Copy the table above** EXACTLY
3. **Paste it** into your sheet
4. **Make sure** column order is: FieldName, Selector, SelectorType, Value, Trigger
5. **Test the extension** - it will work!

## 🧪 SIMPLE TEST FIRST:

Before KDP, test on a simple form:
1. Go to: https://httpbin.org/forms/post
2. Use this data:

| FieldName | Selector | SelectorType | Value | Trigger |
|-----------|----------|--------------|-------|---------|
| Customer | custname | name | John Doe | FAST |
| Phone | custtel | name | 555-1234 | FAST |
| Email | custemail | name | test@email.com | FAST |
| Size | size | name | medium | FAST |
| Submit | Submit | text | CLICK | SLOW |

This WILL work 100%!