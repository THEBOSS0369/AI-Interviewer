# 🚀 Quick Setup Guide

## 🔑 Get Your OpenAI API Key

1. **Go to OpenAI Platform**: https://platform.openai.com/api-keys
2. **Sign up/Login**: Create an account or log in
3. **Add Payment Method**: Add a credit card (you can start with $5-10)
4. **Create API Key**: Click "Create new secret key"
5. **Copy the Key**: Save it somewhere safe

## ⚙️ Configure Your Project

1. **Edit Environment File**:

   ```bash
   nano .env.local
   ```

2. **Add Your API Key**:

   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Save and Restart**:
   ```bash
   npm run dev
   ```

## 🧪 Test Your Setup

1. **Text Chat**: Type a question like "What's your superpower?"
2. **Voice Input**: Click the microphone and speak
3. **Voice Output**: Listen to the AI response

## 💡 Demo Mode

If you don't have an API key yet, the app will work in **demo mode**:

- ✅ Text chat works with fallback responses
- ✅ Voice input shows demo transcription
- ✅ All UI features work perfectly
- ⚠️ Responses are pre-written (not AI-generated)

## 🎯 Ready for Deployment

Once you have your API key working locally:

1. **Deploy to Vercel**: Follow the deployment guide
2. **Add Environment Variable**: Set `OPENAI_API_KEY` in Vercel
3. **Share Your URL**: Submit to 100x team

## 🆘 Troubleshooting

### "Quota Exceeded" Error

- Add more credits to your OpenAI account
- Check your usage at https://platform.openai.com/usage

### "API Key Not Configured"

- Make sure `.env.local` exists and has your key
- Restart the development server

### Voice Not Working

- Check browser permissions for microphone
- Try a different browser (Chrome works best)

---

**Need help?** Check the [README.md](./README.md) for more details.
