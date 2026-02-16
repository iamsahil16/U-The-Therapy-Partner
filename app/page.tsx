"use client";

import { useState } from "react";
import type { ChatMessage, ChatResponseBody } from "@/types/chat";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: updatedMessages }),
    });

    const data: ChatResponseBody = await res.json();

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: data.reply,
    };

    setMessages([...updatedMessages, assistantMessage]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7f6] to-[#e8f0ed] flex flex-col">
      
      {/* Header */}
      <header className="py-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-700">
          CalmChat - Your AI Therapist
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          A supportive place to reflect and breathe
        </p>
      </header>

      {/* Chat Container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 flex flex-col">
        
        <div className="flex-1 overflow-y-auto space-y-4 pb-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#d9e8e2] text-gray-800"
                    : "bg-white text-gray-700"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="text-gray-400 text-sm">
              Taking a moment to respond...
            </div>
          )}
        </div>

        {/* Input Section */}
        <div className="border-t border-gray-200 py-4">
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              className="flex-1 px-4 py-3 rounded-full bg-black shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#b7d3c8] transition"
            />

            <button
              onClick={sendMessage}
              className="px-5 py-3 rounded-full bg-black text-gray-200 text-sm font-medium shadow-sm hover:opacity-90 transition"
            >
              Send
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
