# 🧪 WORKING EXAMPLE SHEET FORMAT

## ❌ WRONG FORMAT (What You Had):
Your sheet had invalid data like:
- Selector: "84.73 KB" 
- SelectorType: "My Drive"
- This is file/folder data, not form field data!

## ✅ CORRECT FORMAT (Use This):

Create a Google Sheet with EXACTLY this format:

| FieldName | Selector | SelectorType | Value | Trigger |
|-----------|----------|--------------|-------|---------|
| Title Field | title | name | My Book Title | NORMAL |
| Description | description | id | This is my book description | SLOW |
| Author Name | author | class | John Doe | FAST |
| Submit Button | Save | text | CLICK | NORMAL |

## 📋 Real KDP Example Sheet:

For Amazon KDP forms, use selectors like these:

| FieldName | Selector | SelectorType | Value | Trigger |
|-----------|----------|--------------|-------|---------|
| Book Title | title | name | My Amazing Book | NORMAL |
| Subtitle | subtitle | name | A Great Story | NORMAL |
| Description | description | id | This book is about... | SLOW |
| Keywords | keywords | name | fiction, adventure, novel | NORMAL |
| Save Draft | Save | text | CLICK | SLOW |

## 🔧 How To Find Correct Selectors:

1. **Right-click on form field** → Inspect Element
2. **Look for these attributes:**
   - `id="title"` → Use selector: `title`, type: `id`
   - `name="description"` → Use selector: `description`, type: `name`
   - `class="input-field"` → Use selector: `input-field`, type: `class`

## 🎯 Common Amazon KDP Selectors:

| Field Type | Selector | SelectorType |
|------------|----------|--------------|
| Book Title | title | name |
| Subtitle | subtitle | name |
| Description | description | id |
| Author | author | name |
| Keywords | keywords | name |
| Category | category | id |

## ⚠️ IMPORTANT:
- **Never use file sizes** like "84.73 KB" as selectors
- **Never use folder names** like "My Drive" as selector types
- **Always use actual HTML form field selectors**

## 🧪 Test Steps:
1. Create sheet with correct format above
2. Make it public (Anyone with link can view)
3. Copy the sheet URL
4. Configure extension with URL
5. Go to a form page
6. Click "Fill This Form"
7. Watch it work! 🚀