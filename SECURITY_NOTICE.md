# 🔒 Security Notice

## Important Security Update

This repository previously contained sensitive credentials that have been removed. If you cloned this repository before this security update, please note:

### Exposed Credentials (Now Revoked)
The following credentials were accidentally committed and **MUST BE CHANGED IMMEDIATELY**:

1. **MongoDB Database Credentials** - Connection string was exposed
2. **Resend API Key** - Email service API key was exposed  
3. **Gmail App Password** - SMTP password was exposed
4. **Admin Dashboard Password** - Login credentials were hardcoded

### Action Required

If you are the repository owner:

1. ✅ **Rotate all credentials immediately:**
   - Create new MongoDB database user with new password
   - Generate new Resend API key from dashboard
   - Create new Gmail app password
   - Change admin dashboard password
   
2. ✅ **Update Vercel environment variables** with new credentials

3. ✅ **Clean git history** (optional but recommended):
   ```bash
   # Use BFG Repo-Cleaner to remove sensitive data from history
   # https://rtyley.github.io/bfg-repo-cleaner/
   ```

### Best Practices Going Forward

- ✅ Never commit `.env` files
- ✅ Use environment variables for all secrets
- ✅ Keep `.gitignore` up to date
- ✅ Use `.env.example` files as templates
- ✅ Review commits before pushing
- ✅ Use GitHub secret scanning alerts
- ✅ Consider making repository private if it contains business logic

### Current Security Status

- ✅ Sensitive `.env` files removed from tracking
- ✅ Documentation sanitized
- ✅ `.gitignore` updated to prevent future leaks
- ✅ Admin credentials moved to environment variables
- ⚠️ Git history still contains old credentials (needs cleanup)

**Last Updated**: November 9, 2025
