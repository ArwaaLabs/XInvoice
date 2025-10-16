# InvoiceGenius Design Quick Reference

## 🚀 Quick Start

This is a quick reference for developers working with the redesigned InvoiceGenius application.

---

## Color Variables

### Primary Colors
```css
hsl(var(--primary))           /* Teal #14B8A6 */
hsl(var(--primary-foreground)) /* White */
hsl(var(--background))         /* Off-white */
hsl(var(--foreground))         /* Dark slate */
```

### Semantic Colors
```css
hsl(var(--destructive))    /* Red - errors, delete */
hsl(var(--chart-2))        /* Green - success */
hsl(var(--chart-3))        /* Amber - warnings */
```

---

## Typography Classes

### Headings
```tsx
<h1 className="text-4xl font-bold tracking-tight">
<h2 className="text-3xl font-semibold tracking-tight">
<h3 className="text-2xl font-semibold tracking-tight">
```

### Body Text
```tsx
<p className="text-base">           /* Regular */
<p className="text-sm">             /* Small */
<p className="text-muted-foreground"> /* Muted */
```

---

## Component Patterns

### Buttons
```tsx
// Primary action
<Button size="lg" className="shadow-lg hover:shadow-xl">
  <Icon className="mr-2 h-5 w-5" />
  Action Text
</Button>

// Secondary action
<Button variant="outline" className="shadow-sm">
  Text
</Button>

// Destructive
<Button variant="destructive">
  Delete
</Button>
```

### Cards
```tsx
<Card className="shadow-lg hover:shadow-xl transition-all duration-200">
  <CardHeader className="bg-gradient-subtle">
    <CardTitle className="text-2xl">Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Inputs
```tsx
<div className="space-y-2">
  <Label htmlFor="field">Field Name</Label>
  <Input
    id="field"
    placeholder="Enter value..."
    className="shadow-sm"
  />
</div>
```

### Stats Cards
```tsx
<Card className="transition-all duration-200 hover:shadow-xl">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
    <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
      Metric Name
    </CardTitle>
    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
      <Icon className="h-5 w-5" />
    </div>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold font-mono tracking-tight">
      $1,234
    </div>
    <p className="text-sm text-muted-foreground mt-2 font-medium">
      Description
    </p>
  </CardContent>
</Card>
```

---

## Layout Patterns

### Page Header
```tsx
<div className="space-y-8 animate-fade-in">
  <div className="flex items-center justify-between">
    <div className="space-y-1">
      <h1 className="text-4xl font-bold tracking-tight">
        Page Title
      </h1>
      <p className="text-muted-foreground text-base">
        Page description
      </p>
    </div>
    <Button size="lg" className="shadow-lg hover:shadow-xl">
      <Plus className="mr-2 h-5 w-5" />
      Action
    </Button>
  </div>
  
  {/* Page content */}
</div>
```

### Loading State
```tsx
<div className="h-64 flex items-center justify-center text-muted-foreground">
  <div className="flex flex-col items-center gap-3">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <p>Loading...</p>
  </div>
</div>
```

### Grid Layouts
```tsx
// Stats grid
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

// Client cards
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

// Feature cards
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
```

---

## Spacing Guidelines

### Page Level
```tsx
className="space-y-8"  /* Between major sections */
```

### Card Level
```tsx
<Card>
  <CardHeader className="p-7">     /* Padding */
  <CardContent className="p-7 pt-0"> /* Content padding */
</Card>
```

### Form Level
```tsx
<div className="space-y-4">  /* Between form fields */
  <div className="space-y-2">  /* Label to input */
```

---

## Shadow Classes

```tsx
className="shadow-sm"    /* Subtle */
className="shadow"       /* Default */
className="shadow-md"    /* Medium */
className="shadow-lg"    /* Large */
className="shadow-xl"    /* Extra large */

/* With hover */
className="shadow-lg hover:shadow-xl"
```

---

## Icon Sizes

```tsx
<Icon className="h-4 w-4" />   /* Small - badges, menu items */
<Icon className="h-5 w-5" />   /* Medium - buttons, stats */
<Icon className="h-6 w-6" />   /* Large - headers */
<Icon className="h-8 w-8" />   /* Extra large - features */
<Icon className="h-10 w-10" /> /* Hero - landing page */
```

---

## Animation Classes

```tsx
className="animate-fade-in"              /* Fade in on load */
className="animate-slide-in-from-bottom" /* Slide up */
className="transition-all duration-200"  /* Smooth transition */
className="hover:scale-105"              /* Scale on hover */
```

---

## Badge Variants

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="outline">Outline</Badge>
```

