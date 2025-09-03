#!/bin/bash

# Test build script for local testing
echo "🔧 Testing build process..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist node_modules/.vite

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Type check
echo "🔍 Running type check..."
npm run type-check

# Build
echo "🏗️ Building project..."
npm run build

# Check if build was successful
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Build successful!"
    echo "📊 Build output:"
    ls -la dist/
else
    echo "❌ Build failed!"
    exit 1
fi
