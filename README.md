# 🧾 InvoiceGenius

> Professional invoice generation and management system with multi-currency support, customizable branding, and seamless OAuth authentication.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192.svg)](https://neon.tech/)

---

## ✨ Features

### 🎨 Professional Invoice Management
- **Multiple Templates** - Modern, Classic, and Minimal designs
- **Multi-Currency** - Support for 170+ global currencies
- **PDF Export** - Client-side PDF generation with company branding
- **Email Delivery** - Send invoices directly to clients with professional templates

### 👥 Client Management
- Comprehensive client database with contact information
- Tax ID and address tracking
- Client-specific invoice history

### 🔐 Secure Authentication
- **Multi-Provider OAuth** - Google, GitHub, LinkedIn authentication
- **Session Management** - PostgreSQL-backed sessions with 30-day expiration
- **User Isolation** - Complete data separation between users

### 📊 Business Insights
- Real-time dashboard with revenue metrics
- Invoice status tracking (Draft, Sent, Paid, Overdue)
- Outstanding balance monitoring

### 🎨 Customizable Branding
- Company logo upload (PNG/JPEG)
- Custom color schemes
- Configurable invoice numbering
- International banking information

### 💼 Additional Features
- Tax and discount calculations
- Line-item level pricing
- Recurring invoice support (upcoming)
- Expense tracking (upcoming)
- Estimates/Quotes (upcoming)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- OAuth provider credentials (Google/GitHub/LinkedIn)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/InvoiceGenius.git
cd InvoiceGenius

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# 4. Initialize database
npm run db:push

# 5. Start development server
npm run dev
```

Visit `http://localhost:5000` 🎉

---

## 📋 Environment Setup

Create a `.env` file with the following variables:

```env
# Required
DATABASE_URL=postgresql://user:password@host/database
SESSION_SECRET=your-random-32-character-secret

# At least one OAuth provider (choose one or more)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

📖 **Detailed setup instructions**: See [SETUP.md](./SETUP.md)

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI framework with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **TanStack Query** - Server state management
- **Wouter** - Lightweight routing

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type-safe APIs
- **Passport.js** - Authentication middleware
- **Drizzle ORM** - Type-safe database queries
- **Zod** - Schema validation

### Database & Storage
- **PostgreSQL** - Primary database (Neon serverless)
- **Drizzle ORM** - Database toolkit
- **connect-pg-simple** - Session storage

### External Services
- **OAuth Providers** - Google, GitHub, LinkedIn
- **Resend** - Email delivery (optional)
- **jsPDF** - PDF generation

---

## 📁 Project Structure

```
InvoiceGenius/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   └── examples/ # Feature components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilities
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Entry point
│   ├── routes.ts         # API routes
│   ├── db.ts             # Database connection
│   ├── replitAuth.ts     # OAuth authentication
│   ├── email.ts          # Email integration
│   └── storage.ts        # Data access layer
├── shared/               # Shared types & schemas
│   ├── schema.ts         # Database schema
│   └── currencies.ts     # Currency definitions
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment template
└── package.json
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build            # Build client and server
npm start                # Start production server

# Database
npm run db:push          # Push schema to database

# Type Checking
npm run check            # Run TypeScript compiler
```

---

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - User profiles from OAuth
- **sessions** - Authentication sessions
- **clients** - Customer information
- **invoices** - Invoice metadata and status
- **line_items** - Invoice line items
- **company_settings** - User-specific branding
- **estimates** - Quotes/estimates (upcoming)
- **expenses** - Expense tracking (upcoming)

All data is isolated per user with foreign key constraints ensuring data integrity.

---

## 🔒 Security

- **OAuth 2.0** - Industry-standard authentication
- **Session Management** - Secure, httpOnly cookies
- **User Isolation** - Database-level data separation
- **Input Validation** - Zod schemas on all inputs
- **HTTPS Required** - In production environments

---

## 🎨 Design Philosophy

InvoiceGenius follows a **Linear-inspired minimalist design** with **Stripe dashboard sophistication**:

- Clean, professional aesthetics
- Consistent spacing and typography
- Semantic color coding (blue=primary, green=paid, amber=pending, red=overdue)
- Responsive, mobile-first design
- Accessible UI components (Radix UI primitives)

---

## 📝 API Routes

### Authentication
- `GET /api/login` - Initiate OAuth flow
- `GET /api/callback` - OAuth callback
- `GET /api/logout` - Sign out
- `GET /api/auth/user` - Get current user

### Clients
- `GET /api/clients` - List all clients
- `GET /api/clients/:id` - Get client details
- `POST /api/clients` - Create client
- `PATCH /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get invoice details
- `POST /api/invoices` - Create invoice
- `PATCH /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/send` - Email invoice

### Settings
- `GET /api/settings` - Get company settings
- `POST /api/settings` - Update settings

All routes except `/api/login` require authentication.

---

## 🛣️ Roadmap

- [x] Multi-provider OAuth authentication
- [x] Client management
- [x] Invoice creation and editing
- [x] PDF generation
- [x] Email delivery
- [x] Company branding
- [x] Dashboard analytics
- [ ] Recurring invoices
- [ ] Estimates/Quotes
- [ ] Expense tracking
- [ ] Payment integration (Stripe)
- [ ] Multi-language support
- [ ] Advanced reporting

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Radix UI** - Accessible primitives
- **Neon** - Serverless PostgreSQL
- **Drizzle ORM** - Type-safe database toolkit
- **TanStack Query** - Powerful data synchronization

---

## 📧 Support

For detailed setup instructions, see [SETUP.md](./SETUP.md)

For questions or issues, please open an issue on GitHub.

---

<div align="center">
  <strong>Built with ❤️ by ArwaaLabs</strong>
  <br />
  <sub>Making invoicing genius, one invoice at a time</sub>
</div>