---

## Custom Utilities

```css
/* In your components */
.bg-gradient-premium      /* Teal gradient */
.bg-gradient-subtle       /* Subtle background */
.glass-effect             /* Glass morphism */
.transition-smooth        /* 200ms transition */
.transition-smooth-slow   /* 300ms transition */
```

---

## Common Patterns

### Icon with Background Circle
```tsx
<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
  <Icon className="h-5 w-5" />
</div>
```

### Gradient Logo/Icon
```tsx
<div className="h-11 w-11 rounded-xl bg-gradient-premium shadow-lg flex items-center justify-center">
  <Icon className="h-6 w-6 text-white" />
</div>
```

### Muted Text with Icon
```tsx
<div className="flex items-center gap-2 text-sm text-muted-foreground">
  <Icon className="h-4 w-4" />
  <span>Text</span>
</div>
```

### Card Header with Action
```tsx
<CardHeader className="bg-gradient-subtle">
  <div className="flex items-center justify-between">
    <div>
      <CardTitle>Title</CardTitle>
      <CardDescription className="mt-1">Description</CardDescription>
    </div>
    <Button variant="outline" className="shadow-sm">
      Action
    </Button>
  </div>
</CardHeader>
```

---

## Responsive Breakpoints

```tsx
// Mobile first approach
<div className="text-6xl md:text-7xl">      /* Larger on desktop */
<div className="py-20 md:py-32">            /* More padding on desktop */
<div className="grid md:grid-cols-2 lg:grid-cols-4"> /* Responsive grid */
```

---

## Form Layouts

### Standard Form Field
```tsx
<div className="space-y-2">
  <Label htmlFor="field">Field Label</Label>
  <Input
    id="field"
    placeholder="Placeholder text..."
    className="shadow-sm"
  />
</div>
```

### Form with Validation
```tsx
<div className="space-y-2">
  <Label htmlFor="field">Field Label</Label>
  <Input
    id="field"
    className={cn(
      "shadow-sm",
      error && "border-destructive"
    )}
  />
  {error && (
    <p className="text-sm text-destructive">{error}</p>
  )}
</div>
```

---

## Dark Mode Classes

Classes automatically adjust for dark mode - no need for dark: prefix in most cases.
The CSS variables handle it automatically.

---

## RTL Support

```tsx
/* Automatic - just use value prop */
<Input value={text} autoDirection />
<Textarea value={text} autoDirection />

/* Manual control if needed */
<Input value={text} autoDirection={false} dir="rtl" />
```

---

## Common Measurements

```
Heights:
- Input/Select/Button: h-10 (40px)
- Button Small: h-9 (36px)
- Button Large: h-11 (44px)

Padding:
- Card: p-7 (28px)
- Button: px-5 py-2.5
- Input: px-4 py-2.5

Border Radius:
- Default: rounded-lg (10px)
- Card: rounded-xl (12px)

Gaps:
- Page sections: space-y-8
- Card grids: gap-6
- Form fields: space-y-4
- Label to input: space-y-2
```

---

## Best Practices

1. **Always use shadow classes on interactive elements**
   ```tsx
   <Button className="shadow-lg hover:shadow-xl">
   ```

2. **Add transitions to cards and interactive elements**
   ```tsx
   <Card className="transition-all duration-200 hover:shadow-xl">
   ```

3. **Use consistent icon sizing**
   - Buttons: h-5 w-5
   - Stats: h-5 w-5 (in h-10 w-10 circle)
   - Menu: h-5 w-5

4. **Maintain spacing hierarchy**
   - Page: space-y-8
   - Sections: space-y-6
   - Cards: space-y-4
   - Form fields: space-y-2

5. **Use semantic colors**
   ```tsx
   <Badge variant="success">    /* For positive states */
   <Badge variant="warning">    /* For attention states */
   <Badge variant="destructive"> /* For errors */
   ```

---

## Testing Checklist

- [ ] Check hover states on all interactive elements
- [ ] Verify shadows display correctly
- [ ] Test animations don't cause jank
- [ ] Validate RTL language support
- [ ] Check dark mode appearance
- [ ] Verify responsive layouts on mobile
- [ ] Ensure proper keyboard focus states
- [ ] Test with reduced motion preference

---

**For more details, see:**
- `DESIGN_SYSTEM.md` - Complete design system documentation
- `VISUAL_REDESIGN_GUIDE.md` - Before/after visual comparisons
- `REDESIGN_SUMMARY.md` - Implementation summary
