#!/bin/bash

# Stop all development processes
echo "🛑 Stopping all development processes..."

# Kill Expo processes
pkill -9 -f "expo start" 2>/dev/null
pkill -9 -f "react-native" 2>/dev/null

# Kill node processes except this script's parent
ps aux | grep node | grep -v grep | grep -v "$$" | awk '{print $2}' | xargs kill -9 2>/dev/null

# Kill serve (dashboard)
pkill -9 -f "serve dashboard" 2>/dev/null

echo "✅ All processes stopped"
