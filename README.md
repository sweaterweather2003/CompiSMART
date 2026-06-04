# CompiSMART - Core to Conversion RAG

A powerful **Social Media Analytics RAG System** that compares YouTube and Instagram videos using Retrieval-Augmented Generation (RAG), vector embeddings, and Google Gemini.

##  Features

- **Side-by-Side Video Analysis**: Compare performance between YouTube and Instagram content
- **Real-time Metrics**: Views, likes, comments, engagement rate, followers
- **Transcript Analysis**: Deep understanding of video content using RAG
- **Smart Chat Interface**: Ask natural language questions about both videos
- **Vector Database**: Powered by Chroma + Gemini embeddings
- **Beautiful Dark UI**: Built with Next.js and Tailwind

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: FastAPI, Python
- **AI/Embeddings**: Google Gemini (gemini-1.5-flash + gemini-embedding-2)
- **Vector Store**: ChromaDB
- **Scraping**: `youtube-transcript-api`, `instaloader`
- **Deployment**: Render.com 

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google API Key (Gemini)

### Setup
```bash
backend:
cd backend
pip install requirements.txt
python main.py

forntend:
cd frontend
npm install
npm run dev

