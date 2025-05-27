import { COMPANY_PROMPT, PRODUCT_PROMPT } from "./prompts";
import {
  CompanyAnalysisOutputSchema,
  ProductAnalysisOutputSchema,
  type AnalysisResult,
} from "./types";
import { extractValidJson } from "./utils";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

export async function analyzeWithPerplexity(
  company: string,
  product?: string,
  url?: string,
): Promise<AnalysisResult> {
  if (!process.env.PERPLEXITY_API_KEY) {
    throw new Error("Perplexity API key not configured");
  }

  const isProductSpecific = !!product;
  const prompt = isProductSpecific
    ? PRODUCT_PROMPT(product!, company, url ?? "Not provided")
    : COMPANY_PROMPT(company, url ?? "Not provided");

  const responseJsonSchema = isProductSpecific
    ? ProductAnalysisOutputSchema
    : CompanyAnalysisOutputSchema;

  console.log(
    `[Perplexity API] Sending request for ${isProductSpecific ? `product: ${product} from ` : ""}company: ${company}`,
  );

  console.log(`[Perplexity API] Prompt: ${prompt}`);

  const requestBody = {
    model: "sonar-deep-research",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.4,
    max_tokens: 16384,
  };

  console.log(`[Perplexity API] Request details:`, {
    url: PERPLEXITY_API_URL,
    model: requestBody.model,
    promptLength: prompt.length,
    temperature: requestBody.temperature,
    response_format: {
      type: "json_schema",
      json_schema: {
        schema: responseJsonSchema,
      },
    },
  });

  try {
    const response = await fetch(PERPLEXITY_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[Perplexity API] Error: ${response.status} ${response.statusText}`,
        errorText,
      );
      throw new Error(
        `Perplexity API error: ${response.statusText} (${response.status})`,
      );
    }

    const data = await response.json();
    console.log(data);
    console.log(
      `[Perplexity API] Response received with ${data.choices?.[0]?.message?.content?.length || 0} characters`,
    );
    console.log(`[Perplexity API] Response details:`, {
      finishReason: data.choices?.[0]?.finish_reason || "unknown",
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
      model: data.model || requestBody.model,
    });

    const content = data.choices[0]?.message?.content || "";

    console.log(`[Perplexity API] Response content: ${content}`);
    return parsePerplexityResponse(content, company, product, url);
  } catch (error) {
    console.error(`[Perplexity API] Request faxiled:`, error);
    throw error;
  }
}

// Internal raw response type from Perplexity API before mapping to AnalysisResult
interface RawPerplexityFlag {
  concern_level: number;
  description: string;
}
interface RawPerplexityResponse {
  icon_url?: string | null;
  tos_url?: string | null;
  privacy_policy_url?: string | null;
  policies_found?: boolean;
  red_flags?: RawPerplexityFlag[];
  consumer_friendliness_grade?: string | null;
  [key: string]: unknown;
}
function parsePerplexityResponse(
  content: string,
  company: string,
  product?: string,
  url?: string,
): AnalysisResult {
  let parsed: RawPerplexityResponse;
  try {
    let jsonString = extractValidJson(content);
    jsonString = jsonString.replace(/\[\d*?\]/g, "");
    parsed = JSON.parse(jsonString) as RawPerplexityResponse;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to parse Perplexity response JSON: ${msg}`);
  }
  const isProduct = !!product;
  const inputUrl = url?.trim() || undefined;
  const iconUrl: string | null = parsed.icon_url ?? null;
  const tosUrl: string | null = parsed.tos_url ?? null;
  const privacyPolicyUrl: string | null = parsed.privacy_policy_url ?? null;
  const policiesFound: boolean = Boolean(parsed.policies_found);
  if (!policiesFound) {
    return {
      company,
      product,
      url: inputUrl,
      tosUrl: null,
      privacyPolicyUrl: null,
      iconUrl,
      redFlags: [
        {
          text: "Terms of Service and Privacy Policy documents could not be found for this service.",
          severity: "medium",
        },
      ],
      grade: "E",
      isProductSpecific: isProduct,
      analyzedAt: new Date(),
    };
  }
  const rawFlags: RawPerplexityFlag[] = parsed.red_flags ?? [];
  const redFlags = rawFlags
    .sort((a, b) => a.concern_level - b.concern_level)
    .map((item) => {
      let severity: "high" | "medium" | "low";
      const lvl = item.concern_level;
      if (lvl === 1) severity = "high";
      else if (lvl <= 3) severity = "medium";
      else severity = "low";
      return { text: item.description, severity };
    });
  let gradeValue = parsed.consumer_friendliness_grade;
  if (!gradeValue) gradeValue = "U";
  const grade = ["S", "A", "B", "C"].includes(gradeValue)
    ? (gradeValue as "S" | "A" | "B" | "C")
    : "E";
  return {
    company,
    product,
    url: inputUrl,
    tosUrl,
    privacyPolicyUrl,
    iconUrl,
    redFlags,
    grade,
    isProductSpecific: isProduct,
    analyzedAt: new Date(),
  };
}
