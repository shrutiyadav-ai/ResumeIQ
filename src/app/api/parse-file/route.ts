import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    if (fileName.endsWith(".pdf") || fileType === "application/pdf") {
      text = await extractPdfText(buffer);
    } else if (
      fileName.endsWith(".docx") || 
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      text = await extractDocxText(buffer);
    } else if (fileName.endsWith(".txt") || fileType === "text/plain") {
      text = buffer.toString("utf-8");
    } else if (fileName.endsWith(".doc")) {
      return NextResponse.json(
        { error: "Legacy .doc format is not supported. Please save your resume as .docx or .pdf and try again." },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: `Unsupported format "${file.name.split('.').pop()}". Please upload a PDF, DOCX, or TXT file.` },
        { status: 400 }
      );
    }

    // Clean up extracted text
    text = cleanExtractedText(text);

    if (!text.trim() || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Could not extract meaningful text from this file. The file may be image-based (scanned PDF), empty, or corrupted. Try copy-pasting your resume text directly." },
        { status: 400 }
      );
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Text extraction endpoint error:", error);
    return NextResponse.json(
      { error: `Failed to process the uploaded file: ${error.message || "Unknown error"}. Try a different file format or paste your resume text directly.` },
      { status: 500 }
    );
  }
}

/**
 * Extract text from a PDF buffer using unpdf (edge-compatible, zero native dependencies).
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const uint8Array = new Uint8Array(buffer);
    const pdf = await getDocumentProxy(uint8Array);
    const { text } = await extractText(pdf, { mergePages: true });
    return text || "";
  } catch (error: any) {
    console.error("[PDF] unpdf extraction failed:", error.message);
    throw new Error(
      "Could not parse this PDF. It may be image-based (scanned), password-protected, or use an unsupported format. " +
      "Try saving it as a new PDF from your editor, or paste the resume text directly."
    );
  }
}

/**
 * Extract text from a DOCX buffer using mammoth.
 */
async function extractDocxText(buffer: Buffer): Promise<string> {
  try {
    const mammothModule = await import("mammoth");
    const mammoth = (mammothModule as any).extractRawText ? mammothModule : (mammothModule as any).default;
    if (!mammoth || typeof mammoth.extractRawText !== "function") {
      throw new Error("extractRawText function not found on mammoth module.");
    }
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error: any) {
    console.error("[DOCX] mammoth extraction failed:", error.message);
    throw new Error(
      "Could not parse this DOCX file. It may be corrupted or use an unsupported format. " +
      "Try opening it in Word and saving it again, or paste the resume text directly."
    );
  }
}

/**
 * Clean up extracted text: normalize whitespace, remove control characters, etc.
 */
function cleanExtractedText(text: string): string {
  return text
    // Remove null bytes and control characters (except newlines/tabs)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize various line endings
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Collapse excessive blank lines (3+ newlines → 2)
    .replace(/\n{3,}/g, "\n\n")
    // Remove leading/trailing whitespace per line
    .split("\n")
    .map(line => line.trimEnd())
    .join("\n")
    .trim();
}
