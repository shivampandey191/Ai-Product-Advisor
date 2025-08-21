// services/ai.js

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

type params = {
  query: string;
  catalog: Array<{
    product_name: string;
    description: string;
    price: number;
    brand: string;
    category: string;
  }>;
  apiKey?: string;
};

export async function aiSuggestProducts({ query, catalog, apiKey }: params) {
  const key = apiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  if (key) {
    const systemPrompt = `
    You are an AI Product Advisor. 
    Given a user's query and a product catalog, return strict JSON:
    {
      "query_understanding": "summary of what user asked",
      "recommendations": [
        { "product_name": "...", "why": "...", "score": 0.85 }
      ]
    }
    Use only products from the provided catalog.
    `;

    const body = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: "USER QUERY: " + query },
            { text: "CATALOG: " + JSON.stringify(catalog) },
          ],
        },
      ],
    };

    try {
      const res = await fetch(`${GEMINI_ENDPOINT}?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        return JSON.parse(text.slice(jsonStart, jsonEnd + 1));
      }
    } catch (err: any) {
      console.warn("Gemini API failed:", err.message);
      return {
        query_understanding: "Failed to process your query",
        recommendations: [],
        error:
          "Sorry, the AI service is currently unavailable. Please try again later.",
      };
    }
  }

  return {
    query_understanding: "API key not configured",
    recommendations: [],
    error:
      "Product advisor is not properly configured. Please check the API key setup.",
  };
}
