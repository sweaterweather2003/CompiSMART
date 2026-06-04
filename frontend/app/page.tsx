"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";

interface VideoMetadata {
  video_id: string;
  platform: string;
  creator: string;
  title: string;
  followers: number;
  views: number;
  likes: number;
  comments: number;
  engagement_rate: number;
  transcript: string;
  url: string;
  hashtags: string[];
  upload_date: string;
  duration: number;
}

interface VideoData {
  A: VideoMetadata;
  B: VideoMetadata;
}

// Asset URL Extraction Engine Utilities
const getYouTubeEmbedUrl = (url: string): string => {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?\s*v=|\&v=)([^#\\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return "";
};

const getInstagramEmbedUrl = (url: string): string => {
  if (!url) return "";
  const match = url.match(/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://www.instagram.com/reel/${match[1]}/embed`;
  }
  return "";
};

// Custom layout parser engine to scrub markdown characters and output styled elements natively
const renderCleanConsoleOutput = (text: string) => {
  return text.split("\n").map((line, lineIdx) => {
    let processedLine = line;
    let isBullet = false;

    // Detect and scrub bullet list fragments
    if (processedLine.trim().startsWith("* ")) {
      processedLine = processedLine.replace(/^\s*\*\s+/, "");
      isBullet = true;
    } else if (processedLine.trim().startsWith("- ")) {
      processedLine = processedLine.replace(/^\s*-\s+/, "");
      isBullet = true;
    }

    // Split by markdown bold anchors to convert to styled elements
    const parts = processedLine.split("**");
    const formattedElements = parts.map((part, partIdx) => {
      // Alternating indices correspond to content trapped within double asterisks
      if (partIdx % 2 !== 0) {
        return (
          <strong key={partIdx} style={{ fontWeight: "bold", color: "#ffffff" }}>
            {part}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <div key={lineIdx} style={{ display: "flex", gap: "8px", paddingLeft: "12px", marginBottom: "6px", alignItems: "flex-start" }}>
          <span style={{ color: "#71717a" }}>•</span>
          <span style={{ flex: 1 }}>{formattedElements}</span>
        </div>
      );
    }

    return (
      <div key={lineIdx} style={{ minHeight: "1.5em", marginBottom: "4px" }}>
        {formattedElements}
      </div>
    );
  });
};

export default function Home() {
  // Ingestion Pipeline States
  const [ytUrl, setYtUrl] = useState("");
  const [igUrl, setIgUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  // Vercel AI SDK integration
  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat({
    api: "/api/chat",
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Operational Context Accelerators
  const quickPrompts = [
    "Why did Video A get more engagement than Video B?",
    "Compare the hooks in the first 5 seconds.",
    "Who's the creator of Video B and what's their engagement profile?",
    "Suggest improvements for B based on what worked in A.",
  ];

  const handleProcessVideos = async () => {
    if (!ytUrl || !igUrl) {
      alert("Please specify parameters for both target registries.");
      return;
    }

    setIsProcessing(true);
    try {
      console.log("🚀 Sending request to /api/process-videos with URLs:", { ytUrl, igUrl });

      const res = await fetch("/api/process-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtube_url: ytUrl, instagram_url: igUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ API Error Response:", data);
        throw new Error(data.error || data.message || "Failed to process videos");
      }

      console.log("✅ Videos processed successfully:", data);
      setVideoData(data.data);

    } catch (error: any) {
      console.error("Pipeline failure executing ingestion protocol:", error);
      alert("Failed to process target video vectors: " + (error.message || "Check browser console for details"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main style={{ minHeight: "100vh", backgroundColor: "#000000", color: "#ffffff", padding: "24px", fontFamily: "monospace", boxSizing: "border-box" }}>
      
      {/* High-contrast scrollbar and loading pulse styling for the data stream console */}
      <style dangerouslySetInnerHTML={{__html: `
        .console-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .console-scrollbar::-webkit-scrollbar-track {
          background: #000000;
          border-left: 1px solid #27272a;
        }
        .console-scrollbar::-webkit-scrollbar-thumb {
          background: #3f3f46;
        }
        .console-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #71717a;
        }
        @keyframes botPulse {
          0% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.3; transform: scale(0.95); }
        }
        .bot-pulse-icon {
          display: inline-block;
          animation: botPulse 1.4s infinite ease-in-out;
        }
      `}} />

      {/* Structural Header Panel */}
      <header style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "24px", marginBottom: "32px", border: "2px solid #27272a", backgroundColor: "#09090b" }}>
        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 900, margin: 0, fontFamily: "serif", letterSpacing: "-1px" }}>CORE TO CONVERSION RAG</h1>
          <p style={{ fontSize: "11px", textTransform: "uppercase", color: "#a1a1aa", margin: "4px 0 0 0", letterSpacing: "1px" }}>
            SOCIAL ENGINE ANALYTICS // VECTOR REGISTRY FRAME STACK
          </p>
        </div>
        <div style={{ fontSize: "11px", textTransform: "uppercase", backgroundColor: "#18181b", border: "1px solid #27272a", padding: "6px 12px", color: "#e4e4e7" }}>
          SYSTEM STATUS: {isProcessing ? "PROCESSING VECTOR" : "ONLINE"}
        </div>
      </header>

      {/* Dynamic Data Ingestion Control Console */}
      <section style={{ border: "2px solid #27272a", padding: "24px", marginBottom: "32px", backgroundColor: "#09090b" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 900, margin: "0 0 20px 0", textTransform: "uppercase", letterSpacing: "-0.5px" }}>
          🔗 Ingestion Engine Protocol
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "bold", color: "#71717a", marginBottom: "8px" }}>
              // YouTube Target Asset (Video A)
            </label>
            <input
              type="text"
              placeholder="Paste YouTube resource URL..."
              value={ytUrl}
              onChange={(e) => setYtUrl(e.target.value)}
              disabled={isProcessing}
              style={{ width: "100%", boxSizing: "border-box", padding: "14px", backgroundColor: "#000000", border: "1px solid #27272a", color: "#ffffff", fontSize: "13px", outline: "none" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", fontWeight: "bold", color: "#71717a", marginBottom: "8px" }}>
              // Instagram Target Asset (Video B)
            </label>
            <input
              type="text"
              placeholder="Paste Instagram Reel resource URL..."
              value={igUrl}
              onChange={(e) => setIgUrl(e.target.value)}
              disabled={isProcessing}
              style={{ width: "100%", boxSizing: "border-box", padding: "14px", backgroundColor: "#000000", border: "1px solid #27272a", color: "#ffffff", fontSize: "13px", outline: "none" }}
            />
          </div>
        </div>

        <button
          onClick={handleProcessVideos}
          disabled={isProcessing}
          style={{ width: "auto", padding: "14px 28px", backgroundColor: "#ffffff", color: "#000000", fontWeight: "bold", textTransform: "uppercase", fontSize: "12px", border: "none", cursor: "pointer", letterSpacing: "0.5px" }}
        >
          {isProcessing ? "COMPILING INDEX MATCHES..." : "EXECUTE INGESTION PIPELINE"}
        </button>
      </section>

      {/* Primary Workspace Division Layout Split Frame */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: "32px", alignItems: "start" }}>
        
        {/* LEFT COMPONENT BLOCK: PERFORMANCE DIAGNOSTICS MATRIX */}
        <section style={{ border: "2px solid #27272a", padding: "24px", backgroundColor: "#09090b" }}>
          
          {/* Internal Title Node */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #27272a", paddingBottom: "14px", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 900, margin: 0, textTransform: "uppercase" }}>
              📊 PERFORMANCE DIAGNOSTICS MATRIX
            </h2>
            <span style={{ fontSize: "10px", textTransform: "uppercase", color: "#a1a1aa", border: "1px solid #27272a", padding: "4px 8px", backgroundColor: "#18181b" }}>
              Side-By-Side Asset Tracking Grid
            </span>
          </div>

          {/* Sub-Card Grid Frame Split */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
            {/* Video Card A Container */}
            <div style={{ border: "1px solid #27272a", padding: "20px", position: "relative", backgroundColor: "#000000", minHeight: "620px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ position: "absolute", top: 0, right: 0, backgroundColor: "#ffffff", color: "#000000", fontSize: "9px", fontWeight: "bold", padding: "3px 8px", textTransform: "uppercase" }}>
                ID: VIDEO A (YOUTUBE)
              </div>
              
              <div style={{ marginTop: "16px", flex: 1 }}>
                {videoData ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Title:</span>{" "}
                      <span style={{ fontWeight: "bold", color: "#ffffff" }}>{videoData.A.title || "N/A"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>URL:</span>{" "}
                      <a href={videoData.A.url} target="_blank" rel="noreferrer" style={{ color: "#ffffff", textDecoration: "underline", wordBreak: "break-all", fontSize: "12px" }}>
                        {videoData.A.url}
                      </a>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Creator:</span>{" "}
                      <span>{videoData.A.creator}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Followers:</span>{" "}
                      <span>{videoData.A.followers ? videoData.A.followers.toLocaleString() : "0"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Views:</span>{" "}
                      <span>{videoData.A.views ? videoData.A.views.toLocaleString() : "0"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Likes:</span>{" "}
                      <span>{videoData.A.likes ? videoData.A.likes.toLocaleString() : "0"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Comments:</span>{" "}
                      <span>{videoData.A.comments ? videoData.A.comments.toLocaleString() : "0"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Duration:</span>{" "}
                      <span>{videoData.A.duration ? `${videoData.A.duration}s` : "N/A"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Upload Date:</span>{" "}
                      <span>{videoData.A.upload_date || "N/A"}</span>
                    </div>
                    
                    {/* Always visible Hashtags slab for YouTube */}
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Hashtags:</span>{" "}
                      <span style={{ color: "#a1a1aa", fontSize: "11px" }}>
                        {videoData.A.hashtags && videoData.A.hashtags.length > 0 ? videoData.A.hashtags.join(" ") : "N/A"}
                      </span>
                    </div>
                    
                    <div style={{ border: "1px solid #27272a", padding: "12px", backgroundColor: "#18181b", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                      <span style={{ fontSize: "10px", color: "#a1a1aa", fontWeight: "bold" }}>ENGAGEMENT:</span>
                      <span style={{ fontSize: "18px", fontWeight: 900, color: "#34d399" }}>{videoData.A.engagement_rate ? videoData.A.engagement_rate.toFixed(2) : "0.00"}%</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#52525b", fontSize: "11px", textTransform: "uppercase" }}>
                    [ Awaiting Position A Matrix Registration ]
                  </div>
                )}
              </div>

              {/* Integrated Media Stream Frame Viewport A */}
              <div style={{ marginTop: "16px", borderTop: "1px solid #27272a", paddingTop: "16px" }}>
                <span style={{ display: "block", fontSize: "10px", color: "#71717a", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>
                  // LIVE MEDIA VIEWPORT A
                </span>
                <div style={{ width: "100%", height: "180px", backgroundColor: "#09090b", border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {videoData && getYouTubeEmbedUrl(videoData.A.url) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(videoData.A.url)}
                      title="YouTube Media Feed Viewport"
                      style={{ width: "100%", height: "100%", border: "none" }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <span style={{ fontSize: "10px", color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      [ Stream Offline ]
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Video Card B Container */}
            <div style={{ border: "1px solid #27272a", padding: "20px", position: "relative", backgroundColor: "#000000", minHeight: "620px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ position: "absolute", top: 0, right: 0, backgroundColor: "#ffffff", color: "#000000", fontSize: "9px", fontWeight: "bold", padding: "3px 8px", textTransform: "uppercase" }}>
                ID: VIDEO B (INSTAGRAM)
              </div>
              
              <div style={{ marginTop: "16px", flex: 1 }}>
                {videoData ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px" }}>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Title:</span>{" "}
                      <span style={{ fontWeight: "bold", color: "#ffffff" }}>{videoData.B.title || "N/A"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>URL:</span>{" "}
                      <a href={videoData.B.url} target="_blank" rel="noreferrer" style={{ color: "#ffffff", textDecoration: "underline", wordBreak: "break-all", fontSize: "12px" }}>
                        {videoData.B.url}
                      </a>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Creator:</span>{" "}
                      <span>{videoData.B.creator}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Followers:</span>{" "}
                      <span>{videoData.B.followers ? videoData.B.followers.toLocaleString() : "0"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Views:</span>{" "}
                      <span>{videoData.B.views ? videoData.B.views.toLocaleString() : "0"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Likes:</span>{" "}
                      <span>{videoData.B.likes ? videoData.B.likes.toLocaleString() : "0"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Comments:</span>{" "}
                      <span>{videoData.B.comments ? videoData.B.comments.toLocaleString() : "0"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Duration:</span>{" "}
                      <span>{videoData.B.duration ? `${videoData.B.duration}s` : "N/A"}</span>
                    </div>
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Upload Date:</span>{" "}
                      <span>{videoData.B.upload_date || "N/A"}</span>
                    </div>
                    
                    {/* Always visible Hashtags slab for Instagram */}
                    <div style={{ borderBottom: "1px solid #18181b", paddingBottom: "6px" }}>
                      <span style={{ color: "#71717a", fontWeight: "bold" }}>Hashtags:</span>{" "}
                      <span style={{ color: "#a1a1aa", fontSize: "11px" }}>
                        {videoData.B.hashtags && videoData.B.hashtags.length > 0 ? videoData.B.hashtags.join(" ") : "N/A"}
                      </span>
                    </div>
                    
                    <div style={{ border: "1px solid #27272a", padding: "12px", backgroundColor: "#18181b", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                      <span style={{ fontSize: "10px", color: "#a1a1aa", fontWeight: "bold" }}>ENGAGEMENT:</span>
                      <span style={{ fontSize: "18px", fontWeight: 900, color: "#f59e0b" }}>{videoData.B.engagement_rate ? videoData.B.engagement_rate.toFixed(2) : "0.00"}%</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#52525b", fontSize: "11px", textTransform: "uppercase" }}>
                    [ Awaiting Position B Matrix Registration ]
                  </div>
                )}
              </div>

              {/* Integrated Media Stream Frame Viewport B */}
              <div style={{ marginTop: "16px", borderTop: "1px solid #27272a", paddingTop: "16px" }}>
                <span style={{ display: "block", fontSize: "10px", color: "#71717a", fontWeight: "bold", marginBottom: "8px", textTransform: "uppercase" }}>
                  // LIVE MEDIA VIEWPORT B
                </span>
                <div style={{ width: "100%", height: "180px", backgroundColor: "#09090b", border: "1px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                  {videoData && getInstagramEmbedUrl(videoData.B.url) ? (
                    <div style={{ width: "320px", height: "310px", display: "flex", alignItems: "center", justifyContent: "center", transform: "scale(0.55)", transformOrigin: "center center", position: "absolute" }}>
                      <iframe
                        src={getInstagramEmbedUrl(videoData.B.url)}
                        title="Instagram Media Feed Viewport"
                        style={{ width: "320px", height: "310px", border: "none", backgroundColor: "#000000" }}
                        scrolling="no"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <span style={{ fontSize: "10px", color: "#3f3f46", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      [ Stream Offline ]
                    </span>
                  )}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* RIGHT COMPONENT BLOCK: EXECUTION DIAGNOSTICS MATRIX PANEL / CHAT HUB */}
        <section style={{ border: "2px solid #27272a", backgroundColor: "#09090b", display: "flex", flexDirection: "column", height: "765px", overflow: "hidden" }}>
          
          {/* Top Panel Console Header */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #27272a", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#000000" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", letterSpacing: "0.5px" }}>💬 EXECUTION DIAGNOSTICS CONTROL HUB</span>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34d399" }}></span>
              <span style={{ fontSize: "10px", color: "#71717a" }}>RAG CONSOLE ACTIVE</span>
            </div>
          </div>

          {/* Internal Horizontal Split View for Prompt Accelerators vs Viewports */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", flex: 1, overflow: "hidden", minHeight: 0 }}>
            
            {/* Quick Prompts Toolbar Sub-Panel */}
            <div style={{ borderRight: "1px solid #27272a", padding: "16px", backgroundColor: "#000000", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", color: "#a1a1aa", marginBottom: "14px", borderBottom: "1px solid #18181b", paddingBottom: "4px" }}>
                  Quick Prompts
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => append({ role: "user", content: prompt })}
                      style={{ width: "100%", textAlign: "left", padding: "8px", backgroundColor: "#09090b", border: "1px solid #27272a", color: "#ffffff", fontSize: "11px", cursor: "pointer", outline: "none", lineBreak: "anywhere" }}
                    >
                      → "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: "10px", color: "#52525b", lineHeight: "1.4", textTransform: "uppercase" }}>
                // Verify vector coordinates are compiled completely prior to launching high-density evaluation loops.
              </div>
            </div>

            {/* Live Message Stream Console Shell */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", backgroundColor: "#000000", minHeight: 0 }}>
              
              {/* Context Container Viewport with custom scrollbar and bounded minHeight to prevent flex clipping */}
              <div className="console-scrollbar" style={{ flex: 1, overflowY: "auto", minHeight: 0, padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
                {messages.length === 0 ? (
                  <div style={{ padding: "16px", border: "1px solid #27272a", backgroundColor: "#09090b" }}>
                    <div style={{ fontSize: "10px", color: "#71717a", marginBottom: "4px", fontWeight: "bold" }}>
                      // CORE STATUS INTERFACE
                    </div>
                    <div style={{ fontSize: "12px", lineHeight: "1.5", color: "#e4e4e7" }}>
                      Contextual RAG instance initialized. Provide source data structures on the interface console to trigger execution frameworks.
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      style={{ padding: "16px", border: "1px solid #27272a", backgroundColor: message.role === "user" ? "#18181b" : "#09090b" }}
                    >
                      <div style={{ fontSize: "10px", color: "#71717a", marginBottom: "6px", fontWeight: "bold" }}>
                        // {message.role === "user" ? "CREATOR QUERY" : "ANALYTICS SYSTEM ENGINE"}
                      </div>
                      <div style={{ fontSize: "13px", lineHeight: "1.5", color: "#ffffff" }}>
                        {renderCleanConsoleOutput(message.content)}
                      </div>
                    </div>
                  ))
                )}

                {/* Animated Cute Bot Loading Frame Block */}
                {isLoading && (
                  <div style={{ padding: "16px", border: "1px dashed #3f3f46", backgroundColor: "#09090b" }}>
                    <div style={{ fontSize: "10px", color: "#71717a", marginBottom: "6px", fontWeight: "bold" }}>
                      // PIPELINE EXECUTION IN PROGRESS
                    </div>
                    <div style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "10px", color: "#a1a1aa" }}>
                      <span className="bot-pulse-icon" style={{ fontSize: "16px" }}>🤖</span>
                      <span style={{ color: "#34d399", fontWeight: "bold" }}>q(❂_❂)p</span>
                      <span style={{ letterSpacing: "0.5px" }}>Compiling response vectors...</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Interactive Text Processing Pipeline Submission Form */}
              <form
                onSubmit={handleSubmit}
                style={{ borderTop: "1px solid #27272a", padding: "16px", backgroundColor: "#000000", display: "flex", gap: "12px" }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Query video transcript architecture or diagnostic deviations..."
                  style={{ flex: 1, padding: "12px", backgroundColor: "#09090b", border: "1px solid #27272a", color: "#ffffff", fontSize: "12px", outline: "none" }}
                />
                <button
                  type="submit"
                  style={{ padding: "0 24px", backgroundColor: "#ffffff", color: "#000000", fontWeight: "bold", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px", border: "none", cursor: "pointer" }}
                >
                  Execute
                </button>
              </form>

            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
