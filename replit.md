# Invoice Generator

## Overview

A professional invoice generation web application built with React, Express, and PostgreSQL. The system enables users to create, manage, and export invoices with multi-currency support, customizable branding, and PDF generation capabilities. Features Google authentication via Replit Auth for secure user access. The application follows a Linear-inspired minimalist design approach with Stripe's dashboard sophistication, emphasizing clarity and professionalism.

**Latest Updates (October 15, 2025)**
- ✅ **Multi-Provider OAuth**: Direct authentication with Google, GitHub, and LinkedIn (not via Replit Auth)
- ✅ **Google OAuth**: passport-google-oauth20 with email/profile scopes
- ✅ **GitHub OAuth**: passport-github2 with user:email scope
- ✅ **LinkedIn OAuth**: passport-linkedin-oauth2 with OpenID Connect (openid, profile, email scopes)
- ✅ **PostgreSQL Database**: Migrated from in-memory to PostgreSQL with Drizzle ORM for persistent storage
- ✅ **User Data Isolation**: All clients, invoices, and settings are user-specific with foreign key constraints
- ✅ **Session Management**: PostgreSQL-backed sessions with 30-day expiration
- ✅ **Landing Page**: Professional landing page with three OAuth provider buttons
- ✅ **Protected Routes**: All API endpoints require authentication with isAuthenticated middleware
- ✅ **Account Information**: Indian banking details (Bank Name, Account Number, IFSC Code, SWIFT Code) in company settings
- ✅ **Logo Display**: Company logo displays on invoice preview and PDF exports (PNG/JPEG support)
- ✅ Multi-currency support with proper currency grouping and display
- ✅ PDF generation with logo embedding and format auto-detection
- ✅ Professional dashboard with real-time metrics
- ✅ Settings page with template persistence, logo upload, color picker, and account information

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
- DatabaseStorage implementation using PostgreSQL via Drizzle ORM
- All data operations scoped by userId for multi-tenant isolation
- UUID-based primary keys for distributed system compatibility

**Authentication System**
- Direct OAuth integration with Google, GitHub, and LinkedIn
- passport-google-oauth20 for Google authentication
- passport-github2 for GitHub authentication  
- passport-linkedin-oauth2 for LinkedIn authentication with OpenID Connect
- PostgreSQL-backed session storage with connect-pg-simple
- 30-day session expiration with automatic validation
- Middleware-based route protection (isAuthenticated)
- User IDs prefixed by provider (google:, github:, linkedin:)

**Database Schema (Drizzle ORM)**
- `users` table: User profiles from OAuth (id, email, firstName, lastName, profileImageUrl)
- `sessions` table: Session storage for authentication state
- `clients` table: Customer information with contact details and tax ID (linked to userId)
- `invoices` table: Invoice metadata including status, dates, currency, tax/discount (linked to userId and clientId)
- `line_items` table: Individual invoice items with quantity, pricing (linked to invoiceId)
- `company_settings` table: Per-user branding, contact info, and invoice numbering (linked to userId)

**Foreign Key Constraints**
- `clients.userId` → `users.id` (cascade delete)
- `invoices.userId` → `users.id` (cascade delete)
- `invoices.clientId` → `clients.id` (restrict delete to prevent orphaned invoices)
- `line_items.invoiceId` → `invoices.id` (cascade delete)
- `company_settings.userId` → `users.id` (cascade delete, unique per user)

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

**Authentication Dependencies**
- passport for authentication middleware
- openid-client for OAuth/OpenID Connect protocol
- connect-pg-simple for PostgreSQL-backed session storage
- memoizee for OIDC configuration caching

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
- Storage abstraction with user-scoped data access
- Component composition with shadcn/ui for maintainable UI code
- API client abstraction with centralized error handling
- Authentication state management via useAuth hook

**Security Architecture**
- All API routes protected with isAuthenticated middleware
- JWT-based authentication with automatic token refresh
- Session cookies with httpOnly and secure flags
- User data isolation enforced at database level with foreign keys
- CSRF protection via session management

**Performance Optimizations**
- React Query for intelligent caching and background refetching
- Vite's code splitting and lazy loading capabilities
- CSS-in-JS avoided in favor of Tailwind for better performance

**Responsive Design**
- Mobile-first approach with custom breakpoint hooks
- Sidebar collapses to sheet on mobile devices
- Touch-optimized interactions for mobile invoice editing