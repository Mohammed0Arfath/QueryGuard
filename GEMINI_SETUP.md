# 🔑 Getting Your Gemini API Key

## Why Do I Need This?

The Medical Query Firewall uses Google's Gemini AI to analyze medical queries in real-time. Without an API key, the app will show mock/simulated responses.

**Good News**: Gemini API keys are **FREE** for personal use! 

## Step-by-Step Guide

### 1. Visit Google AI Studio
Go to: **https://aistudio.google.com/app/apikey**

### 2. Sign In
- Use your Google account
- If you don't have one, create a free Google account first

### 3. Create API Key
- Click the **"Create API Key"** button
- Select a Google Cloud project (or create a new one)
- The key will be generated instantly

### 4. Copy Your Key
- Click the **copy icon** next to your API key
- It will look like: `AIzaSyB...` (long string of characters)

### 5. Add to Your App

#### Windows PowerShell:
```powershell
# Open the .env file in notepad
notepad .env

# Find this line:
# REACT_APP_GEMINI_API_KEY=

# Paste your key after the = sign:
# REACT_APP_GEMINI_API_KEY=AIzaSyB...your_actual_key
```

#### Or use any text editor:
1. Open `c:\Users\moham\Cyber\.env` in VS Code or Notepad
2. Find the line `REACT_APP_GEMINI_API_KEY=`
3. Paste your key after the equals sign (no spaces, no quotes)
4. Save the file

### 6. Restart the Dev Server

```powershell
# Stop the current server (Ctrl+C in terminal)
# Start it again:
npm run dev
```

## Verify It's Working

1. Go to http://localhost:3000
2. Type a medical query like: "What are the symptoms of diabetes?"
3. Click "Analyze Query"
4. You should see an AI-generated response (not the mock message)

## Troubleshooting

### "Invalid API Key" Error
- Double-check you copied the entire key
- Make sure there are no spaces before/after the key in .env
- Verify the key is on the correct line: `REACT_APP_GEMINI_API_KEY=`
- Restart the dev server after changing .env

### "Network Error"
- Check your internet connection
- Make sure the API key is valid
- Try generating a new API key

### Still Seeing Mock Responses?
- Verify the .env file has your key
- Restart the dev server completely (close terminal, reopen, run `npm run dev`)
- Clear browser cache (Ctrl+Shift+Delete)

## API Usage Limits

**Free Tier Includes**:
- 60 requests per minute
- 1,500 requests per day
- More than enough for development and testing!

## Security Notes

⚠️ **Keep Your API Key Private**:
- Don't commit .env to Git (it's already in .gitignore)
- Don't share your key publicly
- Don't hardcode it in your source files
- For production, use backend API with server-side key storage

## Alternative: Mock Mode

If you don't want to use an API key, the app works in mock mode:
- Leave `REACT_APP_GEMINI_API_KEY` empty
- You'll see simulated responses
- Good for UI testing without API calls

## Need Help?

- Google AI Studio Docs: https://ai.google.dev/docs
- Gemini API Reference: https://ai.google.dev/api/rest/v1/models
- Project Issues: See STATUS.md in this directory

---

**Ready to go?** Once your key is set up, return to [QUICKSTART.md](./QUICKSTART.md) to start using the app!
