# 🔍 Debug Guide: Remember-Me Cookie Issue

## What I've Added

I've added **comprehensive logging** to track exactly what's happening with the remember-me cookie.

---

## ⚠️ IMPORTANT: Where to Look for Logs

### **Browser Console** (Chrome DevTools)
- Shows CLIENT-SIDE logs from React components
- Press **F12** → Console tab

### **Terminal/Server Console** (where `npm run dev` is running)
- Shows SERVER-SIDE logs from Next.js API routes and auth callbacks
- This is where you'll see:
  - `[Credentials Provider]` logs
  - `[JWT Callback]` logs

**YOU NEED TO CHECK BOTH!**

---

## 🧪 Testing Steps

### **1. Clear Everything First**

In browser console, run:
```javascript
// Clear all storage
localStorage.clear();
sessionStorage.clear();

// Then refresh the page
location.reload();
```

### **2. Login with Remember-Me**

1. Go to `/anmelden`
2. Check "Angemeldet bleiben" ✅
3. Enter credentials and login
4. **Watch BOTH consoles**

---

## 📊 Expected Console Output

### **BROWSER Console Should Show:**

```
✅ Login: Remember-me cookie API response: { ok: true }
✅ Login: Cookie should now be set on server
✅ Login: All cookies visible to client: [cookie string]
✅ Login: Session created successfully
📊 Login: Session verification: {
  session: { exists: true, user: {...}, expires: "..." },
  rememberMeCookie: { exists: true, value: "true" },
  allCookies: [...]
}
✅ Login: Remember-me cookie CONFIRMED on server
🔄 Login: Redirecting to dashboard
```

### **SERVER/TERMINAL Console Should Show:**

```
[Credentials Provider] Authorize called
[Credentials Provider] Remember-me from credentials: true
[JWT Callback] Remember-me cookie: true
[JWT Callback] ✅ Remember-me ENABLED - 30 days session
```

---

## ❌ If You See Errors

### **Browser Console Shows:**

```
❌ WARNING: Remember-me cookie NOT found on server!
```

**Means:** Cookie API call succeeded but cookie didn't persist.

**Check:**
1. Look at Network tab → `/api/auth/remember-me` request
2. Check Response Headers → Should have `Set-Cookie: honorarx-remember-me=true`

---

### **Server Console Shows:**

```
[JWT Callback] Remember-me cookie: false
[JWT Callback] ⏱️  Remember-me DISABLED - 2 hours session
```

**Means:** Cookie not being read during JWT creation.

**Possible causes:**
1. Cookie expired too quickly
2. Cookie domain/path mismatch
3. Cookie not sent with signIn request

---

## 🔍 Manual Cookie Verification

### **Check Cookies in DevTools:**

1. Press **F12**
2. Go to **Application** tab
3. Click **Cookies** → Your domain
4. Look for: `honorarx-remember-me`

**Should see:**
- Name: `honorarx-remember-me`
- Value: `true`
- Domain: `localhost` (or your domain)
- Path: `/`
- Expires: ~30 days from now
- HttpOnly: ✓
- Secure: ✓ (if production)
- SameSite: `Lax`

---

## 📋 What to Send Me

After testing, please send me:

### **1. Browser Console Output:**
Copy everything from the console after login, including:
- ✅ or ❌ messages
- Session verification object

### **2. Server/Terminal Console Output:**
Copy the logs from your terminal where `npm run dev` is running, especially:
- `[Credentials Provider]` lines
- `[JWT Callback]` lines

### **3. Cookie Screenshot:**
Take a screenshot of Application → Cookies showing `honorarx-remember-me`

### **4. After Browser Reopen:**
Tell me:
- Are you logged in or logged out?
- What's in localStorage: `localStorage.getItem('honorarx-remember-me')`
- Does the cookie still exist in DevTools?

---

## 🎯 What We're Looking For

### **Theory 1: Cookie Not Being Set**
- Browser shows: `❌ WARNING: Remember-me cookie NOT found on server`
- Fix: Cookie API endpoint issue

### **Theory 2: Cookie Not Persisting After Browser Close**
- Browser shows: Cookie exists after login ✅
- After reopen: Cookie gone ❌
- Fix: Cookie settings (HttpOnly, SameSite, etc.)

### **Theory 3: Cookie Exists But JWT Not Reading It**
- Browser shows: Cookie confirmed ✅
- Server shows: `[JWT Callback] Remember-me cookie: false` ❌
- Fix: Timing issue or cookie not sent with request

### **Theory 4: JWT Reading Cookie But Wrong Expiry**
- Server shows: `[JWT Callback] Remember-me cookie: true` ✅
- Server shows: `⏱️  Remember-me DISABLED - 2 hours session` ❌
- Fix: Logic error in JWT callback

---

## 🔧 Quick Diagnostic Commands

Run these in browser console after login:

```javascript
// Check localStorage
console.log('Remember-me in localStorage:', localStorage.getItem('honorarx-remember-me'));

// Check if session exists
fetch('/api/auth/check-session')
  .then(r => r.json())
  .then(data => console.log('Session check:', data));

// Check all cookies (visible ones)
console.log('Client-visible cookies:', document.cookie);
```

---

## 📞 Next Steps

1. **Clear everything** (localStorage, sessionStorage, cookies)
2. **Login with remember-me checked**
3. **Watch BOTH consoles** (browser + server terminal)
4. **Send me the logs** from both places
5. **Check cookies** in DevTools
6. **Close and reopen browser**
7. **Tell me the result**

This will help me pinpoint the exact issue!

