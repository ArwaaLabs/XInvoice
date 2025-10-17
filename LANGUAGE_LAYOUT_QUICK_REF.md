# Language Layout Quick Reference

Quick reference for implementing language-adaptive UI components in InvoiceGenius.

## Quick Start

```typescript
import { useLanguage } from '@/hooks/useLanguage';

function MyComponent() {
  const { direction, isRTL, languageConfig } = useLanguage();
  // Component uses direction and config automatically
}
```

## Common Patterns

### 1. Responsive Text

```tsx
// ✅ Automatically adapts
<p>Text content</p>

// ✅ Language-specific sizing
<h1 className="lang-ar:text-5xl lang-en:text-4xl">
  Heading
</h1>
```

### 2. Flexible Spacing

```tsx
// ✅ Auto-adjusted spacing
<div className="space-y-4">
  {/* Spacing increases for RTL languages */}
</div>

// ✅ Custom spacing per language
<div className="gap-4 lang-ur:gap-6">
  Content
</div>
```

### 3. Icons & Arrows

```tsx
import { ChevronRight, ArrowRight } from 'lucide-react';

// ✅ Flips in RTL
<ChevronRight className="rtl-flip" />

// ✅ Rotates in RTL
<ArrowRight className="rtl-rotate-180" />
```

### 4. Layouts

```tsx
// ✅ Direction-aware flexbox
<div className="flex items-center gap-2">
  <Icon />
  <span>Text</span>
</div>

// ✅ Using logical properties
<div className="ps-4 pe-2">  {/* padding-start/end */}
  Content adapts to direction
</div>
```

### 5. Forms

```tsx
// ✅ Auto-sized inputs
<Input 
  type="text" 
  placeholder={t('form.name')}
  className="w-full"  {/* Let width be flexible */}
/>

// ✅ Proper label alignment
<Label className="text-start">
  {t('form.label')}
</Label>
```

### 6. Text Alignment

```tsx
// ❌ Avoid fixed alignment
<p className="text-left">

// ✅ Use start/end
<p className="text-start">  {/* left in LTR, right in RTL */}
<p className="text-end">    {/* right in LTR, left in RTL */}
```

### 7. Positioning

```tsx
// ❌ Avoid
<div className="absolute left-0">

// ✅ Use logical properties
<div className="absolute start-0">  {/* adapts to direction */}
```

## Utilities Cheat Sheet

| Instead of... | Use... | Effect |
|--------------|--------|--------|
| `pl-4` | `ps-4` | Padding-inline-start |
| `pr-4` | `pe-4` | Padding-inline-end |
| `ml-auto` | `ms-auto` | Margin-inline-start auto |
| `mr-auto` | `me-auto` | Margin-inline-end auto |
| `left-0` | `start-0` | Inset-inline-start |
| `right-0` | `end-0` | Inset-inline-end |
| `text-left` | `text-start` | Text align start |
| `text-right` | `text-end` | Text align end |

## Language Detection

```typescript
const { currentLanguage } = useLanguage();

if (currentLanguage === 'ar' || currentLanguage === 'ur') {
  // RTL language
}

if (currentLanguage === 'hi') {
  // Devanagari script
}
```

## Testing Checklist

- [ ] Component renders in all 4 languages
- [ ] Text doesn't overflow containers
- [ ] Icons flip/rotate correctly in RTL
- [ ] Spacing is comfortable in all languages
- [ ] Forms are properly proportioned
- [ ] Buttons have adequate padding
- [ ] Modal/dialog positioning is correct
- [ ] Dropdown menus align properly

## Font Sizes by Language

| Language | Body | H1 | H2 | H3 |
|----------|------|----|----|-----|
| English | 16px | 36px | 30px | 24px |
| Arabic | 17px | 40px | 32px | 26px |
| Urdu | 18px | 44px | 36px | 30px |
| Hindi | 16px | 38px | 30px | 24px |

## Common Issues

### Issue: Text overflows
**Fix:** Use `truncate`, `line-clamp-*`, or flexible widths

### Issue: Icons don't flip
**Fix:** Add `rtl-flip` or `rtl-rotate-180` class

### Issue: Wrong spacing in RTL
**Fix:** Use logical properties (`ps-`, `pe-`) instead of directional

### Issue: Form fields too short
**Fix:** System handles automatically - verify language class on `<html>`

## Examples

### Card Component
```tsx
<Card className="p-6 lang-ur:p-8">
  <CardHeader>
    <div className="flex items-center gap-3">
      <Icon className="rtl-flip" />
      <CardTitle className="lang-ar:text-xl lang-en:text-lg">
        {title}
      </CardTitle>
    </div>
  </CardHeader>
  <CardContent className="space-y-4">
    {content}
  </CardContent>
</Card>
```

### Button with Icon
```tsx
<Button className="flex items-center gap-2">
  <span>{t('action.submit')}</span>
  <ArrowRight className="rtl-rotate-180 h-4 w-4" />
</Button>
```

### Input with Label
```tsx
<div className="space-y-2">
  <Label htmlFor="email" className="text-start">
    {t('form.email')}
  </Label>
  <Input
    id="email"
    type="email"
    placeholder={t('form.emailPlaceholder')}
    className="w-full"
  />
</div>
```

### Navigation
```tsx
<nav className="flex items-center gap-4">
  {items.map(item => (
    <a 
      key={item.id}
      href={item.url}
      className="flex items-center gap-2 hover:underline"
    >
      <span>{item.label}</span>
      <ChevronRight className="rtl-flip h-4 w-4" />
    </a>
  ))}
</nav>
```

## Resources

- **Full Guide**: See `LANGUAGE_LAYOUT_GUIDE.md`
- **Translation Files**: `/client/src/locales/*.json`
- **CSS Rules**: `/client/src/index.css`
- **Config**: `/client/src/lib/i18n.ts`
