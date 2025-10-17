# Language-Adaptive Layout System

This guide explains the dynamic layout adjustment system that automatically adapts the UI based on the selected language, including text direction (RTL/LTR), font sizing, spacing, and visual consistency across all supported languages.

## Overview

The InvoiceGenius application supports four languages with complete layout adaptation:

| Language | Code | Script | Direction | Font Family | Special Features |
|----------|------|--------|-----------|-------------|------------------|
| **English** | `en` | Latin | LTR | Inter | Default, tight letter spacing |
| **Arabic** | `ar` | Arabic | RTL | Noto Sans Arabic | Larger font size, relaxed line height |
| **Urdu** | `ur` | Nastaliq (Arabic script) | RTL | Noto Nastaliq Urdu | Largest font size, extra line height for flowing script |
| **Hindi** | `hi` | Devanagari | LTR | Noto Sans Devanagari | Taller line height for complex characters |

## Features

### 1. **Automatic Direction Switching**

The layout automatically switches between LTR (Left-to-Right) and RTL (Right-to-Left) based on language:

```typescript
// Automatically applied when language changes
document.documentElement.dir = 'rtl'; // for Arabic/Urdu
document.documentElement.dir = 'ltr'; // for English/Hindi
```

**What changes in RTL:**
- Text flows from right to left
- UI elements mirror horizontally
- Margins/padding flip (left becomes right)
- Icons and arrows rotate 180°
- Flex layouts reverse direction

### 2. **Language-Specific Typography**

Each language has optimized typography settings:

#### English
```css
font-family: 'Inter'
font-size: 1rem (16px)
line-height: 1.5
letter-spacing: -0.011em
```

#### Arabic
```css
font-family: 'Noto Sans Arabic'
font-size: 1.0625rem (17px)
line-height: 1.75
letter-spacing: normal
```

#### Urdu
```css
font-family: 'Noto Nastaliq Urdu'
font-size: 1.125rem (18px)
line-height: 2.0
letter-spacing: normal
```

#### Hindi
```css
font-family: 'Noto Sans Devanagari'
font-size: 1rem (16px)
line-height: 1.75
letter-spacing: normal
```

### 3. **Responsive Spacing**

Spacing automatically adjusts for better readability:

**Arabic/Urdu (RTL):**
- `.space-y-2`: 0.625rem (increased from 0.5rem)
- `.space-y-4`: 1.25rem (increased from 1rem)
- `.space-y-6`: 1.75rem (increased from 1.5rem)

**Hindi:**
- `.space-y-2`: 0.625rem
- `.space-y-4`: 1.125rem

### 4. **Form Field Adjustments**

Input fields and text areas adapt for optimal character display:

**Arabic:**
- Min height: 2.75rem
- Padding: 0.625rem (top/bottom)

**Urdu:**
- Min height: 3rem (tallest for Nastaliq script)
- Padding: 0.75rem (top/bottom)

**Hindi:**
- Min height: 2.75rem
- Padding: 0.625rem (top/bottom)

### 5. **Button Sizing**

Buttons adjust height to accommodate different scripts:

**Arabic/Urdu:**
- Min height: 2.5rem
- Padding: 0.625rem (top/bottom)

**Hindi:**
- Min height: 2.375rem
- Padding: 0.5rem (top/bottom)

## Usage

### Accessing Language Information

```typescript
import { useLanguage } from '@/hooks/useLanguage';

function MyComponent() {
  const { 
    currentLanguage,    // 'en', 'ar', 'ur', 'hi'
    direction,          // 'ltr' or 'rtl'
    isRTL,             // boolean
    languageConfig,    // Full config object
    changeLanguage     // Function to change language
  } = useLanguage();
  
  return (
    <div>
      <p>Current: {languageConfig.nativeName}</p>
      <p>Direction: {direction}</p>
      <p>Font: {languageConfig.fontFamily}</p>
    </div>
  );
}
```

### Using RTL-Aware Tailwind Classes

The system provides special Tailwind utilities for RTL-aware styling:

```tsx
// Direction-specific variants
<div className="ltr:text-left rtl:text-right">
  Text aligns based on direction
</div>

// Language-specific variants
<div className="lang-ar:text-lg lang-en:text-base">
  Size varies by language
</div>

// Logical properties (automatically flip in RTL)
<div className="ps-4 pe-2">  {/* padding-inline-start/end */}
  Padding adapts to direction
</div>

<div className="start-0">     {/* inset-inline-start */}
  Position adapts to direction
</div>

// RTL flip utilities
<ChevronRight className="rtl-flip" />  {/* Flips horizontally in RTL */}
<ArrowRight className="rtl-rotate-180" />  {/* Rotates 180° in RTL */}
```

### Language Configuration Object

```typescript
type LanguageConfig = {
  code: string;           // 'en', 'ar', 'ur', 'hi'
  name: string;           // English name
  nativeName: string;     // Native name (e.g., 'العربية')
  flag: string;           // Emoji flag
  direction: 'ltr' | 'rtl';
  fontFamily: string;     // Font family name
  fontSize: 'base' | 'lg';
  lineHeight: 'normal' | 'relaxed';
  letterSpacing: 'tight' | 'normal';
};
```

