import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { prisma } from "../../../../prisma/prisma";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
export async function POST(request: Request) {
  try {
    const { prompt, sessionId, model, systemInstruction, thinkingBudget, modelConfig } = await request.json();
    let currentSessionId = sessionId;
    let isNewSession = !currentSessionId;
    let session;
    if (isNewSession) {
      session = await prisma.chatSession.create({ data: { name: "New Chat" } });
      currentSessionId = session.id;
    } else {
      session = await prisma.chatSession.findUnique({ where: { id: currentSessionId }, include: { messages: true } });
      if (!session) {
        return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
      }
    }
    const userMessage = await prisma.chatMessage.create({ data: { sessionId: currentSessionId, type: "user", content: prompt } });
    const chatHistory = await prisma.chatMessage.findMany({ where: { sessionId: currentSessionId }, orderBy: { createdAt: "asc" } });
    const currentDateTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
    const currentLocation = "Siliguri, West Bengal, India";
    const baseSystemInstruction = `You are Gemini, created by Shovit Dutta, currently located in ${currentLocation}. The current date and time is ${currentDateTime}.`;
    const combinedInstruction = `${baseSystemInstruction} ${systemInstruction} Only reveal location and time information if explicitly asked.`;
    const fewShotExamples = [
      { role: "user", parts: [{ text: "Classify: Rhino" }] },
      { role: "model", parts: [{ text: "The answer is: large" }] },
      { role: "user", parts: [{ text: "Classify: Mouse" }] },
      { role: "model", parts: [{ text: "The answer is: small" }] },
    ];
    const contents = [
      ...fewShotExamples,
      ...chatHistory.map(message => ({ role: message.type === "user" ? "user" : "model", parts: [{ text: message.content }] })),
      { role: "user", parts: [{ text: combinedInstruction }, { text: prompt }] },
    ];
    const modelToUse = model || "gemini-2.5-flash-preview-04-17";
    const responseStream = await ai.models.generateContentStream({
      model: modelToUse,
      contents,
      config: { ...modelConfig, thinkingConfig: { thinkingBudget: thinkingBudget }, tools: [{ codeExecution: {} }] },
    });
    let fullText = "";
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text || "";
            if (text) {
              fullText += text;
              controller.enqueue(encoder.encode(text));
            }
          }
          await prisma.chatMessage.create({ data: { sessionId: currentSessionId, type: "bot", content: fullText } });
          await prisma.chatSession.update({ where: { id: currentSessionId }, data: { updatedAt: new Date() } });
          if (isNewSession) {
            try {
              const namingPrompt = `Generate a concise, 3-5 word name for a chat session based on the following first user message and bot response:\n\nUser: ${prompt}\nBot: ${fullText}\n\nName:`;
              const namingResult = await ai.models.generateContent({ model: "gemini-2.0-flash", contents: namingPrompt });
              const generatedName = namingResult.text?.trim().replace(/["']/g, "") ?? "";
              await prisma.chatSession.update({ where: { id: currentSessionId }, data: { name: generatedName, updatedAt: new Date() } });
            } catch (namingError) {
              console.error("Error generating session name:", namingError);
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });
    const headers: Record<string, string> = {
      "Content-Type": "text/plain",
      "X-Token-Count": JSON.stringify({ total: contents.reduce((acc, curr) => acc + curr.parts.reduce((sum: number, part: { text?: string }) => sum + (part.text?.length || 0), 0), 0) }),
    };
    if (isNewSession && currentSessionId) {
      headers["X-Chat-Session-Id"] = currentSessionId;
    }
    return new NextResponse(customReadable, { headers });
  } catch (error) {
    console.error("Error generating response stream:", error);
    return NextResponse.json({ error: "Failed to generate response stream" }, { status: 500 });
  }
}
