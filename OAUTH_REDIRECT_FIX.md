# ✅ OAuth Redirect to Localhost - FIXED!

## Problem
After logging in with OAuth (Google/GitHub), it redirected to `localhost:5000` instead of your Netlify domain.

## Solution Applied ✅

### Code Changes:
Updated `server/replitAuth.ts` to automatically detect the correct domain:

1. **Added `getCurrentDomain()` function**:
   - Checks Netlify environment variables (`URL`, `DEPLOY_PRIME_URL`)
   - Falls back to `REPLIT_DOMAINS` if set
   - Uses `localhost:5000` for local development

2. **Added `getProtocol()` function**:
   - Returns `https` for production domains
   - Returns `http` for localhost

3. **Updated all OAuth callback URLs**:
   - Now dynamically constructed based on environment
   - Works automatically on Netlify, Replit, or localhost

---

## 🔧 Update OAuth Provider Settings

You **MUST** update your OAuth redirect URIs in each provider's dashboard:

### Google OAuth Console
1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your OAuth 2.0 Client ID
3. Under "Authorized redirect URIs", add:
   ```
   https://your-site.netlify.app/api/callback/google
   ```
4. **Remove or keep** `http://localhost:5000/api/callback/google` for local testing
5. Click **Save**

### GitHub OAuth Apps
1. Go to: https://github.com/settings/developers
2. Select your OAuth App
3. Update "Authorization callback URL" to:
   ```
   https://your-site.netlify.app/api/callback/github
   ```
4. Click **Update application**

### LinkedIn OAuth
1. Go to: https://www.linkedin.com/developers/apps
2. Select your app
3. Under "Auth" tab, update "Redirect URLs":
   ```
   https://your-site.netlify.app/api/callback/linkedin
   ```
4. Click **Update**

---

## 📝 Environment Variables (Optional)

Netlify automatically sets these variables, but you can override if needed:

```bash
# Netlify sets these automatically:
URL=https://your-site.netlify.app
DEPLOY_PRIME_URL=https://deploy-preview-123--your-site.netlify.app

# Only set if you need to override:
REPLIT_DOMAINS=your-custom-domain.com
```

---

## ✅ How It Works Now

### Production (Netlify):
```
User clicks "Login with Google"
   ↓
Google auth page
   ↓
User authorizes
   ↓
Redirects to: https://your-site.netlify.app/api/callback/google
   ↓
Session created
   ↓
Redirects to: https://your-site.netlify.app/
   ↓
User is logged in! ✅
```

### Local Development:
```
User clicks "Login with Google"
   ↓
Google auth page
   ↓
User authorizes
   ↓
Redirects to: http://localhost:5000/api/callback/google
   ↓
Session created
   ↓
User is logged in locally! ✅
```

---

## 🧪 Testing

After updating OAuth settings and deploying:

1. **Test Google Login:**
   ```
   Go to: https://your-site.netlify.app
   Click "Login with Google"
   ✅ Should redirect back to Netlify domain
   ✅ Should NOT go to localhost
   ```

2. **Test GitHub Login:**
   ```
   Go to: https://your-site.netlify.app
   Click "Login with GitHub"
   ✅ Should redirect back to Netlify domain
   ```

3. **Check Session:**
   ```
   After login, refresh the page
   ✅ Should stay logged in
   ✅ Can access protected routes
   ```

---

## 🚀 Deployment Steps

1. **Commit the fix:**
   ```bash
   git add .
   git commit -m "fix: OAuth redirects to correct domain"
   git push origin main
   ```

2. **Update OAuth providers** (see above)

3. **Wait for Netlify deploy** (~3 minutes)

4. **Test login** on your Netlify site

---

## 🔍 Debugging

If still redirecting to localhost:

### Check 1: Environment Variables
In Netlify Dashboard → Site settings → Environment variables:
- `URL` should be set (Netlify does this automatically)
- Should show: `https://your-site.netlify.app`

### Check 2: OAuth Provider Settings
- Verify redirect URI matches exactly: `https://your-site.netlify.app/api/callback/google`
- No trailing slashes
- Correct protocol (`https`)

### Check 3: Function Logs
Netlify Dashboard → Functions → api → Logs
- Look for: "callbackURL:" in the logs
- Should show your Netlify domain, not localhost

### Check 4: Clear Browser Cache
- OAuth tokens might be cached
- Try incognito/private window
- Clear site data and try again

---

## 📊 Multiple Environments

The code now supports:

| Environment | Domain Detection | Protocol |
|-------------|------------------|----------|
| **Netlify Production** | `URL` env var | `https` |
| **Netlify Preview** | `DEPLOY_PRIME_URL` | `https` |
| **Replit** | `REPLIT_DOMAINS` | `https` |
| **Local Dev** | `localhost:5000` | `http` |

---

## ✅ Checklist

Before testing login:

- [ ] Code changes committed and pushed
- [ ] Netlify deploy completed successfully
- [ ] Google OAuth redirect URI updated
- [ ] GitHub OAuth redirect URI updated
- [ ] Cleared browser cache / tested in incognito
- [ ] Environment variables verified in Netlify

---

## 🎯 Expected Result

After the fix and OAuth settings update:

✅ Login on Netlify → Stays on Netlify domain  
✅ Login locally → Stays on localhost  
✅ No more localhost:5000 redirects in production  
✅ Sessions work correctly  
✅ Multi-language persists after login  

---

## 📚 Related Files

- `server/replitAuth.ts` - OAuth configuration (UPDATED)
- `OAUTH_SETUP.md` - Original OAuth setup guide
- `ENV_QUICK_REFERENCE.md` - Environment variables

---

**Your OAuth is now production-ready! 🎉**

Remember to update the redirect URIs in each OAuth provider's dashboard!
