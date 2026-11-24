"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatResponseBody } from "@/types/chat";

const INTRO =
  "CalmChat is a safe space to reflect, breathe, and organize your thoughts. Speak openly about stress, emotions, or confusion — your AI companion listens without judgment.";

const QUOTE =
  "Your mind is not a problem to solve, but a space to understand.";

const QUICK_PROMPTS = [
  { label: "I feel anxious", text: "I feel anxious" },
  { label: "Help me sleep", text: "Help me relax and sleep" },
  { label: "Daily reflection", text: "Let's do a daily reflection" },
] as const;

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [appHeight, setAppHeight] = useState<number | null>(null);
  const scrollerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const viewport = window.visualViewport;

    const syncHeight = () => {
      const visibleHeight = viewport?.height ?? window.innerHeight;
      const keyboardInset = window.innerHeight - visibleHeight;
      setAppHeight(keyboardInset > 80 ? Math.round(visibleHeight) : null);
    };

    syncHeight();
    window.addEventListener("resize", syncHeight);
    viewport?.addEventListener("resize", syncHeight);
    viewport?.addEventListener("scroll", syncHeight);

    return () => {
      window.removeEventListener("resize", syncHeight);
      viewport?.removeEventListener("resize", syncHeight);
      viewport?.removeEventListener("scroll", syncHeight);
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
  }, [messages, loading, error]);

  const send = async (text: string): Promise<void> => {
    const content = text.trim();
    if (!content || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    if (content === input.trim()) setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data: ChatResponseBody = await res.json();

      if (!res.ok || !data.reply) {
        throw new Error(
          data.reply || "Could not send that. Check your connection and try again.",
        );
      }

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Could not send that. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send(input);
  };

  return (
    <div
      className="relative flex h-dvh max-h-dvh flex-col overflow-hidden bg-black text-gray-200 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]"
      style={
        appHeight
          ? { height: appHeight, maxHeight: appHeight }
          : undefined
      }
    >
      <div
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 md:inset-y-0 md:left-auto md:right-0 md:w-1/2 md:opacity-15"
        style={{ backgroundImage: "url('/background.jpeg')" }}
      />

      <div className="relative flex min-h-0 w-full flex-1">
        <aside className="hidden w-72 shrink-0 flex-col justify-between border-r border-gray-800 p-6 md:flex lg:p-8">
          <div>
            <h1 className="mb-4 text-xl font-semibold tracking-wide">
              CalmChat
            </h1>

            <p className="text-sm leading-relaxed text-gray-400">{INTRO}</p>

            <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md lg:mt-10">
              <p className="text-sm text-gray-300 italic">
                &ldquo;{QUOTE}&rdquo;
              </p>

              <p className="mt-3 text-xs text-gray-500">CalmChat Reflection</p>
            </div>
          </div>

          <p className="text-xs text-gray-600">
            AI Companion • Always Available
          </p>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-gray-800 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 md:px-8 md:py-5">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-semibold tracking-wide text-gray-100 md:text-lg md:font-normal md:text-gray-300">
                <span className="md:hidden">CalmChat</span>
                <span className="hidden md:inline">Current Session</span>
              </h2>
              <p className="truncate text-xs text-gray-500 md:hidden">
                A quiet place to talk
              </p>
            </div>

            <button
              type="button"
              className="inline-flex h-11 shrink-0 items-center rounded-full border border-white/15 bg-white/5 px-4 text-sm text-gray-200 active:bg-white/15 md:hidden"
              aria-expanded={aboutOpen}
              aria-controls="about-panel"
              onClick={() => setAboutOpen((open) => !open)}
            >
              {aboutOpen ? "Close" : "About"}
            </button>
          </header>

          {aboutOpen && (
            <section
              id="about-panel"
              className="shrink-0 space-y-4 border-b border-gray-800 px-4 py-4 md:hidden"
            >
              <p className="text-sm leading-relaxed text-gray-400">{INTRO}</p>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">
                <p className="text-sm text-gray-300 italic">
                  &ldquo;{QUOTE}&rdquo;
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  CalmChat Reflection
                </p>
              </div>
            </section>
          )}

          <main
            ref={scrollerRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4 sm:space-y-4 sm:px-6 md:px-10 md:py-8 lg:px-16"
          >
            {messages.length === 0 && !loading && (
              <div className="mx-auto flex max-w-md flex-col gap-2 px-1 pt-6 text-center sm:pt-16">
                <p className="text-sm leading-relaxed text-gray-300">
                  Share what is on your mind.
                </p>
                <p className="text-sm leading-relaxed text-gray-500">
                  Stress, emotions, or a restless night — start with a note, or
                  tap a suggestion below.
                </p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl border border-white/10 px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap shadow-lg backdrop-blur-md sm:max-w-xl sm:px-5 sm:py-4 ${
                    msg.role === "user" ? "bg-white/10" : "bg-white/5"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-sm text-gray-500">CalmChat is thinking...</p>
            )}
          </main>

          <div className="shrink-0 border-t border-white/10 bg-black/75 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
            <div className="relative">
              <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] md:flex-wrap md:justify-center md:overflow-visible md:px-8 [&::-webkit-scrollbar]:hidden">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt.label}
                    type="button"
                    onClick={() => void send(prompt.text)}
                    disabled={loading}
                    className="h-11 shrink-0 rounded-full border border-white/20 bg-white/10 px-4 text-sm whitespace-nowrap backdrop-blur-md transition active:bg-white/20 disabled:opacity-40 md:shrink md:hover:bg-white/20"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black to-transparent md:hidden"
              />
            </div>

            {error && (
              <p className="px-4 pb-2 text-sm text-red-300 md:px-8" role="alert">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="px-3 pb-3 sm:px-4 md:px-8 md:pb-6 lg:px-16">
              <div className="flex items-center overflow-hidden rounded-full border border-white/20 bg-white/10 shadow-xl backdrop-blur-xl">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Share what's on your mind..."
                  enterKeyHint="send"
                  autoComplete="off"
                  aria-label="Message"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base text-white outline-none placeholder:text-gray-400 sm:px-5 sm:py-4"
                />

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="inline-flex h-12 min-w-12 shrink-0 items-center justify-center bg-indigo-600 text-white transition active:bg-indigo-500 disabled:opacity-40 sm:px-6 sm:hover:bg-indigo-500"
                >
                  <span aria-hidden="true">➤</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
