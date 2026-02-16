# Zohaib Asghar - Portfolio Website

A modern, high-end, fully responsive developer portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features an AI-powered chatbot, smooth animations, and a professional developer theme.

## 🚀 Features

- **Modern Design**: Premium, clean, performance-focused UI with dark/light mode toggle
- **Fully Responsive**: Mobile-first design that works on all devices
- **AI Chatbot**: Modular AI assistant powered by Gemini API (easily switchable to Qdrant/RAG)
- **Smooth Animations**: Framer Motion animations throughout
- **Performance Optimized**: Fast loading, SEO optimized
- **Production Ready**: Complete with deployment configuration

## 📋 Sections

- **Hero/About**: Animated hero section with rotating role text
- **Skills**: Categorized skills display (Frontend, Backend, Database, DevOps)
- **Experience**: Timeline view of professional experience
- **Projects**: Showcase of featured projects with live links
- **Performance Highlights**: Animated statistics
- **Tech Philosophy**: Development principles and approach
- **Contact**: Contact form and information

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **AI**: Google Gemini API (modular architecture)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
portfolio/
├── app/
│   ├── api/
│   │   └── chat/          # AI chatbot API route
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── PerformanceHighlights.tsx
│   │   ├── TechPhilosophy.tsx
│   │   └── Contact.tsx
│   ├── Chatbot.tsx        # AI chatbot component
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Footer component
│   └── ThemeProvider.tsx  # Dark/light theme provider
├── lib/
│   ├── ai/
│   │   └── providers/     # Modular AI provider system
│   │       ├── base.ts    # AI provider interface
│   │       ├── gemini.ts  # Gemini implementation
│   │       └── index.ts   # Provider factory
│   └── utils.ts           # Utility functions
└── public/                # Static assets
```

## 🤖 AI Chatbot Architecture

The chatbot uses a modular architecture that allows easy switching between AI providers:

### Current Implementation: Gemini API
- Located in `lib/ai/providers/gemini.ts`
- Uses Google's Gemini Pro model
- Configured with system prompt about Zohaib's portfolio

### Switching to Qdrant + RAG

To switch to a Qdrant-based RAG system:

1. Create a new provider in `lib/ai/providers/qdrant-rag.ts`:
```typescript
import { AIProvider, ChatMessage } from "./base";

export class QdrantRAGProvider implements AIProvider {
  async chat(messages: ChatMessage[]): Promise<string> {
    // Implement Qdrant vector search + LLM integration
    // 1. Convert user message to embedding
    // 2. Search Qdrant for relevant context
    // 3. Pass context + message to LLM
    // 4. Return response
  }
}
```

2. Update `lib/ai/providers/index.ts`:
```typescript
export function createAIProvider(): AIProvider {
  // Switch from GeminiProvider to QdrantRAGProvider
  return new QdrantRAGProvider();
}
```

The frontend (`components/Chatbot.tsx`) and API route (`app/api/chat/route.ts`) remain unchanged!

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variable `GEMINI_API_KEY` in Vercel dashboard
4. Deploy!

### Environment Variables

Make sure to set the following environment variables in your deployment platform:

- `GEMINI_API_KEY`: Your Google Gemini API key

## 📝 Customization

### Update Personal Information

Edit the following files to update your information:

- `components/sections/Hero.tsx`: Name, title, summary
- `components/sections/Skills.tsx`: Skills and categories
- `components/sections/Experience.tsx`: Work experience
- `components/sections/Projects.tsx`: Projects and links
- `components/Footer.tsx`: Contact information

### Update AI Chatbot System Prompt

Edit `lib/ai/providers/gemini.ts` → `getSystemPrompt()` method to customize the chatbot's knowledge and responses.

## 🎨 Styling

The project uses Tailwind CSS with custom utilities:

- `glass`: Glassmorphism effect for dark mode
- `glass-light`: Glassmorphism effect for light mode
- Custom animations: `fade-in`, `slide-up`, `gradient`

## 📄 License

This project is private and proprietary.

## 👤 Author

**Zohaib Asghar**
- Email: mzohaib0677@gmail.com
- Phone: +92 3229911442
- GitHub: [zohaib-9323](https://github.com/zohaib-9323)
- Location: Lahore, Pakistan

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
