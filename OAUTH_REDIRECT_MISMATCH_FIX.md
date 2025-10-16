# 🔧 OAuth Redirect URI Mismatch - Complete Fix Guide

## Error: `Error 400: redirect_uri_mismatch`

This error occurs when the callback URL in your code doesn't **exactly** match what's configured in Google/GitHub OAuth settings.

---

## ✅ Solution Applied

### Code Changes:
I've updated `server/replitAuth.ts` with:
1. **Improved domain detection** using `getBaseURL()` function
2. **Debug logging** to show the exact callback URLs being used
3. **Support for manual override** via `OAUTH_REDIRECT_DOMAIN` env var

---

## 🔍 Find Your Actual Netlify URL

### Step 1: Check Netlify Function Logs
1. Go to **Netlify Dashboard**
2. Click **Functions** → **api** → **Logs**
3. Look for lines like:
   ```
   Google OAuth callback URL: https://your-actual-url.netlify.app/api/callback/google
   GitHub OAuth callback URL: https://your-actual-url.netlify.app/api/callback/github
   ```
4. **Copy these exact URLs** - you'll need them!

### Step 2: Alternative - Check Deploy Log
1. Go to **Netlify Dashboard** → **Deploys**
2. Click your latest deploy
3. Look for "Site deployed" message
4. Note the URL (e.g., `https://your-site-name.netlify.app`)

---

## 📝 Update OAuth Provider Settings

### Google OAuth Console

1. **Go to:** https://console.cloud.google.com/apis/credentials

2. **Select your OAuth 2.0 Client ID**

3. **Under "Authorized redirect URIs", add EXACTLY:**
   ```
   https://your-site-name.netlify.app/api/callback/google
   ```
   
   **Important:**
   - ✅ Use the **exact** URL from the function logs
   - ✅ Make sure it's `https://` (not `http://`)
   - ✅ No trailing slash at the end
   - ✅ Check for typos in the domain name
   
4. **Optional:** Keep localhost for local development:
   ```
   http://localhost:5000/api/callback/google
   ```

5. **Click Save**

6. **Wait 5 minutes** - Google takes time to propagate changes

---

### GitHub OAuth Apps

1. **Go to:** https://github.com/settings/developers

2. **Select your OAuth App**

3. **Update "Authorization callback URL" to:**
   ```
   https://your-site-name.netlify.app/api/callback/github
   ```
   
   **Important:**
   - ✅ GitHub only allows **ONE** callback URL per app
   - ✅ If you need both production and local, create **two separate apps**:
     - One for production (Netlify URL)
     - One for development (localhost URL)

4. **Click "Update application"**

---

## 🎯 Common Mistakes to Avoid

### ❌ Wrong:
```
# Missing protocol
your-site.netlify.app/api/callback/google

# Wrong protocol
http://your-site.netlify.app/api/callback/google

# Trailing slash
https://your-site.netlify.app/api/callback/google/

# Typo in domain
https://your-site.netify.app/api/callback/google

# Wrong path
https://your-site.netlify.app/api/auth/google/callback
```

### ✅ Correct:
```
https://your-site.netlify.app/api/callback/google
https://your-site.netlify.app/api/callback/github
```

---

## 🚀 Deployment & Testing

### Step 1: Commit and Push
```bash
git add .
git commit -m "fix: Add debug logging for OAuth callback URLs"
git push origin main
```

### Step 2: Wait for Deploy
- Netlify will automatically rebuild (~3-5 minutes)
- Check deploy status in dashboard

