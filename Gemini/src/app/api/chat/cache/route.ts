import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
export async function GET() {
  try {
    const pager = await ai.caches.list({ config: { pageSize: 10 } });
    const caches = [];
    let page = pager.page;
    while (true) {
      for (const cache of page) {
        caches.push({
          name: cache.name,
          model: cache.model,
          expireTime: cache.expireTime,
        });
      }
      if (!pager.hasNextPage()) break;
      page = await pager.nextPage();
    }
    return NextResponse.json(caches);
  } catch {
    return NextResponse.json({ error: "Failed to list caches" }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const { model, contents, systemInstruction, ttl } = await request.json();
    const cache = await ai.caches.create({
      model: model || "gemini-2.5-flash-preview-04-17",
      config: {
        contents,
        systemInstruction,
        ttl: ttl || "3600s",
      },
    });
    return NextResponse.json({
      name: cache.name,
      model: cache.model,
      expireTime: cache.expireTime,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create cache" }, { status: 500 });
  }
}
export async function DELETE(request: Request) {
  try {
    const { name } = await request.json();
    await ai.caches.delete({ name });
    return NextResponse.json({ message: "Cache deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete cache" }, { status: 500 });
  }
}
