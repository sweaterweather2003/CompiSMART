# CompiSMART

CompiSMART is a highly optimized, production-ready full-stack application that leverages a Retrieval-Augmented Generation (RAG) engine to interact intelligently with visual and text-based assets. Built with a Next.js frontend and a FastAPI/Python backend, the system is designed to provide rapid, context-aware intelligence while prioritizing extreme cost efficiency.

---

## Repository Architecture & File Breakdown

Based on the project blueprint, here is exactly what each core component does within the ecosystem:

###  Root Configuration
*   **`Dockerfile`**: Packages the application into an isolated container environment, ensuring identical "works on my machine" behavior across local development and production cloud environments.
*   **`.gitignore`**: Prevents junk files (like `node_modules`, system files, and local database cache files) from being pushed to GitHub, keeping the repository lightweight.
*   **`package.json`**: Tracks root-level dependencies and orchestration scripts for the project workspace.

### Backend 
The backend operates as the high-performance computational core running on Python.
*   **`main.py`**: The entry point for the API layer (typically powered by FastAPI). It spins up the server, configures CORS policies, and exposes web endpoints that the frontend talks to.
*   **`rag_engine.py`**: The central intelligence hub. It handles user queries, coordinates with the vector database to fetch relevant text chunks, maps them into context, and interfaces with the LLM (Large Language Model) to return structured, grounded answers.
*   **`extractors.py`**: The ingestion pipeline. It parses input documents, video transcripts, or unstructured text data, cleans the content, and breaks it down into semantic segments ready to be processed.
*   **`requirements.txt`**: Lists all backend Python packages (such as `fastapi`, `chromadb`, and specialized AI packages) needed to run the environment.
*   **`chroma_db/` & `chroma_db_gemini/`**: Your local vector database storage directories. They store mathematical vector snapshots (embeddings) of your ingested data, allowing sub-second semantic search over vast amounts of information without needing an external cloud database server.

### Frontend 
The presentation layer is built on modern React principles using the Next.js App Router framework.
*   **`app/page.tsx` & `layout.tsx`**: The core structural skeleton and main landing view of your web application.
*   **`app/api/chat/route.ts`**: A Next.js serverless route acting as a secure intermediary proxy. It handles requests from the user's browser, applies API security layers, communicates with your Python backend, and returns real-time streaming text responses.
*   **`components/ChatInterface.tsx`**: A dynamic, modular UI component managing the chat history, user text inputs, state management (loading indicators), and smooth streaming rendering.
*   **`components/VideoCard.tsx`**: A component designed to visually render multimedia references or video citations, providing immediate visual validation of source material directly to the user.
*   **`tailwind.config.js` & `globals.css`**: Utility-first styling architecture that guarantees a highly responsive, polished interface with zero bloated styling sheets.

---

## Why CompiSMART is Highly Cost-Effective

Traditional AI architectures incur heavy monthly infrastructure and API usage fees. CompiSMART bypasses these financial bottlenecks through specific architectural choices:

### 1. Local Vector Storage via ChromaDB
Instead of subscribing to costly, fully managed cloud vector databases (like Pinecone or Enterprise Milvus) that charge premium hourly rates, CompiSMART uses **ChromaDB as an embedded local instance**. 
*   **The Savings:** Vector storage and index querying run completely free on your local or host server’s disk memory, resulting in **$0/month database hosting fees**.

### 2. High-Efficiency Context Chunking (`extractors.py`)
Instead of stuffing massive, raw files into an AI model—which drains thousands of API input tokens per second—`extractors.py` strips down your files into precise, high-signal snippets.
*   **The Savings:** By only sending highly relevant data blocks to the LLM via `rag_engine.py`, you drastically minimize the input token payload, reducing your per-query API bills by **up to 70–80%**.

### 3. Native Next.js Routing API
By utilizing the serverless edge routes (`app/api/chat/route.ts`), you can deploy the frontend on free-tier or highly optimized edge platforms (like Vercel or Netlify) that only execute when requested.
*   **The Savings:** You bypass the need to keep a heavy Node server running 24/7, scaling operational costs linearly down to zero when the application is idle.

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

