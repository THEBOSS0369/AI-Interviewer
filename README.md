# AI Interview Voice Bot

A modern, AI-powered voice bot for interview practice, built with Next.js, ChatGPT API, and OpenAI Whisper for speech recognition.

## ✨ Features

- 🎤 **Real-time Voice Input**: Speak your questions using OpenAI Whisper
- 🔊 **Voice Output**: Listen to AI responses with text-to-speech
- 🤖 **ChatGPT Integration**: Powered by OpenAI's GPT-3.5-turbo
- 💬 **Text Chat**: Type questions as an alternative to voice
- 🎨 **Modern UI**: Beautiful, responsive design with animations
- 📱 **Mobile Friendly**: Works perfectly on all devices

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API key

### Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd AI-Interviewer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your OpenAI API key:

   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Interview Questions

The bot is designed to respond to interview questions like:

- "What should we know about your life story?"
- "What's your #1 superpower?"
- "What are the top 3 areas you'd like to grow in?"
- "What misconception do your coworkers have about you?"
- "How do you push your boundaries and limits?"

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI**: OpenAI ChatGPT API, OpenAI Whisper
- **Voice**: Web Speech API (Text-to-Speech)
- **Icons**: Lucide React

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`: Your OpenAI API key
4. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- Render
- DigitalOcean App Platform

## 🔧 Configuration

### Environment Variables

| Variable         | Description         | Required |
| ---------------- | ------------------- | -------- |
| `OPENAI_API_KEY` | Your OpenAI API key | Yes      |

### Customizing Responses

Edit the system prompt in `src/app/api/chat/route.ts` to customize the AI's personality and responses.

## 🎨 Customization

### Styling

- Colors and themes can be modified in `src/app/globals.css`
- Component styling uses Tailwind CSS classes

### AI Personality

- Modify the system prompt in the chat API route
- Adjust temperature and max_tokens for different response styles

## 📱 Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is built for the 100x interview process.

---
