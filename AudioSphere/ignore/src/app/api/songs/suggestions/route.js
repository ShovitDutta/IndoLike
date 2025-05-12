export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
const api_url = process.env.NEXT_PUBLIC_API_URL;
if (!api_url) throw new Error("Missing NEXT_PUBLIC_API_URL environment variable");
export async function GET(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing song ID query parameter" }, { status: 400 });
    const response = await fetch(`${api_url}songs/${id}/suggestions`);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`External API error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: "Failed to fetch data from external API" }, { status: response.status });
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