## Best Practices

### 1. **Use Logical Properties**

Instead of `padding-left/right`, use inline variants:
```tsx
// ❌ Avoid
<div className="pl-4 pr-2">

// ✅ Recommended
<div className="ps-4 pe-2">
```

### 2. **Avoid Fixed Text Alignment**

Let text align naturally based on direction:
```tsx
// ❌ Avoid
<p className="text-left">

// ✅ Recommended
<p className="text-start">  // Or omit entirely
```

### 3. **Flip Directional Icons**

Use RTL utilities for icons:
```tsx
import { ChevronRight } from 'lucide-react';

// ✅ Icons adapt to direction
<ChevronRight className="rtl-flip" />
```

### 4. **Test in All Languages**

Always test your components in all four languages to ensure:
- Text doesn't overflow
- Spacing is comfortable
- Icons and layouts make sense
- Forms are usable

### 5. **Use Language-Specific Spacing**

The system handles spacing automatically, but you can override:
```tsx
<div className="space-y-4 lang-ur:space-y-6">
  {/* Extra space for Urdu */}
</div>
```

## Typography Scale by Language

### Headings

| Element | English | Arabic | Urdu | Hindi |
|---------|---------|--------|------|-------|
| `<h1>` | 2.25rem | 2.5rem | 2.75rem | 2.375rem |
| `<h2>` | 1.875rem | 2rem | 2.25rem | 1.875rem |
| `<h3>` | 1.5rem | 1.625rem | 1.875rem | 1.5rem |
| `<h4>` | 1.25rem | 1.25rem | 1.375rem | 1.25rem |
| `<h5>` | 1.125rem | 1.125rem | 1.25rem | 1.125rem |

## CSS Classes Reference

### Language-Specific Classes

Automatically applied to `<html>`:
- `.lang-en` - English
- `.lang-ar` - Arabic
- `.lang-ur` - Urdu
- `.lang-hi` - Hindi

### Direction Classes

Automatically applied to `<body>`:
- `.ltr` - Left-to-right languages
- `.rtl` - Right-to-left languages

### Custom Utilities

- `.rtl-flip` - Horizontal flip in RTL mode
- `.rtl-rotate-180` - 180° rotation in RTL mode
- `.start-0` - Logical inline-start positioning
- `.end-0` - Logical inline-end positioning
- `.ms-auto` / `.me-auto` - Logical margin auto
- `.ps-{n}` / `.pe-{n}` - Logical padding (start/end)

## Implementation Details

### 1. Font Loading

Fonts are loaded via Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Arabic:wght@400;500;600;700;800&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap');
```

### 2. Dynamic Style Application

When language changes:
```typescript
// In lib/i18n.ts
export const applyLanguageStyles = (language: string) => {
  const config = getLanguageConfig(language);
  const root = document.documentElement;
  
  // Set direction and language
  root.dir = config.direction;
  root.lang = language;
  
  // Apply language class
  root.classList.add(`lang-${language}`);
  
  // Apply direction class to body
  document.body.classList.add(config.direction);
};
```

### 3. i18n Integration

The system integrates with react-i18next:
```typescript
i18n.on('languageChanged', (lng) => {
  applyLanguageStyles(lng);
});
```

## Troubleshooting

### Fonts Not Loading

**Issue:** Custom fonts don't appear
**Solution:** Check Google Fonts import in `index.css` and browser console for errors

### RTL Layout Issues

**Issue:** Elements don't flip in RTL
**Solution:** Use logical properties (`ps-`, `pe-`, `start-`, `end-`) instead of directional (`pl-`, `pr-`, `left-`, `right-`)

### Spacing Too Tight

**Issue:** Text feels cramped in non-Latin scripts
**Solution:** System handles this automatically, but verify language class is applied to `<html>`

### Text Overflow

**Issue:** Text overflows in certain languages
**Solution:** 
- Use flexible widths (`w-full`, `max-w-*`)
- Avoid fixed pixel widths
- Test with actual content in all languages

## Performance

The language switching is optimized:
- **CSS Transitions**: Smooth font-family changes (0.2s)
- **No Layout Shift**: Dimensions adjust smoothly
- **Minimal Reflow**: Only necessary elements update
- **Cached Fonts**: Google Fonts are cached by browser

## Accessibility

- **Screen Readers**: Proper `lang` and `dir` attributes
- **Keyboard Navigation**: Works correctly in both directions
- **Focus Indicators**: Adapt to RTL/LTR
- **ARIA Labels**: Translated via i18n system

## Future Enhancements

Planned improvements:
- [ ] Dynamic font scaling based on viewport
- [ ] User-customizable font sizes per language
- [ ] Advanced ligature support for Arabic
- [ ] Seasonal font variants
- [ ] Language-specific color adjustments
