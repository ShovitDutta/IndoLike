import { NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  try {
    if (sessionId) {
      const session = await prisma.chatSession.findUnique({ where: { id: sessionId }, include: { messages: true } });
      if (!session) {
        return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
      }
      return NextResponse.json(session.messages);
    } else {
      const sessions = await prisma.chatSession.findMany({ orderBy: { createdAt: "desc" }, include: { messages: true } });
      return NextResponse.json(sessions);
    }
  } catch (error) {
    console.error("Error fetching chat session(s):", error);
    return NextResponse.json({ error: "Failed to fetch chat session(s)" }, { status: 500 });
  }
}
