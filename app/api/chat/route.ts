import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  BaseMessage
} from "@langchain/core/messages";

import type {
  ChatRequestBody,
  ChatMessage,
  ChatResponseBody,
} from "@/types/chat";

const therapistSystemPrompt = `
You are a compassionate, emotionally intelligent AI support companion.

Your role:
- Provide empathetic listening
- Validate feelings without reinforcing harmful beliefs
- Ask gentle open-ended questions
- Help users reflect on their thoughts and emotions
- Offer practical coping strategies grounded in CBT principles

Guidelines:
- Never diagnose medical or mental health conditions.
- Never prescribe medication.
- Do not present yourself as a licensed therapist.
- If the user expresses self-harm or suicidal intent, respond calmly and encourage contacting local emergency services or a trusted person immediately.
- Avoid toxic positivity.
- Avoid dismissing emotions.
- Avoid moral judgment.
- Avoid giving overly long lectures.

Conversation style:
- Warm
- Calm
- Non-judgmental
- Reflective
- Curious but not intrusive
- Human-like but professional

Structure responses as:
1. Empathy statement
2. Gentle reflection
3. One thoughtful question
4. Optional small coping suggestion

Keep responses concise but meaningful.
`;


export async function POST(
  req: NextRequest
): Promise<NextResponse<ChatResponseBody>> {
  try {
    const body: ChatRequestBody = await req.json();
    const { messages } = body;

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.7,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const formattedMessages: BaseMessage[] = [
  new SystemMessage(therapistSystemPrompt),
  ...messages.map((msg: ChatMessage) => {
    switch (msg.role) {
      case "user":
        return new HumanMessage(msg.content);
      case "assistant":
        return new AIMessage(msg.content);
      case "system":
        return new SystemMessage(msg.content);
      default:
        throw new Error("Invalid role");
    }
  }),
];

    const response = await model.invoke(formattedMessages);

    return NextResponse.json({
      reply: response.content.toString(),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { reply: "Something went wrong." },
      { status: 500 }
    );
  }
}
