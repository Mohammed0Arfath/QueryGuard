# Deployment Guide - Netlify

## 🚀 Quick Deploy

### Option 1: Deploy via Netlify CLI (Recommended)

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Login to Netlify:**
```bash
netlify login
```

3. **Deploy from project root:**
```bash
# Build the project first
npm run build

# Deploy (will create new site)
netlify deploy --prod

# Or initialize and deploy
netlify init
```

### Option 2: Deploy via Netlify Dashboard

1. **Push to GitHub/GitLab/Bitbucket:**
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push origin main
```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider and repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
     - **Base directory:** (leave empty)

3. **Set Environment Variables:**
   - Go to Site settings → Environment variables
   - Add: `REACT_APP_API_BASE` = `https://your-backend-url.com`
   - Add: `REACT_APP_GEMINI_API_KEY` = `your_key` (optional)

4. **Deploy:**
   - Click "Deploy site"
   - Wait for build to complete

### Option 3: Drag & Drop Deploy

1. **Build locally:**
```bash
npm run build
```

2. **Deploy:**
   - Go to [netlify.com/drop](https://app.netlify.com/drop)
   - Drag the `dist` folder to the upload area
   - Your site will be deployed instantly!

## ⚙️ Configuration

### Build Settings
```
Build command: npm run build
Publish directory: dist
Node version: 18
```

### Environment Variables (Set in Netlify Dashboard)

**Required:**
- `REACT_APP_API_BASE` - Your backend API URL
  - Example: `https://your-backend.herokuapp.com` or `http://localhost:8000` for testing

**Optional:**
- `REACT_APP_GEMINI_API_KEY` - Your Gemini API key
  - Get from: https://aistudio.google.com/app/apikey
  - Only needed if using frontend fallback (backend handles API calls)

### Custom Domain (Optional)

1. Go to Domain settings in Netlify
2. Click "Add custom domain"
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic with Let's Encrypt)

## 🔧 Backend Deployment

Your backend (Node.js/Express) needs separate deployment. Options:

### Option 1: Deploy Backend to Render.com
```bash
# In backend directory
cd backend

# Create render.yaml (if not exists)
# Push to GitHub
# Connect to Render.com
# Set environment variable: GEMINI_API_KEY
```

### Option 2: Deploy Backend to Railway.app
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy from backend directory
cd backend
railway init
railway up
```

### Option 3: Deploy Backend to Heroku
```bash
# Install Heroku CLI
# Login
heroku login

# Create app
cd backend
heroku create your-app-name

# Set environment variable
heroku config:set GEMINI_API_KEY=your_key

# Deploy
git push heroku main
```

### Option 4: Use Netlify Functions (Serverless)
Convert backend to Netlify Functions:
1. Create `netlify/functions/` directory
2. Move API endpoints to function files
3. Deploy with frontend automatically

## 🔒 Security Checklist

Before deploying:

- [ ] ✅ Update CORS settings in backend to allow your Netlify domain
- [ ] ✅ Set `REACT_APP_API_BASE` to production backend URL
- [ ] ✅ Remove or comment out `REACT_APP_GEMINI_API_KEY` in `.env` (use backend)
- [ ] ✅ Update CSP in `index.html` if needed
- [ ] ✅ Test all API endpoints from deployed frontend
- [ ] ✅ Enable HTTPS on custom domain
- [ ] ✅ Check rate limiting configuration
- [ ] ✅ Review environment variables

## 📊 Post-Deployment

### Update Backend CORS
In `backend/server.js`, add your Netlify URL:
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-app.netlify.app',  // Add this
    'https://your-custom-domain.com'  // And this if using custom domain
  ],
  credentials: true
};
```

### Test Deployment
1. Visit your Netlify URL
2. Test query submission
3. Check browser console for errors
4. Verify API calls to backend
5. Test all navigation routes

### Monitor
- View build logs in Netlify dashboard
- Check Analytics for traffic
- Monitor Functions if using serverless backend

## 🐛 Troubleshooting

### Build Fails
```bash
# Check Node version
# Verify all dependencies in package.json
# Test build locally: npm run build
# Check Netlify build logs
```

### Blank Page After Deploy
- Check browser console for errors
- Verify `dist` folder contains `index.html`
- Check redirect rules in `netlify.toml`
- Ensure `base` in `vite.config.ts` is correct

### API Calls Fail
- Verify `REACT_APP_API_BASE` environment variable
- Check backend CORS settings
- Ensure backend is deployed and running
- Check browser Network tab for errors

### CSP Errors
- Update CSP in `index.html` to allow backend domain
- Check browser console for specific CSP violations

## 🎉 Success!

Your Medical Query Firewall is now live on Netlify!

**Next Steps:**
1. Share your Netlify URL: `https://your-app.netlify.app`
2. Set up custom domain (optional)
3. Configure continuous deployment (automatic)
4. Monitor analytics and performance

**Example URLs:**
- Frontend: `https://medical-query-firewall.netlify.app`
- Backend: `https://medical-query-backend.herokuapp.com`

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://answers.netlify.com
- Deploy Status: Check Netlify dashboard
