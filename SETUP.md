# InvoiceGenius Setup Guide

## Project Overview

**InvoiceGenius** is a professional invoice generation web application built with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon serverless) with Drizzle ORM
- **Authentication**: Multi-provider OAuth (Google, GitHub, LinkedIn) + Replit Auth
- **Features**: Invoice management, client management, PDF generation, email sending, 170+ currencies

---

## Prerequisites

Before setting up the project, ensure you have:
- Node.js 18+ installed
- npm or pnpm package manager
- A Neon PostgreSQL database account (free tier available)
- At least one OAuth provider account (Google/GitHub/LinkedIn)

---

## Environment Variables Guide

### Required Variables

#### 1. **DATABASE_URL** (Required)
PostgreSQL connection string from Neon.

**Setup Steps:**
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create a new project
3. Copy the connection string (looks like `postgresql://user:password@host/database`)
4. Paste it in your `.env` file

```env
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

#### 2. **SESSION_SECRET** (Required)
A random string used to encrypt session data.

**Generate using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```env
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

#### 3. **PORT** (Optional)
The port your server will run on (default: 5000).

```env
PORT=5000
```

#### 4. **NODE_ENV** (Optional)
Environment mode (development/production).

```env
NODE_ENV=development
```

---

### Authentication Configuration

You need **at least one** OAuth provider configured. Choose from:

#### Option 1: Google OAuth

**Setup Steps:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client ID credentials
5. Add authorized redirect URIs:
   - For local: `http://localhost:5000/api/callback/google`
   - For production: `https://your-domain.com/api/callback/google`
6. Copy Client ID and Client Secret

```env
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
```

#### Option 2: GitHub OAuth

**Setup Steps:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: InvoiceGenius
   - **Homepage URL**: `http://localhost:5000` (or your domain)
   - **Authorization callback URL**: `http://localhost:5000/api/callback/github`
4. Copy Client ID and Client Secret

```env
GITHUB_CLIENT_ID=Iv1.abcdefghijklmnop
GITHUB_CLIENT_SECRET=1234567890abcdefghijklmnopqrstuvwxyz12
```

#### Option 3: LinkedIn OAuth

**Setup Steps:**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create a new app
3. In "Auth" tab, add redirect URLs:
   - `http://localhost:5000/api/callback/linkedin`
4. Request access to "Sign In with LinkedIn using OpenID Connect"
5. Copy Client ID and Client Secret

```env
LINKEDIN_CLIENT_ID=abcdefghij123456
LINKEDIN_CLIENT_SECRET=ABCDEFGHIJKLMNOP
```

#### Option 4: Replit Auth (If deploying on Replit)

**Setup Steps:**
1. Deploy on Replit
2. These variables are auto-populated by Replit
3. Just set REPLIT_DOMAINS to your Replit domain

```env
REPLIT_DOMAINS=your-app.replit.dev
REPL_ID=auto-populated-by-replit
ISSUER_URL=https://replit.com/oidc
REPL_IDENTITY=auto-populated-by-replit
WEB_REPL_RENEWAL=auto-populated-by-replit
```

For local development, just set:
```env
REPLIT_DOMAINS=localhost
```

---

### Email Configuration (Optional)

For sending invoices via email using Resend:

#### If using Replit:
1. Connect Resend in Replit Connectors UI
2. Environment variables auto-populated

```env
REPLIT_CONNECTORS_HOSTNAME=auto-populated-by-replit
```

#### If NOT using Replit:
You'll need to modify `server/email.ts` to use direct Resend API integration:

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Modify `server/email.ts` to use the API key directly

---

## Installation Steps

### 1. Clone and Install Dependencies

```bash
cd InvoiceGenius
npm install
```

