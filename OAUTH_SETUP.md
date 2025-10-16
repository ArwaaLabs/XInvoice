# OAuth Setup Guide for InvoiceGenius

## ⚠️ IMPORTANT: Redirect URI Configuration

When you see the error `Error 400: redirect_uri_mismatch`, it means the redirect URI in your OAuth app settings doesn't match what your application is sending.

---

## 🔧 Quick Fix for Google OAuth

### Step 1: Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/credentials

### Step 2: Select Your OAuth Client
Click on your OAuth 2.0 Client ID (the one you created for InvoiceGenius)

### Step 3: Add Redirect URIs

Under "Authorized redirect URIs", add **BOTH** of these:

```
http://localhost:5000/api/callback/google
https://your-production-domain.com/api/callback/google
```

**For Local Development (Required Now):**
```
http://localhost:5000/api/callback/google
```

**For Production (Add When Deploying):**
```
https://your-domain.replit.dev/api/callback/google
```
OR
```
https://yourdomain.com/api/callback/google
```

### Step 4: Save Changes
Click the "SAVE" button at the bottom

### Step 5: Restart Your Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

---

## 📋 Complete OAuth Setup Checklist

### ✅ Google OAuth
- [x] Create OAuth 2.0 Client ID
- [ ] Add `http://localhost:5000/api/callback/google` to redirect URIs
- [x] Copy Client ID to `.env` → `GOOGLE_CLIENT_ID`
- [x] Copy Client Secret to `.env` → `GOOGLE_CLIENT_SECRET`
- [ ] Save and restart server

### ⬜ GitHub OAuth (Optional)
If you want to use GitHub authentication:

1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: InvoiceGenius
   - **Homepage URL**: `http://localhost:5000`
   - **Authorization callback URL**: `http://localhost:5000/api/callback/github`
4. Copy Client ID → `.env` → `GITHUB_CLIENT_ID`
5. Generate Client Secret → `.env` → `GITHUB_CLIENT_SECRET`

### ⬜ LinkedIn OAuth (Optional)
If you want to use LinkedIn authentication:

1. Go to: https://www.linkedin.com/developers/apps
2. Create a new app
3. In "Auth" tab, add redirect URL:
   - `http://localhost:5000/api/callback/linkedin`
4. Request "Sign In with LinkedIn using OpenID Connect" access
5. Copy Client ID → `.env` → `LINKEDIN_CLIENT_ID`
6. Copy Client Secret → `.env` → `LINKEDIN_CLIENT_SECRET`

---

## 🎯 Current Configuration

Based on your `.env` file:

```env
# ✅ Configured
GOOGLE_CLIENT_ID=554049868998-9n874ov4n27mfspdpc9l04j5dkr3jrv0.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# ❌ Not Configured
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

LINKEDIN_CLIENT_ID=your_linkedin_client_id_here
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret_here
```

---

## 🔍 Common Issues & Solutions

### Issue: "redirect_uri_mismatch"
**Cause**: The redirect URI in Google Console doesn't match the one your app is using.

**Solution**: 
1. Check what URI your app is using (shown in the error message)
2. Add that exact URI to Google Console
3. Make sure there are NO trailing slashes
4. Use `http://` for localhost, `https://` for production

### Issue: "Invalid OAuth client"
**Cause**: Wrong Client ID or Client Secret

**Solution**:
1. Double-check the credentials in `.env`
2. Make sure there are no extra spaces
3. Regenerate the client secret if needed

### Issue: "Access blocked: This app's request is invalid"
**Cause**: OAuth app not configured properly

**Solution**:
1. Make sure your OAuth consent screen is configured
2. Add your email as a test user (if in testing mode)
3. Verify all required scopes are added

---

## 📝 Redirect URI Reference

### Local Development
| Provider | Redirect URI |
|----------|--------------|
| Google   | `http://localhost:5000/api/callback/google` |
| GitHub   | `http://localhost:5000/api/callback/github` |
| LinkedIn | `http://localhost:5000/api/callback/linkedin` |

### Production (Example)
| Provider | Redirect URI |
|----------|--------------|
| Google   | `https://yourdomain.com/api/callback/google` |
| GitHub   | `https://yourdomain.com/api/callback/github` |
| LinkedIn | `https://yourdomain.com/api/callback/linkedin` |

**Important**: Replace `yourdomain.com` with your actual domain!

---

## 🚀 Testing OAuth

After configuring the redirect URIs:

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open your browser to:
   ```
   http://localhost:5000
   ```

3. Click "Sign in with Google" (or your configured provider)

4. You should be redirected to the OAuth provider

5. After granting permission, you'll be redirected back to your app

6. You should now be logged in! 🎉

---

## 💡 Pro Tips

1. **Keep both local and production URIs**: Add both `http://localhost:5000` and your production domain to avoid reconfiguring each time

2. **Use environment-specific OAuth apps**: Consider creating separate OAuth apps for development and production

3. **Test mode**: Most OAuth providers have a "testing" mode - use this during development

4. **Secure your secrets**: Never commit `.env` to version control (it's already in `.gitignore`)

---

## 📞 Need Help?

If you're still having issues:

1. Check the browser console for detailed error messages
2. Check the server logs in your terminal
3. Verify your `.env` file has the correct values
4. Make sure you saved changes in Google Console
5. Try clearing browser cookies and trying again

---

**Last Updated**: Based on your current setup with Google OAuth
