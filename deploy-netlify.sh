#!/bin/bash

# Medical Query Firewall - Netlify Deployment Script
# This script builds and deploys your app to Netlify

echo "🚀 Medical Query Firewall - Netlify Deployment"
echo "================================================"
echo ""

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null
then
    echo "❌ Netlify CLI not found!"
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed!"
    echo ""
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ dist folder not found! Build may have failed."
    exit 1
fi

echo "📦 Build output ready in dist/"
echo ""

# Ask user which deployment option they want
echo "Choose deployment option:"
echo "1. Deploy to production (netlify deploy --prod)"
echo "2. Deploy preview/draft (netlify deploy)"
echo "3. Initialize new site (netlify init)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to PRODUCTION..."
        netlify deploy --prod
        ;;
    2)
        echo "🔍 Deploying PREVIEW..."
        netlify deploy
        ;;
    3)
        echo "🆕 Initializing new site..."
        netlify init
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your site is now live!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Set environment variables in Netlify dashboard"
    echo "   2. Configure your backend URL (REACT_APP_API_BASE)"
    echo "   3. Update CORS settings in backend to allow Netlify domain"
    echo "   4. Test your deployed app!"
else
    echo ""
    echo "❌ Deployment failed! Please check the errors above."
    exit 1
fi
