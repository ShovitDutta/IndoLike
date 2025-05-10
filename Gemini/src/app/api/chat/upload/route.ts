import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const blob = new Blob([await file.arrayBuffer()], { type: file.type || "text/plain" });
    const uploadedFile = await ai.files.upload({
      file: blob,
    });
    return NextResponse.json({
      uri: uploadedFile.uri,
      mimeType: uploadedFile.mimeType,
    });
  } catch {
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
