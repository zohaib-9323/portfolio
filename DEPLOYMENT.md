# Deployment Guide

This guide covers deploying the portfolio website to various platforms.

## 🚀 Vercel Deployment (Recommended)

Vercel is the recommended platform for Next.js applications.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_api_key_here`
   - Redeploy if needed

4. **Deploy**
   - Click "Deploy"
   - Your site will be live at `your-project.vercel.app`

### Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

## 🌐 Alternative Deployment Options

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `.next`
3. **Environment Variables**: Add `GEMINI_API_KEY` in Netlify dashboard

### AWS Amplify

1. Connect your GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Output directory: `.next`
3. Add environment variable: `GEMINI_API_KEY`

### Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t portfolio .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key portfolio
```

## 🔐 Environment Variables

Required environment variables for production:

- `GEMINI_API_KEY`: Your Google Gemini API key

Optional (for future Qdrant integration):
- `QDRANT_URL`: Qdrant server URL
- `QDRANT_API_KEY`: Qdrant API key
- `OPENAI_API_KEY`: OpenAI API key (if using OpenAI embeddings)

## ✅ Pre-Deployment Checklist

- [ ] All environment variables are set
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes without errors
- [ ] Test chatbot functionality
- [ ] Verify all external links work
- [ ] Check mobile responsiveness
- [ ] Test dark/light mode toggle
- [ ] Verify SEO metadata

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (requires 18+)
- Verify all dependencies are installed
- Check for TypeScript errors: `npm run build`

### Chatbot Not Working
- Verify `GEMINI_API_KEY` is set correctly
- Check browser console for errors
- Verify API route is accessible: `/api/chat`

### Styling Issues
- Clear `.next` cache: `rm -rf .next`
- Rebuild: `npm run build`

## 📊 Performance Optimization

- Images: Use Next.js Image component for optimized images
- Fonts: Consider using `next/font` for font optimization
- Analytics: Add Vercel Analytics or Google Analytics if needed

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to main branch. For other branches:
- Create preview deployments in Vercel dashboard
- Or use GitHub Actions for custom CI/CD
