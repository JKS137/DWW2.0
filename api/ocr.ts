import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI, Type } from "@google/genai";

type RequestLike = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};
type ResponseLike = {
  status(code: number): ResponseLike;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
};

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const authorization = req.headers.authorization;
  const token = typeof authorization === "string" && authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";
  if (!token) return res.status(401).json({ error: "Sign in is required." });

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!supabaseUrl || !supabaseAnonKey || !geminiApiKey) {
    return res.status(503).json({ error: "AI OCR is not configured on the server." });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: "Your session is invalid or expired. Please sign in again." });
  }

  let body: any = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); }
    catch { return res.status(400).json({ error: "Invalid request body." }); }
  }

  const base64Image = body?.base64Image;
  const mimeType = body?.mimeType;
  if (typeof base64Image !== "string" || !base64Image || base64Image.length > 8_000_000) {
    return res.status(400).json({ error: "Image is missing or exceeds the 6 MB limit." });
  }
  if (!["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"].includes(mimeType)) {
    return res.status(400).json({ error: "Unsupported image format." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType } },
          { text: "Extract warranty information from this receipt or warranty document. Return only JSON with productName (string), purchaseDate (YYYY-MM-DD string), and warrantyLengthInMonths (integer or null). Convert 1 year to 12 months and 90 days to 3 months. If a value is not present, use an empty string for productName or purchaseDate and null for warrantyLengthInMonths." },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productName: { type: Type.STRING },
            purchaseDate: { type: Type.STRING },
            warrantyLengthInMonths: { type: Type.INTEGER, nullable: true },
          },
          required: ["productName", "purchaseDate", "warrantyLengthInMonths"],
        },
      },
    });

    const data = JSON.parse(response.text ?? "{}");
    if (typeof data.productName !== "string" || typeof data.purchaseDate !== "string") {
      return res.status(502).json({ error: "The AI response could not be validated. Enter the details manually." });
    }
    return res.status(200).json({ data });
  } catch {
    return res.status(502).json({ error: "Receipt analysis failed. Please try a clearer image or enter details manually." });
  }
}
