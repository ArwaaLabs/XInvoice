# Multi-lingual Support Guide - InvoiceGenius

## 🌍 Overview

InvoiceGenius now supports full multilingual functionality for **4 languages**:
- **English** (en) - Left-to-Right (LTR)
- **Arabic** (ar) - Right-to-Left (RTL)
- **Urdu** (ur) - Right-to-Left (RTL)
- **Hindi** (hi) - Left-to-Right (LTR)

## ✨ Features

### 1. UI Translation
- All interface elements are translated
- Navigation menus, buttons, labels, and messages
- Toast notifications and error messages
- Dynamic language switching without page reload

### 2. RTL Layout Support
- Automatic layout flip for Arabic and Urdu
- Mirrored sidebars, menus, and components
- Proper text alignment (right for RTL, left for LTR)
- RTL-aware spacing and margins

### 3. Font Rendering
- **Arabic**: Noto Sans Arabic font
- **Urdu**: Noto Nastaliq Urdu font (proper Nastaliq script)
- **Hindi**: Noto Sans Devanagari font
- **English**: Inter font
- All fonts loaded via Google Fonts CDN

### 4. Multilingual Data Input ⭐ NEW
- **Auto-detection**: Input fields automatically detect the language you're typing
- **Auto-direction**: Text direction changes based on content (RTL/LTR)
- **Auto-font**: Appropriate fonts applied automatically
- **Mixed content**: Supports mixing languages in the same field

## 🎯 How to Use

### Switching Languages

1. **Via Language Selector**:
   - Click the language icon (🌐) in the top-right header
   - Select your preferred language from the dropdown
   - The entire interface updates immediately

2. **Language Persistence**:
   - Your language choice is saved in browser localStorage
   - The app remembers your preference across sessions

### Writing in Different Languages

#### For Users:

**All input fields now support multilingual text automatically!**

1. **Simply type in any supported language**:
   - Type Arabic: `مرحبا` → Field auto-switches to RTL
   - Type Urdu: `سلام` → Field auto-switches to RTL with Nastaliq font
   - Type Hindi: `नमस्ते` → Field uses Devanagari font
   - Type English: `Hello` → Field stays LTR

2. **Examples of fields that support this**:
   - Invoice descriptions
   - Client names and addresses
   - Company information
   - Notes and comments
   - All text inputs and textareas

3. **Mixed Language Content**:
   ```
   Example: "Invoice for: کسٹمر نام"
   (English + Urdu mixed - automatically handled!)
   ```

#### For Developers:

**Input Component with Auto-detection**:
```tsx
import { Input } from "@/components/ui/input";

// Auto-detection enabled by default
<Input value={clientName} onChange={(e) => setClientName(e.target.value)} />

// Disable auto-detection if needed
<Input autoDirection={false} value={email} onChange={(e) => setEmail(e.target.value)} />
```

**Textarea Component with Auto-detection**:
```tsx
import { Textarea } from "@/components/ui/textarea";

// Auto-detection enabled by default
<Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />

// Disable for specific fields
<Textarea autoDirection={false} value={code} onChange={(e) => setCode(e.target.value)} />
```

## 🛠️ Technical Implementation

### File Structure

```
client/src/
├── lib/
│   ├── i18n.ts                 # i18next configuration
│   ├── formatUtils.ts          # Date/currency formatting
│   └── textUtils.ts            # Text direction detection
├── locales/
│   ├── en.json                 # English translations
│   ├── ar.json                 # Arabic translations
│   ├── ur.json                 # Urdu translations
│   └── hi.json                 # Hindi translations
├── hooks/
│   └── useLanguage.tsx         # Language context & hooks
├── components/
│   ├── language-selector.tsx   # Language switcher UI
│   └── ui/
│       ├── input.tsx           # Enhanced multilingual input
│       └── textarea.tsx        # Enhanced multilingual textarea
```

### Auto-Detection Algorithm

The system uses Unicode ranges to detect scripts:

1. **Arabic Detection**: `U+0600-U+06FF`, `U+0750-U+077F`, `U+08A0-U+08FF`
2. **Devanagari (Hindi)**: `U+0900-U+097F`, `U+1CD0-U+1CFF`
3. **RTL Detection**: Counts RTL characters, applies RTL if >30% of text

### Available Utilities

```typescript
// Text direction detection
import { detectTextDirection, containsRTL, containsArabic } from "@/lib/textUtils";

const direction = detectTextDirection("مرحبا"); // returns 'rtl'
const isRTL = containsRTL("Hello مرحبا"); // returns true

// Auto-direction hook
import { useAutoDirection } from "@/lib/textUtils";

const { dir, style } = useAutoDirection(inputValue);
// dir: 'ltr' | 'rtl'
// style: { direction, textAlign, fontFamily }
```

### Currency & Date Formatting

