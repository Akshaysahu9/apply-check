import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { analyzeResumeText } from "@/lib/resume-analyzer";
import { extractPdfText } from "@/lib/pdf-extract";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("resume") as File | null;
    const textInput = formData.get("text") as string | null;

    let text = textInput?.trim() || "";

    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: "File too large. Max 5 MB." }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const isPdf =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

      if (isPdf) {
        try {
          text = await extractPdfText(buffer);
        } catch (pdfError) {
          const msg = pdfError instanceof Error ? pdfError.message : "PDF read failed";
          console.error("PDF error:", pdfError);
          return NextResponse.json(
            { error: msg },
            { status: 400 }
          );
        }
      } else if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        text = buffer.toString("utf-8");
      } else {
        return NextResponse.json(
          { error: "Upload PDF or TXT only." },
          { status: 400 }
        );
      }
    }

    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 50) {
      return NextResponse.json(
        {
          error:
            "Not enough text found. Use a text-based PDF (not scanned image) or paste resume text.",
        },
        { status: 400 }
      );
    }

    const analysis = analyzeResumeText(trimmed);

    return NextResponse.json({
      success: true,
      analysis,
      extractedText: trimmed,
      fileName: file?.name || "Pasted resume",
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Resume analysis error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Try Paste text if PDF keeps failing." },
      { status: 500 }
    );
  }
}
