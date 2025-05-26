import { getDatabase } from "./mongodb";
import type { AnalysisResult, CachedAnalysis } from "./types";

/**
 * Generate a cache key incorporating company, optional product, and optional URL.
 */
export function generateCacheKey(
  company: string,
  product?: string,
  url?: string,
): string {
  let parts = [company.trim().toLowerCase()];
  if (product) parts.push(product.trim().toLowerCase());
  if (url) parts.push(url.trim().toLowerCase());
  const key = parts.join("-");
  return key.replace(/[^a-z0-9-]/g, "-");
}

export async function getCachedAnalysis(
  company: string,
  product?: string,
  url?: string,
): Promise<CachedAnalysis | null> {
  try {
    const db = await getDatabase();
    const collection = db.collection<CachedAnalysis>("analyses");

    const cacheKey = generateCacheKey(company, product, url);

    // Check if we have a recent analysis (within 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const cached = await collection.findOne({
      cacheKey,
      createdAt: { $gte: sevenDaysAgo },
    });

    return cached;
  } catch (error) {
    console.error("Error getting cached analysis:", error);
    return null;
  }
}

export async function setCachedAnalysis(
  analysis: AnalysisResult,
): Promise<void> {
  try {
    const db = await getDatabase();
    const collection = db.collection<CachedAnalysis>("analyses");

    const cacheKey = generateCacheKey(
      analysis.company,
      analysis.product,
      analysis.url,
    );
    const now = new Date();

    const cachedAnalysis: CachedAnalysis = {
      ...analysis,
      cacheKey,
      createdAt: now,
      updatedAt: now,
    };

    await collection.replaceOne({ cacheKey }, cachedAnalysis, { upsert: true });
  } catch (error) {
    console.error("Error caching analysis:", error);
  }
}
