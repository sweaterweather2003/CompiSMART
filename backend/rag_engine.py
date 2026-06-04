import os
from pathlib import Path
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain.chains import create_history_aware_retriever, create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from dotenv import load_dotenv

backend_dir = Path(__file__).resolve().parent
load_dotenv(dotenv_path=backend_dir / ".env")

if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("CRITICAL ERROR: GOOGLE_API_KEY is missing from your .env file!")

# Updated to working models
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)
embeddings = GoogleGenerativeAIEmbeddings(model="gemini-embedding-2")   # ← Fixed here

vector_store = Chroma(
    embedding_function=embeddings, 
    persist_directory=str(backend_dir / "chroma_db_gemini")
)

def process_and_store_videos(video_a_data: dict, video_b_data: dict) -> bool:
    docs = []
    video_ids = []
    
    for data in [video_a_data, video_b_data]:
        try:
            engagement_rate = f"{float(data['engagement_rate']):.2f}%"
        except (ValueError, TypeError):
            engagement_rate = "N/A"
            
        tags_str = ", ".join(data.get("hashtags", [])) if data.get("hashtags") else "None"
        
        content = (
            f"Platform: {data['platform']}\n"
            f"Creator: {data['creator']}\n"
            f"Follower Count: {data['followers']:,} followers\n"
            f"Upload Date: {data.get('upload_date', 'N/A')}\n"
            f"Duration: {data.get('duration', 0)} seconds\n"
            f"Metrics: {data['views']:,} views, {data['likes']:,} likes, {data['comments']:,} comments.\n"
            f"Engagement Rate: {engagement_rate}\n"
            f"Hashtags: {tags_str}\n\n"
            f"Transcript: {data['transcript']}\n\n"
            f"URL: {data['url']}"
        )
        
        doc = Document(
            page_content=content,
            metadata={
                "video_id": data["video_id"],
                "platform": data["platform"],
                "url": data["url"],
            }
        )
        docs.append(doc)
        video_ids.append(data["video_id"])

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)
    
    try:
        existing = vector_store.get(where={"video_id": {"$in": video_ids}})
        if existing and existing['ids']:
            vector_store.delete(ids=existing['ids'])
    except Exception:
        pass
    
    vector_store.add_documents(chunks)
    return True

def get_rag_chain():
    retriever = vector_store.as_retriever(search_kwargs={"k": 4})
    
    contextualize_q_system_prompt = (
        "Given a chat history and the latest user question "
        "which might reference context in the chat history, "
        "formulate a standalone question which can be understood "
        "without the chat history. Do NOT answer the question, "
        "just reformulate it if needed and otherwise return it as is."
    )
    contextualize_q_prompt = ChatPromptTemplate.from_messages([
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    history_aware_retriever = create_history_aware_retriever(llm, retriever, contextualize_q_prompt)

    system_prompt = (
        "You are an expert social media analyst. Use the following pieces of retrieved context to answer "
        "the question. Compare Video A and Video B based on metadata, engagement, and transcripts.\n"
        "Pay special attention to follower counts, upload dates, durations, and hashtags when requested.\n"
        "Always cite your sources (e.g., 'According to Video A's transcript...'). "
        "If you don't know the answer, say that you don't know.\n\n"
        "{context}"
    )
    qa_prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ])
    
    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)
    
    return rag_chain
