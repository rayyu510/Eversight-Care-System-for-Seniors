#!/bin/bash
echo "🔄 EverSight Care Desktop - System Restore"
echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

echo "Starting development server..."
echo "🚀 Application will be available at: http://localhost:3000"
echo "🛡️ Guardian Protect module should be immediately functional"
npm run dev
