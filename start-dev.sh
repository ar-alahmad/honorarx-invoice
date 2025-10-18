#!/bin/bash

# Kill all existing Next.js processes
echo "🔪 Killing all existing Next.js processes..."
pkill -f "next dev" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
pkill -f "node.*next" 2>/dev/null || true

# Wait a moment for processes to fully terminate
sleep 2

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next 2>/dev/null || true

# Kill any process using port 3000
echo "🚪 Freeing up port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

# Wait a moment for port to be freed
sleep 1

# Start the development server on port 3000
echo "🚀 Starting development server on port 3000..."

# Open in Arc browser after a short delay (in background)
(sleep 3 && echo "🌐 Opening in Arc browser..." && open -a "Arc" http://localhost:3000) &

# Start the dev server (this will keep running)
PORT=3000 npm run dev
