import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from rag_engine import process_and_store_videos, get_rag_chain
from extractors import get_youtube_data, get_instagram_data  # ← Added this

app = FastAPI()

# Enable CORS for cross-port internal routing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Updated to accept URLs instead of full data objects
class VideoIngestionRequest(BaseModel):
    youtube_url: str
    instagram_url: str

class ChatRequest(BaseModel):
    input: str
    chat_history: list = []

@app.get("/")
async def root():
    return {"status": "online", "engine": "CompiSmart RAG Backend"}

@app.post("/api/process-videos")
async def process_videos(payload: VideoIngestionRequest):
    try:
        # Fetch metadata from both platforms
        video_a_data = get_youtube_data(payload.youtube_url)
        video_b_data = get_instagram_data(payload.instagram_url)
        
        # Process and store in vector database
        success = process_and_store_videos(video_a_data, video_b_data)
        
        if not success:
            raise HTTPException(status_code=500, detail="Vector processing failed internal to engine.")
        
        # Return data in the format the frontend expects
        return {
            "success": True,
            "message": "Vectors processed and stored successfully.",
            "data": {
                "A": video_a_data,
                "B": video_b_data
            }
        }
    except Exception as e:
        print(f"Ingestion error: {e}")  # For debugging
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
async def chat_endpoint(payload: ChatRequest):
    try:
        chain = get_rag_chain()
        response = chain.invoke({
            "input": payload.input, 
            "chat_history": payload.chat_history
        })
        
        # Extract text from LangChain response
        answer = response.content if hasattr(response, "content") else str(response)
        return {"answer": answer}
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))