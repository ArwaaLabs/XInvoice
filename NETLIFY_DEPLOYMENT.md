# Netlify Deployment Guide - InvoiceGenius

## 🚀 Fixed: 404 Error on Netlify

### Problem
When deploying a Single Page Application (SPA) to Netlify, navigating directly to routes like `/invoices`, `/clients`, or `/settings` resulted in a 404 error.

### Root Cause
Netlify was trying to find actual files for these routes instead of letting React Router handle them.

### Solution Implemented ✅

We've implemented **two layers of protection** to ensure proper routing:

#### 1. **netlify.toml Configuration**
```toml
[build]
  command = "npm run build"
  publish = "dist/public"

[functions]
  external_node_modules = ["express"]
  node_bundler = "esbuild"

# API routes - must come first
[[redirects]]
  force = true
  from = "/api/*"
  status = 200
  to = "/.netlify/functions/api/:splat"

# SPA fallback - must come last
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. **_redirects File** (Backup)
Located at: `client/public/_redirects`
```
# API routes to serverless functions
/api/*  /.netlify/functions/api/:splat  200

# SPA fallback
/*  /index.html  200
```

---

## 📋 Deployment Steps

### Step 1: Ensure Latest Code is Committed
```bash
git add .
git commit -m "Fix: Add Netlify SPA routing configuration"
git push origin main
```

### Step 2: Deploy to Netlify

#### Option A: Automatic Deployment (Recommended)
If you have Netlify connected to your Git repository:
1. Push your code to GitHub/GitLab
2. Netlify will automatically detect the changes and deploy
3. Wait for the build to complete (~2-3 minutes)

#### Option B: Manual Deployment via Netlify CLI
```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

### Step 3: Verify Environment Variables
Ensure these are set in Netlify Dashboard → Site settings → Environment variables:

**Required:**
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `SESSION_SECRET` - Random secure string for sessions
- `NODE_ENV` - Set to `production`

**Optional (for OAuth):**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` - Should be `https://your-site.netlify.app/api/auth/google/callback`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `GITHUB_REDIRECT_URI` - Should be `https://your-site.netlify.app/api/auth/github/callback`

---

## 🧪 Testing After Deployment

### Test All Routes:
1. **Home/Dashboard**: `https://your-site.netlify.app/`
2. **Invoices**: `https://your-site.netlify.app/invoices`
3. **Clients**: `https://your-site.netlify.app/clients`
4. **Settings**: `https://your-site.netlify.app/settings`
5. **Direct Invoice**: `https://your-site.netlify.app/invoice/123`

### Test API Endpoints:
1. `https://your-site.netlify.app/api/invoices` - Should work
2. `https://your-site.netlify.app/api/clients` - Should work
3. `https://your-site.netlify.app/api/settings` - Should work

### Test Language Switching:
1. Click language selector (🌐)
2. Switch to Arabic/Urdu → Layout should flip to RTL
3. Switch to Hindi → Layout should stay LTR
4. Refresh page → Language should persist

---

## 🔧 Build Configuration Details

### Build Settings in Netlify Dashboard:
```
Build command: npm run build
Publish directory: dist/public
Functions directory: netlify/functions (auto-detected)
```

### What Happens During Build:
1. **Frontend Build**: Vite compiles React app → `dist/public/`
2. **Backend Build**: esbuild compiles Express server → `dist/index.js`
3. **Serverless Functions**: Netlify wraps your Express API as a function
4. **Static Assets**: HTML, CSS, JS, fonts copied to `dist/public/`
5. **Redirects**: `_redirects` file copied to build output

---

## 🐛 Troubleshooting

### Issue: Still Getting 404 Errors
**Solution:**
1. Clear Netlify's cache: Site settings → Build & deploy → Clear cache and deploy site
2. Check the `_redirects` file exists in your deployed site:
   - Go to `https://your-site.netlify.app/_redirects`
   - Should see the redirect rules
3. Verify `netlify.toml` is in the root of your repository

### Issue: API Routes Not Working
**Solution:**
1. Check Functions logs in Netlify Dashboard
2. Ensure `DATABASE_URL` is set correctly
3. Verify your Express app is properly exported in `server/index.ts`

### Issue: Environment Variables Not Working
**Solution:**
1. Don't use `.env` file in production
2. Set all variables in Netlify Dashboard
3. Redeploy after changing environment variables

### Issue: Language Not Persisting
**Solution:**
- This is normal - localStorage is browser-specific
- Each device/browser needs to select language once
- The selection persists for that browser

### Issue: Fonts Not Loading
**Solution:**
- Google Fonts CDN might be blocked in some regions
- Fonts are imported in `client/src/index.css`
- Check browser console for CORS errors

---

## 📊 Deployment Checklist

Before deploying, ensure:

- [x] `netlify.toml` is configured correctly
- [x] `_redirects` file exists in `client/public/`
- [x] `vite.config.ts` has correct `publicDir` setting
- [x] Environment variables are set in Netlify Dashboard
- [x] Database is accessible from Netlify (check IP whitelist if using restricted DB)
- [x] All dependencies are in `package.json`
- [x] Build command works locally: `npm run build`
- [x] Git repository is clean and pushed

---

## 🎯 Expected Build Output

After successful build:
```
dist/
├── public/               # Frontend static files
│   ├── index.html       # Main HTML file
│   ├── assets/          # JS, CSS, fonts
│   ├── _redirects       # Routing rules
│   └── ...
└── index.js             # Backend serverless function
```

---

## 🌐 Post-Deployment Verification

### 1. Check Build Logs
- Netlify Dashboard → Deploys → Latest deploy
- Look for "Deploy succeeded" message
- Check for any warnings or errors

### 2. Test Functionality
```bash
# Test routes (replace with your URL)
curl https://your-site.netlify.app/
curl https://your-site.netlify.app/invoices
curl https://your-site.netlify.app/api/invoices
```

### 3. Test in Browser
- Open in incognito mode
- Test all routes manually
- Check browser console for errors
- Test language switching
- Test creating an invoice

---

## 📝 Common Netlify Settings

### Recommended Netlify Settings:

**Deploy Settings:**
- Branch to deploy: `main`
- Build command: `npm run build`
- Publish directory: `dist/public`
- Production branch: `main`

**Build Settings:**
- Node version: 18.x or higher (auto-detected from .nvmrc or package.json)
- Package manager: npm

**Performance:**
- Asset optimization: Enabled
- Pretty URLs: Disabled (SPA handles routing)
- HTTPS: Enabled

---

## 🚀 Continuous Deployment

With this setup, every push to your main branch will:
1. Trigger automatic deployment
2. Run `npm run build`
3. Deploy to production
4. All routes will work correctly
5. API endpoints will function properly

---

## 🎉 You're Done!

Your InvoiceGenius app is now properly configured for Netlify deployment with:

✅ SPA routing (no more 404s)  
✅ API endpoints via serverless functions  
✅ Multi-language support  
✅ RTL layout for Arabic/Urdu  
✅ Persistent language preferences  
✅ Automatic deployments  

**Test your deployed site thoroughly and enjoy! 🌍✨**

---

## 📞 Need Help?

If you encounter issues:
1. Check Netlify function logs
2. Review build logs for errors
3. Verify environment variables
4. Test API endpoints separately
5. Check browser console for client errors

**Common URLs to check:**
- Netlify Dashboard: https://app.netlify.com
- Function Logs: Dashboard → Functions → Your function
- Deploy Logs: Dashboard → Deploys → Latest deploy
- Environment Variables: Dashboard → Site settings → Environment variables