### 2. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and fill in your values
# At minimum, you need:
# - DATABASE_URL
# - SESSION_SECRET
# - At least one OAuth provider (GOOGLE_CLIENT_ID + SECRET, or GITHUB, or LINKEDIN)
```

### 3. Initialize Database

```bash
# Push the schema to your database
npm run db:push
```

This creates all necessary tables:
- `sessions` - Session storage
- `users` - User profiles
- `clients` - Customer information
- `invoices` - Invoice metadata
- `line_items` - Invoice line items
- `company_settings` - User branding/settings
- `estimates` - Quote/estimate documents
- `estimate_line_items` - Estimate line items
- `expenses` - Expense tracking

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

---

## Project Structure

```
InvoiceGenius/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities
├── server/              # Express backend
│   ├── index.ts        # Server entry point
│   ├── routes.ts       # API routes
│   ├── db.ts           # Database connection
│   ├── replitAuth.ts   # Authentication logic
│   ├── email.ts        # Email integration
│   └── storage.ts      # Data access layer
├── shared/             # Shared code
│   ├── schema.ts       # Database schema + Zod validation
│   └── currencies.ts   # Currency definitions
└── .env                # Environment variables (not committed)
```

---

## Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm start           # Start production server

# Database
npm run db:push     # Push schema changes to database

# Type Checking
npm run check       # Run TypeScript type checking
```

---

## Features Overview

### 1. **Multi-User Support**
- Each user has isolated data (clients, invoices, settings)
- Secure OAuth authentication
- Session-based authentication with 30-day expiration

### 2. **Client Management**
- Add/edit/delete clients
- Store contact information and tax IDs
- Track client history

### 3. **Invoice Management**
- Create professional invoices
- Multiple templates (Modern, Classic, Minimal)
- Multi-currency support (170+ currencies)
- Tax and discount calculations
- Draft, sent, paid status tracking

### 4. **PDF Generation**
- Client-side PDF generation with jsPDF
- Company logo embedding
- Matches invoice preview design

### 5. **Email Integration**
- Send invoices directly to clients
- Professional email templates
- PDF attachments

### 6. **Company Branding**
- Upload company logo
- Customize colors
- Set invoice numbering
- International banking information

### 7. **Dashboard**
- Real-time metrics
- Revenue tracking
- Outstanding invoices

---

## Common Issues & Solutions

### Issue: Database connection fails
**Solution**: 
- Verify DATABASE_URL is correct
- Ensure your IP is allowed in Neon console
- Check if database exists

### Issue: OAuth callback fails
**Solution**:
- Verify redirect URIs match exactly in OAuth provider settings
- Check that CLIENT_ID and CLIENT_SECRET are correct
- Ensure REPLIT_DOMAINS is set correctly

### Issue: Session expires immediately
**Solution**:
- Generate a new SESSION_SECRET
- Clear browser cookies
- Restart the server

### Issue: Email sending fails
**Solution**:
- Check REPLIT_CONNECTORS_HOSTNAME is set
- Verify Resend is connected in Replit
- Or modify email.ts for direct API integration

---

## Production Deployment

### Deploying to Replit

1. Push code to Replit
2. Set environment variables in Secrets
3. Connect Resend in Connectors
4. Run `npm run db:push`
5. Deploy!

### Deploying to Other Platforms (Vercel, Railway, etc.)

1. Set all environment variables in platform settings
2. Modify OAuth callback URLs to match your domain
3. Run database migrations
4. Deploy!

**Important**: Update OAuth redirect URIs in all provider settings to match your production domain.

---

## Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore` by default
2. **Use strong SESSION_SECRET** - Minimum 32 characters, random
3. **Enable HTTPS in production** - Required for OAuth
4. **Regularly rotate secrets** - Especially if compromised
5. **Limit OAuth scopes** - Only request necessary permissions

---

## Support & Documentation

- **Database**: [Neon Documentation](https://neon.tech/docs)
- **Drizzle ORM**: [Drizzle Documentation](https://orm.drizzle.team/docs/overview)
- **Passport.js**: [Passport Documentation](http://www.passportjs.org/docs/)
- **shadcn/ui**: [shadcn/ui Documentation](https://ui.shadcn.com/)
- **React Query**: [TanStack Query Docs](https://tanstack.com/query/latest)

---

## Next Steps

1. ✅ Complete `.env` setup
2. ✅ Run `npm install`
3. ✅ Run `npm run db:push`
4. ✅ Start development with `npm run dev`
5. 🎉 Build amazing invoices!

---

## License

MIT
