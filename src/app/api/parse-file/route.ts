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
 * Extract text from a PDF buffer using pdf-parse v2 (PDFParse class).
 * Falls back gracefully if the main method fails.
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to ensure it's resolved at runtime (not webpack-bundled)
    const pdfParseModule = await import("pdf-parse");
    const PDFParse = pdfParseModule.PDFParse || (pdfParseModule as any).default?.PDFParse;
    if (!PDFParse) {
      throw new Error("PDFParse constructor not found on the imported module.");
    }

    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text || "";
  } catch (primaryError: any) {
    console.error("[PDF] Primary pdf-parse extraction failed:", primaryError.message);
    
    // Fallback: try direct pdfjs-dist usage
    try {
      const text = await extractPdfWithPdfjs(buffer);
      if (text && text.trim().length > 10) {
        return text;
      }
    } catch (fallbackError: any) {
      console.error("[PDF] Fallback pdfjs extraction also failed:", fallbackError.message);
    }
    
    throw new Error(
      "Could not parse this PDF. It may be image-based (scanned), password-protected, or use an unsupported format. " +
      "Try saving it as a new PDF from your editor, or paste the resume text directly."
    );
  }
}

/**
 * Fallback PDF text extraction using pdfjs-dist directly.
 */
async function extractPdfWithPdfjs(buffer: Buffer): Promise<string> {
  const pdfjsModule = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdfjsLib = (pdfjsModule as any).getDocument ? pdfjsModule : (pdfjsModule as any).default;
  
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdf = await loadingTask.promise;
  
  const textParts: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str || "")
      .join(" ");
    textParts.push(pageText);
  }
  
  return textParts.join("\n\n");
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
