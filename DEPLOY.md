# Deploy AI Avatar ChatBot on Render - Quick Guide 🚀

## Quick Steps

1. **Go to Render** → https://render.com → Sign in/up

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub → Select repo: `halyapabba2014-creator/AI_Avatar_ChatBot`

3. **Configure**
   - Name: `ai-avatar-chatbot`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Branch: `main`

4. **Deploy** → Click "Create Web Service" → Wait 2-3 minutes → Done! ✅

Your app will be live at: `https://ai-avatar-chatbot.onrender.com`

---

## Alternative: Static Site (Simpler)

1. Click "New +" → "Static Site"
2. Connect repo → Name: `ai-avatar-chatbot`
3. Publish Directory: `.`
4. Deploy → Done!

---

## Notes

- ✅ Auto-deploys on every GitHub push
- ⚠️ Free tier: Spins down after 15 min inactivity (first request may be slow)
- 🔒 API keys: Already in code, but use environment variables for production

**That's it! Your app is live! 🎉**
