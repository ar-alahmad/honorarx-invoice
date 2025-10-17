# Session Management Behavior

## Banking-Style Security Implementation

Your HonorarX Invoice app now implements banking-level session security with two distinct modes:

---

## 🔐 Mode 1: **"Angemeldet bleiben" ENABLED** (Remember Me)

When users check "Angemeldet bleiben" during login:

- ✅ **Session Duration**: 30 days
- ✅ **Browser Close**: Session persists (stays logged in)
- ✅ **Inactivity**: No automatic logout
- ✅ **Logout**: Only when user manually clicks "Abmelden"

**Use Case**: Personal devices, convenience over security

---

## 🏦 Mode 2: **"Angemeldet bleiben" DISABLED** (Default - Banking Mode)

When users login WITHOUT checking "Angemeldet bleiben":

### Automatic Logout Triggers:

1. **Browser Completely Closed** 🚪
   - When user quits the browser entirely (not just closing a tab)
   - Uses `sessionStorage` detection - cleared when browser closes
   - User will be logged out on next browser open

2. **10 Minutes of Inactivity** ⏱️
   - No mouse movement, clicks, keyboard input, or scrolling
   - Timer resets with any user activity
   - **Warning popup appears** after 9.5 minutes (30 seconds before logout)
   - Any activity during warning dismisses it and resets timer
   - Automatic logout after 10 minutes of no activity

3. **Maximum Session Duration: 2 Hours** ⏰
   - Even with activity, session expires after 2 hours
   - User must login again after 2 hours

### Activity Tracking:
The system monitors these events to detect activity:
- Mouse movement
- Mouse clicks
- Keyboard input
- Scrolling
- Touch events

---

## Technical Implementation

### Session Storage (Non-Remember-Me):
- `honorarx-session-active`: Session active flag
- `honorarx-session-start-time`: When session started
- `honorarx-session-heartbeat`: Last activity timestamp
- `honorarx-last-activity`: Last user interaction time

### Local Storage:
- `honorarx-remember-me`: "true" or "false"
- `honorarx-session-duration`: "30d" or "2h" (30 days for remember-me, 2 hours max for standard)

### Cross-Tab Synchronization:
- Uses BroadcastChannel API for instant logout across all tabs
- Fallback to localStorage events for older browsers

---

## Security Benefits

✅ **Prevents unauthorized access** if user forgets to logout
✅ **Protects against session hijacking** with short session duration
✅ **Banking-level security** for shared/public computers
✅ **User choice** between convenience and security

---

## User Experience

### Login Page:
- Checkbox: "Angemeldet bleiben" (unchecked by default)
- Clear indication of session duration based on selection

### During Session:
- Activity automatically extends the 15-minute inactivity timer
- No interruptions during active use
- Smooth logout experience when timeout occurs

### After Logout:
- Redirected to login page
- Session cleared across all tabs
- Clean state for next login
