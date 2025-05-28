import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const openrouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        stream: true,
        max_tokens: 8192,
        reasoning: { max_tokens: 8192 },
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "user", content: `Generate A Quote About ${topic}.` },
          { role: "system", content: `You Are An AI Quote Generator. Generate An Inspiring Quote About ${topic}. Provide Only The Quote Text. Use Emojis.` },
        ],
      }),
    });

    if (!openrouterResponse.ok || !openrouterResponse.body) {
      const error = await openrouterResponse.json();
      return NextResponse.json({ error: "Failed to fetch quote from OpenRouter API" }, { status: openrouterResponse.status });
    }

    const reader = openrouterResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const outputStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.substring(6);
                if (data === "[DONE]") {
                  controller.close();
                  return;
                }
                try {
                  const chunk = JSON.parse(data);
                  const delta = chunk.choices?.[0]?.delta;
                  if (delta) {
                    if (delta.content) {
                      controller.enqueue(`event: content\ndata: ${JSON.stringify({ value: delta.content })}\n\n`);
                    }
                    if (delta.reasoning) {
                      controller.enqueue(`event: reasoning\ndata: ${JSON.stringify({ value: delta.reasoning })}\n\n`);
                    }
                  }
                } catch (e) {
                  console.error("Error parsing stream chunk:", e);
                }
              } else if (line.startsWith(": ")) {
                // Ignore comments
              }
            }
          }
          if (!controller.desiredSize) {
            controller.close();
          }
        } catch (error) {
          console.error("Error processing stream:", error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      },
    });

    return new NextResponse(outputStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error generating custom quote:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
