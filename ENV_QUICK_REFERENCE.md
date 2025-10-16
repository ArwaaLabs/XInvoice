# 🔑 Environment Variables Quick Reference

## Minimum Required Setup

To get InvoiceGenius running, you need **at minimum**:

```env
DATABASE_URL=postgresql://user:password@host/database
SESSION_SECRET=random-32-character-string
```

**Plus ONE of these OAuth providers:**

### Option 1: Google OAuth ✅ Recommended
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Option 2: GitHub OAuth
```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### Option 3: LinkedIn OAuth
```env
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

---

## 🚀 Quick Setup Checklist

### Step 1: Database (Required)
- [ ] Sign up at [neon.tech](https://neon.tech)
- [ ] Create a new project
- [ ] Copy connection string to `DATABASE_URL`

### Step 2: Session Secret (Required)
- [ ] Generate random string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Paste result into `SESSION_SECRET`

### Step 3: OAuth Provider (Pick One)
- [ ] Set up Google OAuth at [console.cloud.google.com](https://console.cloud.google.com/apis/credentials)
- [ ] OR GitHub at [github.com/settings/developers](https://github.com/settings/developers)
- [ ] OR LinkedIn at [linkedin.com/developers](https://www.linkedin.com/developers/apps)
- [ ] Add credentials to `.env`

### Step 4: Initialize & Run
```bash
npm install
npm run db:push
npm run dev
```

---

## 📋 Full Variable List

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ Yes | - | PostgreSQL connection string |
| `SESSION_SECRET` | ✅ Yes | - | Random string for session encryption |
| `PORT` | ❌ No | `5000` | Server port |
| `NODE_ENV` | ❌ No | `development` | Environment mode |
| `GOOGLE_CLIENT_ID` | ⚠️ One OAuth | - | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ⚠️ One OAuth | - | Google OAuth secret |
| `GITHUB_CLIENT_ID` | ⚠️ One OAuth | - | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | ⚠️ One OAuth | - | GitHub OAuth secret |
| `LINKEDIN_CLIENT_ID` | ⚠️ One OAuth | - | LinkedIn OAuth client ID |
| `LINKEDIN_CLIENT_SECRET` | ⚠️ One OAuth | - | LinkedIn OAuth secret |
| `REPLIT_DOMAINS` | ❌ No | `localhost` | Replit domain(s) for callbacks |
| `REPL_ID` | ❌ No | - | Replit project ID |
| `ISSUER_URL` | ❌ No | `https://replit.com/oidc` | OIDC issuer |
| `REPLIT_CONNECTORS_HOSTNAME` | ❌ No | - | Resend connector hostname |

⚠️ **At least ONE OAuth provider must be configured**

---

## 🔍 Where to Get OAuth Credentials

### Google OAuth
1. **Console**: [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. **Steps**:
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:5000/api/callback/google`
   - Copy Client ID and Secret
3. **Scopes**: `email`, `profile`

### GitHub OAuth
1. **Console**: [github.com/settings/developers](https://github.com/settings/developers)
2. **Steps**:
   - New OAuth App
   - Callback URL: `http://localhost:5000/api/callback/github`
   - Copy Client ID and Secret
3. **Scopes**: `user:email`

### LinkedIn OAuth
1. **Console**: [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps)
2. **Steps**:
   - Create new app
   - Add redirect URL: `http://localhost:5000/api/callback/linkedin`
   - Request "Sign In with LinkedIn using OpenID Connect"
   - Copy Client ID and Secret
3. **Scopes**: `openid`, `email`, `profile`

---

## ⚠️ Common Mistakes

### ❌ Wrong: Spaces in SESSION_SECRET
```env
SESSION_SECRET=my secret key with spaces
```

### ✅ Right: No spaces, random characters
```env
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

---

### ❌ Wrong: Missing OAuth provider
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=abc123...
# No OAuth provider configured!
```

### ✅ Right: At least one OAuth provider
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=abc123...
GOOGLE_CLIENT_ID=123456...
GOOGLE_CLIENT_SECRET=GOCSPX-...
```

---

### ❌ Wrong: Incorrect redirect URI
OAuth Provider Setting: `http://localhost:3000/callback`
Your App: Running on port `5000`

### ✅ Right: Matching redirect URI
OAuth Provider Setting: `http://localhost:5000/api/callback/google`
Your App: Running on port `5000`

---

## 🔐 Security Checklist

- [ ] Never commit `.env` file to git (check `.gitignore`)
- [ ] Use minimum 32-character SESSION_SECRET
- [ ] Generate SESSION_SECRET with crypto, not "password123"
- [ ] Use different SESSION_SECRET for dev/production
- [ ] Enable HTTPS in production
- [ ] Rotate secrets if compromised

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` format: `postgresql://user:password@host/database`
- Verify database exists in Neon console
- Check if IP is allowed (Neon allows all by default)

### "Unauthorized" on login
- Verify OAuth credentials are correct
- Check redirect URI matches exactly (including protocol, port, path)
- Clear browser cookies and try again

### "Session expired immediately"
- Generate new `SESSION_SECRET`
- Restart server
- Clear browser cookies

### "Email sending failed"
- Email is optional for basic functionality
- Check Resend configuration if needed
- Or modify `server/email.ts` for direct API integration

---

## 📝 Example .env File

```env
# Database (Required)
DATABASE_URL=postgresql://myuser:mypass@ep-cool-cloud-123456.us-east-2.aws.neon.tech/mydb

# Session (Required)
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Google OAuth (Required - Choose One)
GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-AbCdEfGhIjKlMnOpQrStUvWxYz

# Optional
PORT=5000
NODE_ENV=development
REPLIT_DOMAINS=localhost
```

---

## 🎯 Next Steps After Setup

1. **Run database migration**:
   ```bash
   npm run db:push
   ```

2. **Start development**:
   ```bash
   npm run dev
   ```

3. **Visit**: `http://localhost:5000`

4. **Sign in** with configured OAuth provider

5. **Start creating invoices!** 🎉

---

**Need more help?** See [SETUP.md](./SETUP.md) for detailed instructions.
