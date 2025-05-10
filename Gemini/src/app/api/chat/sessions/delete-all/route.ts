import { NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma";
export async function DELETE() {
  try {
    await prisma.chatSession.deleteMany({});
    return NextResponse.json({ message: "All chat sessions deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete all chat sessions" }, { status: 500 });
  }
}
