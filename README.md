# Zohaib Asghar - Portfolio Website

A modern, high-end, fully responsive developer portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features an AI-powered RAG chatbot, smooth animations, and a professional developer theme.

## 🚀 Features

- **Modern Design**: Premium, clean, performance-focused UI with dark/light mode toggle.
- **Fully Responsive**: Mobile-first design that works on all devices.
- **Advanced AI Chatbot**: Modular RAG (Retrieval-Augmented Generation) assistant.
- **Vector Database**: Uses Qdrant for semantic search of portfolio data.
- **Multi-Model Support**: Seamlessly switch between Gemini and OpenRouter (Nemotron, etc.).
- **Markdown Rendering**: Chatbot responses feature clean markdown, lists, and code snippets.
- **Smooth Animations**: Framer Motion animations throughout.
- **Performance Optimized**: Fast loading, SEO optimized, and Next.js 14 performance.

## 📋 Sections

- **Hero/About**: Animated hero section with rotating role text.
- **Skills**: Categorized skills display (Frontend, Backend, Database, DevOps).
- **Experience**: Timeline view of professional experience.
- **Projects**: Showcase of featured projects with live links.
- **Performance Highlights**: Animated statistics.
- **Tech Philosophy**: Development principles and approach.
- **Contact**: Contact form and information.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Vector DB**: Qdrant
- **Embeddings**: Mistral AI (`mistral-embed`)
- **LLMs**: Google Gemini API & OpenRouter (Nemotron)
- **Database**: Supabase (for initial data source)

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

4. Configure your `.env` file (see [Environment Variables](#environment-variables) below).

5. Sync your data to Qdrant (Optional):
```bash
node scripts/sync-to-qdrant.mjs
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
portfolio/
├── app/
│   ├── api/
│   │   └── chat/          # AI chatbot API route
│   ├── globals.css        # Global styles
│   └── page.tsx          # Home page
├── components/
│   ├── sections/          # Page sections (Hero, Skills, Projects, etc.)
│   ├── Chatbot.tsx        # AI chatbot UI with Markdown support
│   └── ...
├── lib/
│   ├── ai/
│   │   └── providers/     # Modular AI provider system
│   │       ├── base.ts    # AI provider interface
│   │       ├── gemini.ts  # Standard Gemini implementation
│   │       ├── qdrant-mistral.ts # RAG Implementation (Retrieval)
│   │       ├── openrouter.ts # OpenRouter Implementation
│   │       └── index.ts   # Provider factory (Switching logic)
│   └── supabase.ts        # Supabase client
├── scripts/
│   └── sync-to-qdrant.mjs # Data synchronization script
└── ...
```

## 🤖 AI Chatbot Architecture

The chatbot uses a highly modular factory pattern allowing for three different modes:

1. **Standard Gemini**: Simple LLM response without database context.
2. **Qdrant RAG (Recommended)**: 
   - **Step 1**: Converts user query to embedding via Mistral AI.
   - **Step 2**: Retrieves relevant records from Qdrant Vector DB.
   - **Step 3**: Passes context to the LLM (Gemini or OpenRouter).
3. **OpenRouter**: Direct access to external models like Nemotron-3.

### Switching Modes
Change the `AI_PROVIDER` and `RAG_GENERATOR` in your `.env` to toggle between systems without changing code.

## 🚀 Deployment

### Environment Variables

Make sure to set these in your deployment platform (Vercel/Netlify):

- `AI_PROVIDER`: `gemini` | `qdrant` | `openrouter`
- `RAG_GENERATOR`: `gemini` | `openrouter`
- `GEMINI_API_KEY`: Your Google Gemini API key
- `MISTRAL_API_KEY`: For generating embeddings
- `QDRANT_URL` & `QDRANT_API_KEY`: For vector storage
- `OPENROUTER_API_KEY`: Optional fallback/alternative LLM
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Data source

## 📄 License

This project is private and proprietary.

## 👤 Author

**Zohaib Asghar**
- Email: mzohaib0677@gmail.com
- Phone: +92 3229911442
- GitHub: [zohaib-9323](https://github.com/zohaib-9323)
- Location: Lahore, Pakistan

---

Built with ❤️ by Zohaib Asghar
