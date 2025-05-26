import { type NextRequest, NextResponse } from "next/server";
import { analyzeWithPerplexity } from "@/lib/perplexity";
import { getCachedAnalysis, setCachedAnalysis } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const { company, product, type, url } = await request.json();

    if (!company) {
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 },
      );
    }

    if (type === "product" && !product) {
      return NextResponse.json(
        { error: "Product name is required for product analysis" },
        { status: 400 },
      );
    }

    // Check cache first
    const cached = await getCachedAnalysis(
      company,
      type === "product" ? product : undefined,
      url,
    );
    if (cached) {
      return NextResponse.json(cached);
    }

    // Analyze with Perplexity
    const analysis = await analyzeWithPerplexity(
      company,
      type === "product" ? product : undefined,
      url,
    );

    // Cache the result
    await setCachedAnalysis(analysis);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze policies" },
      { status: 500 },
    );
  }
}
