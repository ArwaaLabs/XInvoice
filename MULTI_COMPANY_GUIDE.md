# Multi-Company Support

This document describes the multi-company feature that allows users to manage multiple companies and select which company to use when creating invoices.

## Overview

Users can now:
- Add multiple company profiles
- Edit and delete companies
- Set a primary company (used by default)
- Select which company to use when creating an invoice
- Each company has its own invoice numbering sequence

## Features

### Company Management (Settings Page)

1. **Add New Company**
   - Click "Add Company" button
   - Fill in company details (name, email, phone, address, tax ID, logo, etc.)
   - Configure invoice settings (prefix, starting number)
   - Set banking information
   - Choose invoice template

2. **Edit Company**
   - Select a company from the dropdown
   - Modify any company details
   - Click "Save Changes"

3. **Delete Company**
   - Select a company to delete
   - Click the "Delete" button
   - Confirm deletion
   - Note: You cannot delete your only company
   - If you delete the primary company, another will automatically become primary

4. **Set Primary Company**
   - Select a company
   - Click "Set as Primary"
   - The primary company is used by default when creating new invoices

### Invoice Creation

1. **Company Selector**
   - When creating an invoice, you'll see a "Company" dropdown
   - Select which company the invoice should be from
   - The primary company is selected by default
   - You can add a new company directly from this dropdown

2. **Company-Specific Settings**
   - Each company has its own invoice prefix and numbering
   - Invoice numbers increment independently for each company
   - Example: Company A uses "INV-1001", Company B uses "ACME-2001"

## Database Schema Changes

### company_settings table
- Removed unique constraint on `user_id` (allows multiple companies per user)
- Added `is_primary` column (TEXT, default 'false') - marks the default company
- Added `is_active` column (TEXT, default 'true') - for soft delete
- Added `created_at` column (TIMESTAMP) - tracks when company was created

### invoices table
- Added `company_id` column (VARCHAR, nullable) - references which company the invoice belongs to
- Foreign key to `company_settings.id` with ON DELETE SET NULL

## API Endpoints

### Company Management
- `GET /api/companies` - Get all active companies for the user
- `GET /api/companies/:id` - Get a specific company
- `POST /api/companies` - Create a new company
- `PATCH /api/companies/:id` - Update a company
- `DELETE /api/companies/:id` - Soft delete a company
- `POST /api/companies/:id/set-primary` - Set a company as primary

### Legacy Endpoints (for backward compatibility)
- `GET /api/settings` - Returns the primary company
- `POST /api/settings` - Creates or updates the primary company

## Migration

To migrate your existing database, run the migration script:

```bash
psql -U your_username -d your_database -f migrations/001_multi_company_support.sql
```

Or if using a migration tool, the migration will:
1. Remove the unique constraint on `company_settings.user_id`
2. Add `is_primary`, `is_active`, and `created_at` columns
3. Set existing companies as primary and active
4. Add `company_id` column to invoices table
5. Link existing invoices to their user's primary company

## Components

### CompanySelector
A reusable component for selecting companies, similar to ClientSelector.

**Props:**
- `companies: CompanySettings[]` - List of companies
- `value?: string` - Currently selected company ID
- `onSelect: (companyId: string) => void` - Callback when company is selected
- `onAddCompany: (company) => void` - Callback to add a new company

**Features:**
- Search/filter companies
- Shows primary company badge
- Inline company creation

## Best Practices

1. **Primary Company**: Always keep one company marked as primary - it's used as the default
2. **Invoice Numbering**: Each company maintains its own invoice number sequence
3. **Soft Delete**: Companies are soft-deleted (marked inactive) rather than hard-deleted to preserve data integrity
4. **Company Selection**: Always select a company when creating invoices to ensure proper branding and numbering

## Troubleshooting

**Q: I can't delete my only company**
A: You must have at least one active company. Add another company first, then delete the unwanted one.

**Q: Invoice numbers are not incrementing**
A: Each company has its own `nextInvoiceNumber`. Make sure you're editing the correct company settings.

**Q: My primary company changed unexpectedly**
A: If you delete a primary company, the system automatically promotes another company to primary.

## Future Enhancements

Potential improvements for the multi-company feature:
- Company-specific templates
- Company-specific tax rates and currencies
- Bulk import of company profiles
- Company groups/categories
- Company-specific client lists
- Analytics per company
