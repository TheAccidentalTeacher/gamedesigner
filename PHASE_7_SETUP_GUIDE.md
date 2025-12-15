# Phase 7: Quick Setup Guide for Supabase

**Time Required**: 10-15 minutes  
**Cost**: $0 (Free tier)

---

## 🚀 Step-by-Step Setup

### Step 1: Create Supabase Account (2 minutes)

1. Go to https://supabase.com
2. Click **"Start your project"** or **"Sign Up"**
3. Sign up with:
   - GitHub (recommended - already have account)
   - Or Google
   - Or Email
4. Verify email if needed

### Step 2: Create New Project (3 minutes)

1. Click **"New Project"** (green button)
2. Fill in:
   - **Organization**: Create new or use existing
   - **Name**: `UCAS Research Engine` (or whatever you like)
   - **Database Password**: 
     - Click "Generate a password" 
     - **SAVE THIS PASSWORD!** (put in password manager)
   - **Region**: Choose closest to you:
     - US: `us-east-1` (N. Virginia) or `us-west-1` (California)
     - Just pick nearest
   - **Plan**: Free (default)
3. Click **"Create new project"**
4. Wait 2-3 minutes for provisioning (it'll say "Setting up project...")

### Step 3: Get Your Credentials (2 minutes)

Once project is ready:

1. Click **"Project Settings"** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see:

```
Project URL
https://xxxxxxxxxxxxx.supabase.co
```

```
Project API keys

anon public
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6... (very long string)
```

4. **Copy both of these!** Send them to me:
   - Project URL
   - anon public key (NOT the service_role key!)

### Step 4: Run SQL Schema (5 minutes)

1. Click **"SQL Editor"** in left sidebar
2. Click **"+ New query"**
3. Open the file `supabase-schema.sql` from your project
4. Copy the ENTIRE contents
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for success messages (should see "✅ Database schema created successfully!")

### Step 5: Enable Authentication (2 minutes)

1. Click **"Authentication"** in left sidebar
2. Click **"Providers"**
3. Enable these providers:
   - **Google**: 
     - Toggle ON
     - Click "Save"
   - **GitHub**: 
     - Toggle ON  
     - Click "Save"
4. That's it! (We'll use default settings)

### Step 6: Send Me Your Credentials

Send me (in chat):
```
Project URL: https://xxxxxxxxxxxxx.supabase.co
Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Security Note**: 
- The "anon" key is safe to share - it's designed to be public in your frontend code
- Never share the "service_role" key - that's for backend only

---

## ✅ Verification Checklist

Before sending me credentials, verify:

- [ ] Project is fully provisioned (not still setting up)
- [ ] SQL schema ran successfully (no errors)
- [ ] You have both Project URL and anon key
- [ ] Google and GitHub auth are enabled
- [ ] You saved your database password somewhere safe

---

## 🎯 What Happens Next?

Once you send me the credentials:

1. **I add to `.env.local`** (~1 min)
   - Your credentials stored securely on your machine
   - Not committed to git (already in .gitignore)

2. **I install Supabase client** (~1 min)
   ```bash
   npm install @supabase/supabase-js
   ```

3. **I refactor ResearchMemory** (~1 hour)
   - Add Supabase methods (save, load, sync)
   - Keep localStorage for offline
   - Implement hybrid sync

4. **I add authentication UI** (~30 min)
   - Login button
   - Profile dropdown
   - Sync status indicator

5. **We test together!** (~30 min)
   - Login with Google/GitHub
   - Save research
   - Check it appears on another device
   - Test offline mode

**Total Time**: ~2-3 hours for me to implement, then we test together

---

## 💡 Tips

### Choosing a Region
- Closer = faster
- US East (Virginia) is most popular
- Doesn't really matter for your use case

### Database Password
- You probably won't need it often
- But save it in a password manager
- Required if you want to connect with tools like pgAdmin

### Free Tier Limits
- 500MB storage (plenty for ~1,250 research sessions)
- 5GB bandwidth/month
- Unlimited API calls
- Unlimited users
- **You'll never hit these limits for personal use**

### If You Get Stuck
- Supabase docs: https://supabase.com/docs
- Or just ask me! Send a screenshot

---

## 🚨 Common Issues

**Issue**: "Organization required"
- **Fix**: Create new organization (just a name, like "Personal")

**Issue**: "Database password required"
- **Fix**: Click "Generate a password", save it

**Issue**: SQL errors when running schema
- **Fix**: Make sure you copied the ENTIRE file (it's long!)
- Make sure project is fully provisioned (not still setting up)

**Issue**: Can't find API keys
- **Fix**: Project Settings → API (in settings sidebar)

---

## 📞 Ready?

When you have:
- ✅ Project created
- ✅ SQL schema ran successfully  
- ✅ Project URL
- ✅ Anon key

Just send me those two things and I'll take it from there!

**Let's get your research syncing across all devices!** 🚀
