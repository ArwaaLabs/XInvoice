# Invoice Generator

## Overview

A professional invoice generation web application built with React, Express, and in-memory storage. The system enables users to create, manage, and export invoices with multi-currency support, customizable branding, and PDF generation capabilities. The application follows a Linear-inspired minimalist design approach with Stripe's dashboard sophistication, emphasizing clarity and professionalism.

**Latest Updates (October 2025)**
- ✅ Full backend API integration with in-memory storage
- ✅ Complete CRUD operations for clients, invoices, and company settings
- ✅ Multi-currency support with proper currency grouping and display
- ✅ PDF generation for invoice downloads
- ✅ Professional dashboard with real-time metrics
- ✅ Date validation using z.coerce.date() for flexible API inputs

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing instead of React Router

**UI Component System**
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, tooltips, etc.)
- shadcn/ui design system with "new-york" style variant
- Tailwind CSS for utility-first styling with custom CSS variables for theming
- Class Variance Authority (CVA) for component variant management

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Custom query client configured with optimistic UI patterns
- Local component state with React hooks for UI-specific state

**Design System**
- Custom color palette supporting light/dark modes via CSS variables
- Typography scale using Inter (UI text), JetBrains Mono (invoice numbers/amounts)
- Professional color scheme: blue primary (#3B82F6), semantic status colors (green/paid, amber/pending, red/overdue)
- Consistent spacing, border radius, and elevation system

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type-safe API development
- ESM module system throughout the stack
- Custom middleware for request logging and error handling

**API Design Pattern**
- RESTful API structure with resource-based endpoints
- CRUD operations for clients, invoices, line items, and company settings
- Zod schema validation for request/response data integrity
- Standardized error responses with appropriate HTTP status codes

**Storage Layer**
- Abstract IStorage interface defining data access contracts
- In-memory storage implementation (MemStorage) for development/testing
- Designed for easy migration to PostgreSQL via Drizzle ORM
- UUID-based primary keys for distributed system compatibility

**Database Schema (Drizzle ORM)**
- `clients` table: Customer information with contact details and tax ID
- `invoices` table: Invoice metadata including status, dates, currency, tax/discount configuration
- `line_items` table: Individual invoice items with quantity, pricing, and item-level tax/discount
- `company_settings` table: Singleton for branding, contact info, and invoice numbering

### External Dependencies

**Database & ORM**
- PostgreSQL as the production database (Neon serverless driver)
- Drizzle ORM for type-safe database queries and migrations
- Drizzle-Zod for automatic schema validation from database schema
- Connection pooling via Neon serverless for scalability

**PDF Generation**
- jsPDF library for client-side PDF generation
- Custom PDF template matching invoice preview design
- Supports multi-page invoices with automatic pagination

**Date & Number Formatting**
- date-fns for consistent date formatting and manipulation
- Decimal precision handling for financial calculations (10,2 for amounts, 5,2 for rates)

**Development Tools**
- tsx for TypeScript execution in development
- esbuild for production server bundling
- Replit-specific plugins for development environment integration (cartographer, dev-banner, runtime-error-modal)

**Session Management**
- connect-pg-simple for PostgreSQL-backed session storage
- Designed for future authentication integration

### Key Architectural Decisions

**Monorepo Structure**
- Shared schema definitions between client and server via `@shared` path alias
- Single TypeScript configuration with path mapping for clean imports
- Unified build process with separate client/server outputs

**Type Safety**
- End-to-end TypeScript with strict mode enabled
- Zod schemas as single source of truth for validation
- Drizzle-Zod integration for automatic type inference from database

**Separation of Concerns**
- Storage abstraction allows swapping implementations without changing business logic
- Component composition with shadcn/ui for maintainable UI code
- API client abstraction with centralized error handling

**Performance Optimizations**
- React Query for intelligent caching and background refetching
- Vite's code splitting and lazy loading capabilities
- CSS-in-JS avoided in favor of Tailwind for better performance

**Responsive Design**
- Mobile-first approach with custom breakpoint hooks
- Sidebar collapses to sheet on mobile devices
- Touch-optimized interactions for mobile invoice editing