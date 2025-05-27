import { getDatabase } from "@/lib/mongodb";
import type { CachedAnalysis } from "@/lib/types";
import { HomeClient } from "@/components/home-client";

export default async function HomePage() {
  const db = await getDatabase();
  const collection = db.collection<CachedAnalysis>("analyses");
  const docs = await collection
    .find({ showOnHomepage: true })
    .sort({ createdAt: -1 })
    .toArray();
  const initialResults = docs.map((doc) => ({
    company: doc.company,
    product: doc.product,
    url: doc.url,
    tosUrl: doc.tosUrl,
    privacyPolicyUrl: doc.privacyPolicyUrl,
    iconUrl: doc.iconUrl,
    redFlags: doc.redFlags,
    grade: doc.grade,
    isProductSpecific: doc.isProductSpecific,
    analyzedAt: doc.analyzedAt,
  }));
  return <HomeClient initialResults={initialResults} />;
}
