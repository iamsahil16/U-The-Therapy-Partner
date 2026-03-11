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

  const sendQuickMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: text,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
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
    <div className="min-h-screen flex bg-black text-gray-200 relative overflow-hidden">

      {/* RIGHT SIDE BACKGROUND IMAGE */}
      <div
        className="absolute right-0 top-0 h-full w-1/2 bg-cover bg-center opacity-15 pointer-events-none"
        style={{ backgroundImage: "url('/background.jpeg')" }}
      />

      <div className="relative flex w-full">

        {/* LEFT PANEL */}
        <aside className="w-72 border-r border-gray-800 p-8 hidden md:flex flex-col justify-between">

          <div>
            <h1 className="text-xl font-semibold mb-4 tracking-wide">
              CalmChat
            </h1>

            <p className="text-sm text-gray-400 leading-relaxed">
              CalmChat is a safe space to reflect, breathe, and organize your
              thoughts. Speak openly about stress, emotions, or confusion —
              your AI companion listens without judgment.
            </p>

            <div className="mt-10 p-5 backdrop-blur-md bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm text-gray-300 italic">
                &ldquo;Your mind is not a problem to solve, but a space to understand.&rdquo;
              </p>

              <p className="text-xs text-gray-500 mt-3">
                CalmChat Reflection
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-600">
            AI Companion • Always Available
          </p>

        </aside>

        {/* MAIN CHAT AREA */}
        <div className="flex flex-col flex-1">

          {/* HEADER */}
          <header className="px-10 py-6 border-b border-gray-800">
            <h2 className="text-lg text-gray-300">
              Current Session
            </h2>
          </header>

          {/* CHAT */}
          <main className="flex-1 overflow-y-auto px-8 md:px-20 py-10 space-y-6">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xl px-5 py-4 rounded-2xl text-sm shadow-lg backdrop-blur-md border border-white/10 ${
                    msg.role === "user"
                      ? "bg-white/10"
                      : "bg-white/5"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-gray-500 text-sm">
                CalmChat is thinking...
              </p>
            )}

          </main>

          {/* QUICK BUTTONS */}
          <div className="flex justify-center gap-3 mb-4">

            <button
              onClick={() => sendQuickMessage("I feel anxious")}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm hover:bg-white/20 transition"
            >
              I feel anxious
            </button>

            <button
              onClick={() => sendQuickMessage("Help me relax and sleep")}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm hover:bg-white/20 transition"
            >
              Help me sleep
            </button>

            <button
              onClick={() => sendQuickMessage("Let's do a daily reflection")}
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm hover:bg-white/20 transition"
            >
              Daily reflection
            </button>

          </div>

          {/* INPUT BAR */}
          <div className="px-8 md:px-20 pb-8">

            <div className="flex items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-full shadow-xl overflow-hidden">

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share what's on your mind..."
                className="flex-1 px-6 py-4 text-white placeholder-gray-400 bg-transparent outline-none"
              />

              <button
                onClick={sendMessage}
                className="px-6 py-4 bg-indigo-600 text-white hover:bg-indigo-500 transition"
              >
                ➤
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}