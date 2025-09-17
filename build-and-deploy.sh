#!/bin/bash

# Build and Deploy Script for Polished Crystal
# This script builds the ROM and deploys it to OpenEmu

set -e  # Exit on any error

echo "🔨 Building Polished Crystal ROM..."

# Clean previous build
echo "Cleaning previous build artifacts..."
make clean

# Build the ROM
echo "Building ROM..."
make

# Check if build was successful
if [ ! -f "polishedcrystal-3.2.0.gbc" ]; then
    echo "❌ Build failed - ROM file not found!"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to OpenEmu
OPENEMU_ROM_PATH="/Users/jacobcolling/Library/Application Support/OpenEmu/Game Library/roms/Game Boy/polishedcrystal-3.2.0.gbc"

echo "📦 Deploying ROM to OpenEmu..."
cp polishedcrystal-3.2.0.gbc "$OPENEMU_ROM_PATH"

if [ $? -eq 0 ]; then
    echo "✅ ROM successfully deployed to OpenEmu!"
    echo "📍 Location: $OPENEMU_ROM_PATH"
else
    echo "❌ Failed to deploy ROM to OpenEmu"
    exit 1
fi

# Show ROM info
echo ""
echo "📊 ROM Information:"
echo "   Size: $(ls -lh polishedcrystal-3.2.0.gbc | awk '{print $5}')"
echo "   Modified: $(ls -l polishedcrystal-3.2.0.gbc | awk '{print $6, $7, $8}')"

echo ""
echo "🎮 Ready to play! Load the ROM in OpenEmu."