# Development Setup

## Quick Start Script

Use the clean development script to automatically:

- Kill all existing Next.js processes
- Clear cache
- Free up port 3000
- Start dev server on port 3000
- Open in Arc browser

### Usage Options:

1. **Using the script directly:**

   ```bash
   ./start-dev.sh
   ```

2. **Using npm script:**

   ```bash
   npm run dev:clean
   ```

3. **Regular development (if you want to keep existing processes):**
   ```bash
   npm run dev
   ```

## What the script does:

1. 🔪 Kills all existing Next.js processes
2. 🧹 Clears Next.js cache (.next folder)
3. 🚪 Frees up port 3000 by killing any process using it
4. 🚀 Starts development server on port 3000
5. ⏳ Waits for server to be ready
6. 🌐 Opens http://localhost:3000 in Arc browser
7. ✅ Confirms everything is running

## Benefits:

- Always starts on port 3000 (no more port conflicts)
- Automatically opens in your preferred browser (Arc)
- Cleans up any stuck processes
- Fresh start every time
- No more manual port management

