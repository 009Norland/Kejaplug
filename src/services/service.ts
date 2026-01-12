// AI-powered recommendation service using Anthropic API

interface RecommendationResult {
  recommendations: { propertyId: string; reasoning: string }[];
}

export async function getSmartRecommendations(
  query: string,
  availableProperties: string
): Promise<RecommendationResult> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [
          {
            role: "user",
            content: `Based on the following user request: "${query}", and these available property details: ${availableProperties}. 
Suggest the top 2-3 properties that best match the user's needs.
Provide a "reasoning" for each recommendation highlighting why it fits.

Respond ONLY with valid JSON in this exact format (no markdown, no backticks):
{
  "recommendations": [
    {
      "propertyId": "1",
      "reasoning": "Brief explanation why this property matches the user's needs"
    }
  ]
}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("API Error:", response.status);
      return { recommendations: [] };
    }

    const data = await response.json();
    
    // Extract text from response content
    const text = data.content
      ?.map((item: any) => (item.type === "text" ? item.text : ""))
      .join("")
      .trim();

    if (!text) {
      return { recommendations: [] };
    }

    // Clean any markdown formatting and parse JSON
    const cleaned = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    
    return parsed;
  } catch (error) {
    console.error("AI recommendation error:", error);
    return { recommendations: [] };
  }
}

export async function generateListingDescription(details: any): Promise<string> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Write a compelling and professional rental listing description for a ${details.type} in ${details.estate}, ${details.city}. Price is KES ${details.price}. Amenities include: ${details.amenities.join(', ')}. Highlight safety and convenience. Keep it under 100 words.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return "Beautiful property available for rent. Contact us for more details.";
    }

    const data = await response.json();
    
    const text = data.content
      ?.map((item: any) => (item.type === "text" ? item.text : ""))
      .join("")
      .trim();

    return text || "Beautiful property available for rent.";
  } catch (error) {
    console.error("Description generation error:", error);
    return "Beautiful property available for rent. Contact us for more details.";
  }
}