# Internationalization (i18n) Guide

This document describes how to use and maintain the i18n system in the SPA Hackathon project.

## Overview

The project uses **i18next** with **react-i18next** to support multiple languages. Currently supported languages:
- Ì∑ªÌ∑≥ **Vietnamese (vi)** - Default
- Ì∑¨Ì∑ß **English (en)**

## Quick Start

### Using translations in components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
    const { t } = useTranslation('common');
    
    return (
        <div>
            <h1>{t('dashboard.title')}</h1>
            <p>{t('dashboard.welcome')}</p>
        </div>
    );
}
```

### Accessing current language

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
    const { i18n } = useTranslation();
    
    const currentLang = i18n.language; // 'vi' or 'en'
    
    // Change language
    i18n.changeLanguage('en');
}
```

### Formatting dates and numbers

```tsx
import { useTranslation } from 'react-i18next';
import { formatDate, formatCurrency, formatNumber } from '@/i18n/format';

function MyComponent() {
    const { i18n } = useTranslation();
    
    const date = new Date();
    const formattedDate = formatDate(date, i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    const price = 500000;
    const formattedPrice = formatCurrency(price, i18n.language);
    // Vi: "500.000 ‚Ç´"
    // En: "‚Ç´500,000"
    
    return (
        <div>
            <p>{formattedDate}</p>
            <p>{formattedPrice}</p>
        </div>
    );
}
```

## File Structure

```
apps/frontend/src/i18n/
‚îú‚îÄ‚îÄ index.ts                      # i18n initialization
‚îú‚îÄ‚îÄ format.ts                     # Formatting utilities (dates, numbers, currency)
‚îî‚îÄ‚îÄ locales/
    ‚îú‚îÄ‚îÄ vi/
    ‚îÇ   ‚îî‚îÄ‚îÄ common.json           # Vietnamese translations
    ‚îî‚îÄ‚îÄ en/
        ‚îî‚îÄ‚îÄ common.json           # English translations
```

## Translation Key Naming Conventions

Use **dot notation** for nested keys:

```json
{
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome back",
    "stats": {
      "totalBookings": "Total Bookings"
    }
  }
}
```

Access in code: `t('dashboard.stats.totalBookings')`

### Key Naming Guidelines

1. **Be descriptive**: `dashboard.upcomingBookings` not `dashboard.ub`
2. **Group by feature**: Use top-level keys like `dashboard`, `bookings`, `profile`
3. **Common keys**: Put shared translations under `common.*`
4. **Status/enums**: Group under parent key: `bookings.status.pending`

### Example Structure

```json
{
  "feature": {
    "title": "Feature Title",
    "description": "Feature description",
    "actions": {
      "create": "Create",
      "edit": "Edit",
      "delete": "Delete"
    },
    "status": {
      "active": "Active",
      "inactive": "Inactive"
    }
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading..."
  }
}
```

## Adding New Translations

### Step 1: Add keys to JSON files

**apps/frontend/src/i18n/locales/vi/common.json**
```json
{
  "myFeature": {
    "newKey": "VƒÉn b·∫£n ti·∫øng Vi·ªát"
  }
}
```

**apps/frontend/src/i18n/locales/en/common.json**
```json
{
  "myFeature": {
    "newKey": "English text"
  }
}
```

### Step 2: Use in component

```tsx
const { t } = useTranslation('common');
<h1>{t('myFeature.newKey')}</h1>
```

## Language Switcher

The `LanguageSwitcher` component is available in:
- Client Navbar (desktop & mobile)
- Admin Header

It automatically persists language selection to localStorage.

## Testing Translations

1. Start dev server: `npm run dev`
2. Open browser DevTools ‚Üí Application ‚Üí Local Storage
3. Check `i18n.lang` key
4. Use the language switcher in UI
5. Verify all text updates correctly
6. Test with different routes

## Extending to More Languages

To add Japanese (ja) or Chinese (zh):

1. Create translation file:
   ```
   apps/frontend/src/i18n/locales/ja/common.json
   ```

2. Update i18n config in `apps/frontend/src/i18n/index.ts`:
   ```ts
   import jaCommon from './locales/ja/common.json';
   
   const resources = {
       vi: { common: viCommon },
       en: { common: enCommon },
       ja: { common: jaCommon }, // Add this
   };
   ```

3. Update LanguageSwitcher to include new language

4. Update format.ts to map locale codes:
   ```ts
   const localeCode = {
       vi: 'vi-VN',
       en: 'en-US',
       ja: 'ja-JP'
   }[locale] || 'en-US';
   ```

## Best Practices

### ‚úÖ DO

- Use `t()` for all user-facing text
- Keep translation keys descriptive
- Use Intl API for dates/numbers/currency
- Test both languages before committing
- Keep translations in sync (same keys in all locales)

### ‚ùå DON'T

- Hardcode user-facing text in components
- Use abbreviations in translation keys
- Concatenate translated strings (breaks grammar rules in some languages)
- Forget to translate new features
- Mix different naming conventions

## Troubleshooting

### Translations not showing

1. Check if key exists in JSON file
2. Verify namespace is correct: `useTranslation('common')`
3. Check browser console for i18next errors
4. Clear localStorage and refresh

### Language not persisting

1. Check localStorage for `i18n.lang` key
2. Verify i18next detection config in `apps/frontend/src/i18n/index.ts`
3. Try manually: `i18n.changeLanguage('vi')`

### Date format looks wrong

- Verify you're passing `i18n.language` to format functions
- Check locale mapping in format.ts
- Test with different date options

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Intl API (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

## Coverage Status

### ‚úÖ Translated Pages
- Dashboard (Member)
  - `/dashboard` - Member Dashboard
  - `/dashboard/bookings` - Booking History
  - `/dashboard/profile` - Profile Management (partial)
- Admin areas (headers/navigation)

### Ì∫ß TODO (Excluded - Being worked on by another dev)
- `/` - Home page
- `/services` - Services listing
- `/services/:id` - Service detail
- `/blog` - Blog listing
- `/blog/:slug` - Blog detail

### Ì≥ù TODO (Future work)
- `/booking` - Booking flow
- `/branches` - Branch locations
- `/contact` - Contact form
- `/reviews` - Reviews page
- Auth pages (login/register)
- Admin pages (full translation)
- Add Japanese (ja) and Chinese (zh) support
