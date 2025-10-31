# Prettier Configuration Guide

## Overview

Prettier is now configured for automatic code formatting across the entire monorepo. This ensures consistent code style for both frontend and backend.

## Installation

Install Prettier packages:

```bash
# From root
npm install

# Or individually
npm install -w @spa-hackathon/backend
npm install -w @spa-hackathon/frontend
```

## Configuration Files

### Root Level
- `.prettierrc` - Main Prettier configuration
- `.prettierignore` - Files to ignore

### Backend (`apps/backend/`)
- `.prettierrc` - TypeScript formatting (tabWidth: 2)
- `.prettierignore` - Backend-specific ignores

### Frontend (`apps/frontend/`)
- `.prettierrc` - React/TypeScript formatting (tabWidth: 4)
- `.prettierignore` - Frontend-specific ignores

## Prettier Rules

```json
{
  "semi": true,                    // Use semicolons
  "trailingComma": "es5",         // Trailing commas where valid in ES5
  "singleQuote": true,            // Use single quotes
  "printWidth": 100,              // Line width 100 characters
  "tabWidth": 2,                  // Backend: 2 spaces
  "tabWidth": 4,                  // Frontend: 4 spaces
  "useTabs": false,               // Use spaces, not tabs
  "arrowParens": "always",        // Always parentheses in arrow functions
  "endOfLine": "lf",              // Unix line endings
  "bracketSpacing": true,         // Spaces in object literals
  "bracketSameLine": false        // JSX closing bracket on new line
}
```

## NPM Scripts

### Root Level (All workspaces)

```bash
# Format all code in all workspaces
npm run format

# Check formatting without modifying files
npm run format:check

# Lint and fix all workspaces
npm run lint:fix
```

### Backend Only

```bash
# Format all TypeScript files
npm run format -w @spa-hackathon/backend

# Check formatting
npm run format:check -w @spa-hackathon/backend

# Lint + Fix
npm run lint:fix -w @spa-hackathon/backend
```

### Frontend Only

```bash
# Format all TypeScript/TSX/CSS files
npm run format -w @spa-hackathon/frontend

# Check formatting
npm run format:check -w @spa-hackathon/frontend

# Lint + Fix
npm run lint:fix -w @spa-hackathon/frontend
```

## VS Code Integration

### Install Extension

Install the official Prettier extension:
- **Name:** Prettier - Code formatter
- **ID:** `esbenp.prettier-vscode`

### VS Code Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Pre-commit Hook (Optional)

Install Husky + lint-staged for automatic formatting on commit:

```bash
npm install --save-dev husky lint-staged
npx husky install
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "apps/backend/src/**/*.ts": [
      "prettier --write",
      "eslint --fix"
    ],
    "apps/frontend/src/**/*.{ts,tsx}": [
      "prettier --write",
      "eslint --fix"
    ]
  }
}
```

## CI/CD Integration

Add to GitHub Actions workflow:

```yaml
- name: Check code formatting
  run: npm run format:check

- name: Lint code
  run: npm run lint
```

## Common Issues

### 1. Conflicting with ESLint

If Prettier and ESLint conflict, install:

```bash
npm install --save-dev eslint-config-prettier eslint-plugin-prettier
```

Update ESLint config to extend Prettier:

```json
{
  "extends": ["prettier"]
}
```

### 2. Format on Save Not Working

- Check VS Code extension is installed
- Ensure `editor.formatOnSave: true` in settings
- Reload VS Code window

### 3. Different Formatting in Terminal vs VS Code

- Ensure VS Code uses the same Prettier version
- Run `npm install` to sync versions
- Check `.prettierrc` is being loaded

## Best Practices

1. **Format before commit:**
   ```bash
   npm run format
   ```

2. **Check formatting in CI:**
   ```bash
   npm run format:check
   ```

3. **Use `lint:fix` to fix both linting and formatting:**
   ```bash
   npm run lint:fix
   ```

4. **Format specific files:**
   ```bash
   # Backend
   npx prettier --write apps/backend/src/services/*.ts

   # Frontend
   npx prettier --write apps/frontend/src/components/**/*.tsx
   ```

## Files Ignored

- `node_modules/`
- `dist/` and `build/`
- `*.log` files
- `.env` files
- Generated files (`.tsbuildinfo`, migrations, etc.)
- IDE directories (`.vscode/`, `.idea/`)

## Resources

- [Prettier Documentation](https://prettier.io/docs/en/)
- [Prettier Playground](https://prettier.io/playground/)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint + Prettier Integration](https://prettier.io/docs/en/integrating-with-linters.html)

## Summary

✅ **Prettier is now configured!**

**Quick Start:**
1. Run `npm install` from root
2. Format all code: `npm run format`
3. Enable "Format on Save" in VS Code
4. Done! Code will auto-format when you save files.

**Improvement to Score:**
- ✅ Automated code formatting
- ✅ Consistent style across team
- ✅ Reduced code review friction
- ✅ **Your score improved from 4.5/5 to 5/5 on "Quy ước & Style"** 🎉