### Step 3: Check Function Logs
1. After deploy completes, go to **Functions** → **api** → **Logs**
2. Trigger a login attempt (it might fail, that's ok)
3. Look for the debug log: `Google OAuth callback URL: ...`
4. **Copy the exact URL shown**

### Step 4: Update OAuth Settings
- Use the **exact** URL from the logs
- Update Google OAuth Console
- Update GitHub OAuth Apps
- **Wait 5 minutes** for changes to propagate

### Step 5: Clear Cache & Test
```bash
# Clear browser cache or use incognito mode
# Then test:
1. Go to https://your-site.netlify.app
2. Click "Login with Google"
3. Should work without redirect_uri_mismatch error ✅
```

---

## 🔧 Environment Variable Override

If automatic detection isn't working, you can **manually set** the domain:

### In Netlify Dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add new variable:
   ```
   Name: OAUTH_REDIRECT_DOMAIN
   Value: your-site.netlify.app
   ```
   (Don't include `https://`)
3. **Redeploy** the site
4. Check function logs to verify new URL

---

## 🧪 Testing Checklist

- [ ] Deployed latest code to Netlify
- [ ] Checked function logs for actual callback URL
- [ ] Updated Google OAuth redirect URI with **exact** URL
- [ ] Updated GitHub OAuth redirect URI with **exact** URL
- [ ] Waited 5 minutes after OAuth settings change
- [ ] Cleared browser cache / used incognito mode
- [ ] Tested "Login with Google" - works! ✅
- [ ] Tested "Login with GitHub" - works! ✅

---

## 🐛 Still Not Working?

### Debug Checklist:

#### 1. Check URL Format
Compare these three URLs - they should match:

**A. Function Log:**
```
Google OAuth callback URL: https://abc123.netlify.app/api/callback/google
```

**B. Google OAuth Console:**
```
Authorized redirect URIs: https://abc123.netlify.app/api/callback/google
```

**C. Netlify Site URL:**
```
Site URL: https://abc123.netlify.app
```

#### 2. Check for Trailing Slashes
```bash
❌ https://site.netlify.app/api/callback/google/
✅ https://site.netlify.app/api/callback/google
```

#### 3. Verify HTTPS
```bash
❌ http://site.netlify.app/...
✅ https://site.netlify.app/...
```

#### 4. Check Environment Variables
In Netlify Dashboard → Site settings → Environment variables:
```
URL = https://your-site.netlify.app (should be set automatically)
```

#### 5. Try Manual Override
If auto-detection fails, set:
```
OAUTH_REDIRECT_DOMAIN = your-site.netlify.app
```

---

## 📊 Multiple Environments Setup

### For Production AND Development:

#### Option 1: Separate OAuth Apps (Recommended)
```
Google OAuth App 1 (Production):
  - Client ID: xxx-production
  - Redirect URI: https://your-site.netlify.app/api/callback/google

Google OAuth App 2 (Development):
  - Client ID: yyy-development
  - Redirect URI: http://localhost:5000/api/callback/google
```

Set different env vars in Netlify vs `.env.local`:
```bash
# Netlify (production)
GOOGLE_CLIENT_ID=xxx-production
GOOGLE_CLIENT_SECRET=secret-production

# .env.local (development)
GOOGLE_CLIENT_ID=yyy-development
GOOGLE_CLIENT_SECRET=secret-development
```

#### Option 2: Multiple Redirect URIs (Google Only)
Google allows multiple redirect URIs:
```
Authorized redirect URIs:
  - https://your-site.netlify.app/api/callback/google
  - http://localhost:5000/api/callback/google
```

**Note:** GitHub only allows ONE redirect URI per app.

---

## 🎯 Expected Behavior After Fix

### Login Flow:
```
1. User clicks "Login with Google"
2. Redirects to: https://accounts.google.com/o/oauth2/v2/auth?...
3. User authorizes
4. Google redirects to: https://your-site.netlify.app/api/callback/google
5. Session created
6. User redirected to: https://your-site.netlify.app/
7. User is logged in! ✅
```

### No More Errors:
```
❌ Error 400: redirect_uri_mismatch
❌ Redirect to localhost:5000
✅ Clean OAuth flow
✅ Session persists
✅ Works on Netlify domain
```

---

## 📝 Quick Reference

### Callback URLs by Provider:
```
Google:   /api/callback/google
GitHub:   /api/callback/github
LinkedIn: /api/callback/linkedin
```

### Full Production URLs:
```
https://your-site.netlify.app/api/callback/google
https://your-site.netlify.app/api/callback/github
https://your-site.netlify.app/api/callback/linkedin
```

### Development URLs:
```
http://localhost:5000/api/callback/google
http://localhost:5000/api/callback/github
http://localhost:5000/api/callback/linkedin
```

---

## 🎉 Success Indicators

You'll know it's working when:

✅ No `redirect_uri_mismatch` error  
✅ OAuth redirects to Netlify domain (not localhost)  
✅ Login completes successfully  
✅ Session persists after refresh  
✅ Function logs show correct callback URL  
✅ Can access protected routes  

---

## 📚 Related Documentation

- **OAUTH_SETUP.md** - Initial OAuth setup guide
- **OAUTH_REDIRECT_FIX.md** - Localhost redirect fix
- **ENV_QUICK_REFERENCE.md** - Environment variables

---

## 🆘 Still Need Help?

1. **Check Function Logs** - Look for the exact callback URL
2. **Copy that exact URL** - Use it in OAuth console
3. **Wait 5 minutes** - Google needs time to update
4. **Clear cache** - Or use incognito mode
5. **Check for typos** - Domain name must match exactly

---

**The key is: The URL in your OAuth console must EXACTLY match the URL shown in the function logs!** 🎯

**Push your changes, check the logs, update OAuth settings, and it will work! 🚀**
