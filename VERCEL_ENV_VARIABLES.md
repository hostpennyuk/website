# Environment Variables for Vercel

Copy these 8 environment variables to your Vercel project:

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

---

## 🔐 Admin Login Details

**Email**: profmendel@gmail.com
**Password**: Gig@50chin

**Admin URL**: https://hostpenny.co.uk/admin

---

## 📝 Environment Variables (Add to Vercel)

**Important**: Select ALL environments (Production, Preview, Development) for each variable!

### 1. MONGODB_URI
```
mongodb+srv://hostpennyuk_db_user:VdjO48YuBamGi6va@cluster0.gira6ng.mongodb.net/hostpenny?retryWrites=true&w=majority&appName=Cluster0
```

### 2. RESEND_API_KEY
```
re_3pBzQuVX_8kASeah1iXRgx2iLVQ1HPvxr
```

### 3. EMAIL_FROM
```
notifications@hostpenny.co.uk
```

### 4. ADMIN_EMAIL
```
hostpennyuk@gmail.com
```

### 5. SMTP_HOST
```
smtp.gmail.com
```

### 6. SMTP_PORT
```
587
```

### 7. SMTP_USER
```
hostpennyuk@gmail.com
```

### 8. SMTP_PASS
```
xjbxrbpqbdktgbpl
```

---

## ✅ After Adding Variables

1. Vercel will automatically redeploy (takes 2 minutes)
2. Test admin: https://hostpenny.co.uk/admin
3. Test API: https://hostpenny.co.uk/api/health (should return `{"ok":true}`)
4. Test form submission on your site
5. Check if emails are being sent

---

## 🔧 Vercel Dashboard Steps

1. Go to https://vercel.com/dashboard
2. Click on your project (hostpenny)
3. Click "Settings" tab
4. Click "Environment Variables" in left sidebar
5. Click "Add New" button
6. For each variable:
   - Enter the **Name** (e.g., MONGODB_URI)
   - Enter the **Value** (copy from above)
   - Select **All** environments (Production, Preview, Development)
   - Click "Save"
7. Repeat for all 8 variables
8. Wait for auto-redeploy to complete

---

## 🎯 What Each Variable Does

- **MONGODB_URI**: Connects to your MongoDB database
- **RESEND_API_KEY**: Sends emails via Resend
- **EMAIL_FROM**: Sender address for outgoing emails
- **ADMIN_EMAIL**: Where to send notification emails
- **SMTP_HOST/PORT/USER/PASS**: Gmail backup for email sending

---

## 🚨 Important Security Notes

- ✅ These variables are stored securely in Vercel
- ✅ They are NOT exposed to the frontend
- ✅ They are only accessible by your serverless functions
- ⚠️ NEVER commit these to GitHub
- ⚠️ The .env file is already in .gitignore (safe)

---

## 📞 Need Help?

If you see errors after deployment:
1. Check Vercel deployment logs
2. Verify all 8 variables are added correctly
3. Make sure all environments are selected
4. Try manual redeploy from Vercel dashboard
