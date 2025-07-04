import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist', // If a build step were to be added for the extension
      'node_modules'
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.cjs'], // Adjusted for .js and .cjs files
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser, // For browser environments (content scripts, popup, options)
        ...globals.node,   // For Node.js scripts like generate-icons.cjs
        chrome: 'readonly', // Add chrome global for extension APIs
      },
      sourceType: 'module', // Default, generate-icons.cjs will be commonjs
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn', // Keep this, useful for extension development
      // Add any other general JS rules or extension specific rules here
    },
  },
  { // Specific override for .cjs files to be treated as CommonJS
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node, // Node.js globals
      }
    }
  }
]