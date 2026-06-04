# Step 1: Build the Next.js frontend application
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Step 2: Set up the final unified execution environment
FROM python:3.11-slim
WORKDIR /app

# Install system dependencies and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

RUN pip install --no-cache-dir \
    instaloader \
    youtube-transcript-api \
    yt-dlp \
    langchain-text-splitters \
    langchain-google-genai \
    langchain-community

# Copy files
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/

WORKDIR /app/frontend
RUN npm install --only=production --legacy-peer-deps
RUN npm install -g concurrently

WORKDIR /app
EXPOSE 10000

# Improved startup with delay to ensure backend starts first
CMD ["sh", "-c", "sleep 8 && concurrently \
  \"PYTHONPATH=/app:/app/backend uvicorn backend.main:app --host 0.0.0.0 --port 8001\" \
  \"npm run start --prefix /app/frontend -- -p 10000\" \
  --names backend,frontend \
  --kill-others-on-fail"]
