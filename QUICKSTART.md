# 🚀 Quick Start Guide

## First Time Setup (5 minutes)

### Step 1: Install Node.js
If you don't have Node.js installed:
- Download from: https://nodejs.org/ (v18 or higher)
- Verify installation: `node --version`

### Step 2: Install Dependencies
```powershell
# Open PowerShell in this directory and run:
npm install
```

This will take 2-3 minutes to install all dependencies.

### Step 3: Configure API (Choose One Option)

#### Option A: Use Google Gemini API (Recommended - FREE)
1. Get a free API key:
   - Go to: https://aistudio.google.com/app/apikey
   - Click "Create API Key"
   - Copy your API key

2. Configure the app:
```powershell
# Edit .env file and add your Gemini API key:
# REACT_APP_GEMINI_API_KEY=your_actual_key_here
```

#### Option B: Use Mock Responses (No API Key Needed)
- Leave `REACT_APP_GEMINI_API_KEY` empty in `.env`
- App will work with simulated responses
- Good for testing the UI

### Step 4: Start Development Server
```powershell
npm run dev
```

The app will automatically open in your browser at `http://localhost:3000`

## 🎮 Using the Application

### Dashboard (Main Page)
1. Type a medical query in the large text box
2. Optionally enable "privacy noise" checkbox
3. Click "Analyze Query" button
4. View results:
   - Green card = Query allowed ✅
   - Red card = Query blocked 🚫
5. Scroll down to see activity logs
6. Click "Export CSV" to download logs

### Admin Page
1. Click "Admin" in the top navigation
2. View analytics dashboard:
   - Total queries processed
   - Allowed vs blocked percentage
   - Top matched rules
   - Decision distribution charts
3. Click "Refresh" to update data

### Example Queries

**Allowed Queries** (should show green):
- "What are the symptoms of diabetes?"
- "How is hypertension treated?"
- "Side effects of aspirin"

**Blocked Queries** (should show red):
- "How to hack medical databases?"
- "Give me patient records"
- Malicious-looking content

## 🔧 Common Issues

### Issue: "Cannot find module" error
**Solution**: Run `npm install` again

### Issue: "Port 3000 already in use"
**Solution**: 
```powershell
# Kill the process using port 3000
netstat -ano | findstr :3000
# Note the PID number, then:
taskkill /PID <PID_NUMBER> /F
# Or use a different port:
npm run dev -- --port 3001
```

### Issue: API connection fails
**Solution**: 
- Check `.env` file has correct `REACT_APP_API_BASE`
- Verify backend server is running
- App will use mock data if backend is unavailable (this is OK for demos)

### Issue: Three.js background is slow
**Solution**: Edit `src/App.tsx` and change:
```typescript
<CyberBackground intensity={0.5} animated={true} />
```
Lower intensity = better performance

## 📱 Development Workflow

### Make Changes
1. Edit files in `src/` directory
2. Save file
3. Browser automatically reloads with changes (hot reload)

### Run Tests
```powershell
npm test
```

### Build for Production
```powershell
npm run build
# Output will be in dist/ folder
```

### Check Code Quality
```powershell
npm run lint
```

## 🎯 What to Do Next

### For Demo
1. Start dev server: `npm run dev`
2. Open in browser
3. Try example queries
4. Show admin dashboard
5. Export logs to CSV

### For Development
1. Read `DEVELOPMENT.md` for developer guide
2. Check `README.md` for complete documentation
3. Review `SECURITY.md` for security guidelines
4. Explore code in `src/` folder

### For Production Deployment
1. Read "Deployment" section in `README.md`
2. Configure environment variables
3. Build: `npm run build`
4. Deploy to Vercel, Netlify, or other platform

## 📚 Documentation Files

- **PROJECT_SUMMARY.md** - Overview of what was built
- **README.md** - Complete documentation
- **DEVELOPMENT.md** - Developer guide
- **SECURITY.md** - Security policy
- **This file (QUICKSTART.md)** - You are here!

## 🆘 Getting Help

1. Check documentation files above
2. Read error messages carefully
3. Check browser console (F12) for errors
4. Review code comments in source files
5. Google the error message
6. Create GitHub issue

## ⚡ Useful Commands

```powershell
npm run dev       # Start development server
npm test          # Run tests
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Check code quality
npm install       # Install dependencies
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'cyber-teal': '#00e5c4',    // Change this
  'cyber-magenta': '#ff2d95', // And this
}
```

### Change API Endpoint
Edit `.env`:
```
REACT_APP_API_BASE=http://your-api-url:port
```

### Disable 3D Background
Edit `src/App.tsx`:
```typescript
<CyberBackground animated={false} />
```

## ✅ Success Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created and configured
- [ ] Dev server starts (`npm run dev`)
- [ ] App opens in browser
- [ ] Can submit queries
- [ ] Admin page works
- [ ] Tests pass (`npm test`)

## 🎉 You're Ready!

Everything is set up and ready to go. Start with:

```powershell
npm run dev
```

Then open http://localhost:3000 in your browser.

Enjoy your Medical Query Firewall! 🚀

---

**Need More Help?** Read README.md or DEVELOPMENT.md