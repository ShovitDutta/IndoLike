import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../prisma/prisma";
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }
  try {
    await prisma.chatSession.delete({ where: { id } });
    return NextResponse.json({ message: `Chat session ${id} deleted` });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete chat session" }, { status: 500 });
  }
}
