import { auth } from "../../../../auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../../prisma/prisma";
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { geminiApiKey } = await request.json();
    if (!geminiApiKey) return NextResponse.json({ error: "API key is required" }, { status: 400 });
    await prisma.user.update({ where: { id: session.user.id }, data: { geminiApiKey: geminiApiKey } });
    return NextResponse.json({ message: "API key saved successfully" });
  } catch (error) {
    console.error("Error saving API key:", error);
    return NextResponse.json({ error: "Failed to save API key" }, { status: 500 });
  }
}
