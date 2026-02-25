# Therapy Partner — LangChain + Gemini

## Project Overview

**Therapy Partner** is a simple conversational AI project built using **LangChain** and the **Gemini API**. The application acts as a supportive mental-health conversation partner where users can talk about emotions, stress, daily struggles, and general mental well-being.

The goal of this project is to explore how LLM orchestration with LangChain can be used to create empathetic conversational experiences rather than knowledge-retrieval systems.

This is a learning project and not a production or clinical mental-health solution.

---

## Key Features

* **Conversational Therapy-Style Chat:** Users can talk about thoughts, stress, anxiety, and daily challenges.
* **Gemini-Powered Responses:** Uses Google Gemini models for natural, empathetic conversations.
* **LangChain Orchestration:** Prompt templates and chains structure supportive dialogue.
* **Contextual Conversations:** Maintains short conversational memory for continuity.
* **Lightweight Architecture:** Simple implementation focused on learning LLM workflows.

> Note: This project is not a real therapy tool and should not be used as a replacement for professional mental-health care.

---

## Technical Architecture

### Frontend

* **Framework:** Next.js (App Router) + TypeScript
* **UI:** Minimal chat interface
* **Experience:** Real-time conversational interaction

### Backend / LLM Layer

* **Framework:** LangChain
* **Model Provider:** Google Gemini (API key based)
* **Core Concepts Used:**

  * Prompt templates
  * Conversation chain
  * Memory (basic)
  * Structured responses

---

## How It Works

1. User sends a message.
2. Message is passed into a LangChain conversation chain.
3. Prompt template frames the response as supportive and empathetic.
4. Gemini generates the reply.
5. Conversation memory maintains context for follow-up messages.

---

## Example Use Cases

* Practicing empathetic AI design
* Learning LangChain conversation chains
* Experimenting with Gemini API integration
* Building mental-health style conversational UX
* Prototyping AI companion experiences

---

## Getting Started

This is a Next.js project bootstrapped with **create-next-app**.

### Run the development server

```bash
bun install
bun run dev
```

Open **http://localhost:3000** with your browser to see the result.

You can start editing the page by modifying:

```
app/page.tsx
```

The page auto-updates as you edit the file.

This project uses **next/font** to automatically optimize and load Geist, a font family for Vercel.

---

## Environment Variables

Create a `.env.local` file and add:

```
GEMINI_API_KEY=your_api_key_here
```

---

## Learn More

To learn more about Next.js:

* Next.js Documentation — learn about Next.js features and API
* Learn Next.js — interactive tutorial
* Next.js GitHub repository — feedback and contributions welcome

---

## Deployment

The easiest way to deploy this app is using **Vercel**.

Refer to the official Next.js deployment documentation for more details.

---

## Disclaimer

This project is for educational and experimentation purposes only. It does not provide medical advice, diagnosis, or treatment.