```typescript
import { formatCurrency, formatDate } from "@/lib/formatUtils";
import { useTranslation } from "react-i18next";

const { i18n } = useTranslation();

// Format currency based on current language
const formatted = formatCurrency(1000, 'USD', i18n.language);
// English: "$1,000"
// Arabic: "١٬٠٠٠ $"
// Hindi: "₹1,000"

// Format dates
const date = formatDate(new Date(), i18n.language);
// English: "January 15, 2025"
// Arabic: "١٥ يناير ٢٠٢٥"
// Hindi: "15 जनवरी 2025"
```

## 🎨 Styling & CSS

### RTL-Specific Styles

```css
/* Automatic font switching */
[dir="rtl"] {
  font-family: 'Noto Sans Arabic', 'Noto Nastaliq Urdu', sans-serif;
}

[dir="rtl"][lang="ar"] {
  font-family: 'Noto Sans Arabic', sans-serif;
}

[dir="rtl"][lang="ur"] {
  font-family: 'Noto Nastaliq Urdu', sans-serif;
}

[lang="hi"] {
  font-family: 'Noto Sans Devanagari', sans-serif;
}
```

### Tailwind RTL Variants

```tsx
// Use rtl: and ltr: modifiers
<div className="ltr:ml-4 rtl:mr-4">
  Content with language-aware margins
</div>

<div className="ltr:text-left rtl:text-right">
  Auto-aligned text
</div>
```

## 📝 Translation Keys

### Adding New Translations

1. **Add to English** (`client/src/locales/en.json`):
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}
```

2. **Add to all other languages** (ar.json, ur.json, hi.json)

3. **Use in components**:
```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <p>{t('myFeature.description')}</p>
    </div>
  );
}
```

### Common Translation Sections

- `common.*` - Common UI elements (buttons, actions)
- `nav.*` - Navigation items
- `dashboard.*` - Dashboard page
- `invoices.*` - Invoice management
- `clients.*` - Client management
- `settings.*` - Settings page
- `invoiceEditor.*` - Invoice creation/editing

## 🔧 Configuration

### Changing Default Language

Edit `client/src/lib/i18n.ts`:
```typescript
i18n.init({
  fallbackLng: 'en', // Change default language here
  // ... other config
});
```

### Adding New Languages

1. Create translation file: `client/src/locales/[code].json`
2. Update `i18n.ts`:
```typescript
import newLangTranslations from '../locales/[code].json';

export const LANGUAGES = [
  // ... existing languages
  { code: '[code]', name: 'Name', nativeName: 'Native Name', flag: '🏳️' },
];

// Add to RTL_LANGUAGES if needed
export const RTL_LANGUAGES = ['ar', 'ur', 'he']; // Add new RTL codes

// Add to resources
resources: {
  // ... existing
  [code]: { translation: newLangTranslations },
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Switch between all 4 languages
- [ ] Verify RTL layout for Arabic/Urdu
- [ ] Check font rendering for all languages
- [ ] Test data input in each language
- [ ] Verify mixed-language input (e.g., English + Arabic)
- [ ] Check currency formatting in each locale
- [ ] Verify date formatting
- [ ] Test form validation messages
- [ ] Check toast notifications
- [ ] Verify PDF generation with multilingual content

### Test Cases for Input

```typescript
// Test RTL detection
Input: "مرحبا" → Expected: dir="rtl", Arabic font
Input: "سلام" → Expected: dir="rtl", Urdu font
Input: "Hello" → Expected: dir="ltr", default font
Input: "Hello مرحبا" → Expected: dir="rtl" (mixed)

// Test Hindi
Input: "नमस्ते" → Expected: dir="ltr", Devanagari font
```

## 📱 Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Performance

- Fonts are loaded via Google Fonts CDN with `display=swap`
- Only used fonts are loaded (subset optimization)
- Translation files are tree-shaken (only loaded language)
- No performance impact on input fields (lightweight detection)

## 🐛 Troubleshooting

### Fonts not displaying correctly
- Check internet connection (Google Fonts CDN)
- Clear browser cache
- Verify font import in `index.css`

### Language not persisting
- Check browser localStorage permissions
- Clear localStorage and try again

### Input direction not changing
- Ensure `autoDirection={true}` (default)
- Check if enough RTL characters (>30% threshold)
- Try typing more characters

### Mixed language issues
- This is expected behavior
- Direction determined by character majority
- Manually set `dir` attribute if needed

## 📚 Resources

- [i18next Documentation](https://www.i18next.com/)
- [React i18next](https://react.i18next.com/)
- [Google Fonts](https://fonts.google.com/)
- [Unicode Character Ranges](https://unicode.org/charts/)
- [RTL Best Practices](https://rtlstyling.com/)

## 🎉 Summary

Your InvoiceGenius application now supports:

✅ **4 Languages** - English, Arabic, Urdu, Hindi  
✅ **RTL Support** - Automatic layout flip for Arabic/Urdu  
✅ **Smart Input** - Auto-detecting text direction & fonts  
✅ **Proper Fonts** - Native script rendering  
✅ **Localized Formats** - Dates, currencies, numbers  
✅ **Persistent Choice** - Remembers language preference  
✅ **Mixed Content** - Handles multilingual data seamlessly  

**Users can now work in their preferred language and input data in ANY supported language!** 🌍✨
