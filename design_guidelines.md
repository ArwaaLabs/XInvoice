# Invoice Generator - Design Guidelines

## Design Approach: Professional Productivity System

**Selected Framework**: Linear-inspired minimalism meets Stripe's dashboard sophistication
**Rationale**: Invoice generators are utility-focused productivity tools requiring clarity, professionalism, and efficiency. Drawing from Linear's clean typography and Stripe's data presentation excellence.

---

## Core Design Elements

### A. Color Palette

**Light Mode**:
- Background: 0 0% 100% (pure white)
- Surface: 240 5% 96% (subtle gray)
- Border: 240 6% 90%
- Text Primary: 240 10% 10%
- Text Secondary: 240 5% 45%
- Primary: 220 90% 56% (professional blue)
- Primary Hover: 220 90% 48%
- Success: 142 76% 36% (for paid status)
- Warning: 38 92% 50% (for pending)
- Danger: 0 84% 60% (for overdue)

**Dark Mode**:
- Background: 240 10% 8%
- Surface: 240 8% 12%
- Border: 240 6% 20%
- Text Primary: 240 5% 96%
- Text Secondary: 240 5% 65%
- Primary: 220 90% 60%
- Success: 142 70% 45%
- Warning: 38 90% 55%
- Danger: 0 80% 65%

### B. Typography

**Font Stack**:
- Primary: 'Inter', -apple-system, system-ui (UI text, forms, data)
- Display: 'Cal Sans' or 'Inter' (invoice headers, branding)
- Monospace: 'JetBrains Mono' (invoice numbers, amounts, codes)

**Type Scale**:
- Display: text-4xl font-semibold (invoice titles, company name)
- Heading 1: text-2xl font-semibold (section headers)
- Heading 2: text-xl font-medium (card titles)
- Body: text-base (primary content)
- Small: text-sm (labels, metadata)
- Tiny: text-xs (captions, timestamps)

### C. Layout System

**Spacing Primitives**: Standardize on Tailwind units of **2, 4, 6, 8, 12, 16**
- Component padding: p-6 or p-8
- Section spacing: space-y-6 or space-y-8
- Card gaps: gap-4 or gap-6
- Form field spacing: space-y-4

**Container Strategy**:
- Max width: max-w-7xl for main content
- Sidebar: 280px fixed width
- Two-column forms: grid-cols-1 md:grid-cols-2 gap-6

### D. Component Library

**Navigation**:
- Sidebar navigation with icon + label
- Active state: subtle background (surface color) + primary text
- Collapsed state option for more workspace
- Top bar: breadcrumbs, search, user profile

**Forms & Inputs**:
- Input fields: h-10 with rounded-lg borders
- Select dropdowns: native styling with custom arrow icons
- Date pickers: calendar modal with range selection
- Currency selectors: dropdown with flag icons + currency codes
- File upload: drag-and-drop zone with preview

**Data Display**:
- Invoice preview: Live preview card with template switching
- Line items table: Editable inline cells, auto-calculation rows
- Summary cards: Revenue, pending, overdue with trend indicators
- Client cards: Avatar, company name, outstanding balance
- Invoice status badges: pill shape with status-specific colors

**Modals & Overlays**:
- Template selector: Grid of template previews
- Client selector: Searchable dropdown with recent clients
- Color picker: Swatches + custom hex input
- PDF preview: Full-screen modal with download/print actions

**Actions**:
- Primary buttons: Solid primary color, h-10, rounded-lg
- Secondary buttons: Outline with border-2
- Danger actions: Red background for destructive operations
- Icon buttons: 40x40px touch targets

**Invoice Templates**:
1. **Classic**: Traditional layout, left-aligned header, itemized table
2. **Modern**: Two-column layout, bold typography, color accents
3. **Minimal**: Centered layout, maximum whitespace, subtle borders
4. **Corporate**: Logo prominence, formal styling, detailed footer

### E. Animations

**Micro-interactions Only**:
- Button press: scale-95 on active state
- Hover states: Subtle background color transition (150ms)
- Loading states: Spinner for async operations
- Save success: Check mark animation with fade
- Avoid: Page transitions, scroll animations, decorative effects

---

## Page-Specific Layouts

**Dashboard**:
- 3-column metric cards (total invoices, revenue, pending)
- Recent invoices table (5 rows) with quick actions
- Client list sidebar
- Quick create FAB in bottom-right

**Invoice Editor**:
- Split view: Form on left (60%), live preview on right (40%)
- Sticky preview that scrolls independently
- Floating action bar: Save draft, Preview, Generate PDF

**Invoice List**:
- Filterable table: Status, date range, client, amount
- Bulk actions: Mark paid, send reminders, export
- Search with invoice number autocomplete

**Settings**:
- Tabbed interface: Company, Templates, Preferences, Integrations
- Logo upload with circular crop preview
- Color customization with live brand preview

---

## Images

**No hero images** - This is a productivity tool focused on functionality.

**Placeholder Images Needed**:
- Company logo placeholder: Upload zone with dashed border, centered icon
- Empty states: Illustration for "No invoices yet" (simple line art)
- Template thumbnails: Actual invoice layout screenshots (4 variants)

---

## Accessibility & Standards

- Maintain consistent dark mode across all inputs and tables
- All interactive elements minimum 44x44px touch targets
- Form validation: Inline error messages below fields
- Keyboard navigation: Tab order follows visual hierarchy
- ARIA labels for icon-only buttons
- High contrast ratios: 4.5:1 for text, 3:1 for UI components