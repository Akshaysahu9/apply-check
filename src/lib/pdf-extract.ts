import { extractText, getDocumentProxy } from "unpdf";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const data = new Uint8Array(buffer);
  const pdf = await getDocumentProxy(data);
  const { text } = await extractText(pdf, { mergePages: true });
  const cleaned = text.replace(/\s+/g, " ").trim();

  if (!cleaned || cleaned.length < 20) {
    throw new Error("PDF has no readable text. Export as text-based PDF or use Paste text.");
  }

  return text;
}
