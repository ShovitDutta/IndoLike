export const dynamic = "force-dynamic";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    if (!query) return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
    const response = await fetch(`https://jiosaavn-api.shovitdutta1.workers.dev/api/search/songs?query=` + query);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`External API error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: "Failed to fetch data from external API" }, { status: response.status });
    }
    const data: unknown = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
