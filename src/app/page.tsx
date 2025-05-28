import { getDatabase } from "@/lib/mongodb";
import type { CachedAnalysis } from "@/lib/types";
import { HomeClient } from "@/components/home-client";
import { WithId } from "mongodb";

export const dynamic = 'force-dynamic';
export default async function HomePage() {
  const db = await getDatabase();
  const collection = db.collection<CachedAnalysis>("analyses");
  const docs = await collection
    .find({ showOnHomepage: true })
    .sort({ createdAt: -1 })
    .toArray();

  const randomPicked: WithId<CachedAnalysis>[] = [];
  let companyPick = 0,
    productPick = 0;
  while (companyPick < 3 || productPick < 3) {
    const randomIndex = Math.floor(Math.random() * docs.length);
    const doc = docs[randomIndex];
    if (
      (productPick < 3 && doc.isProductSpecific) ||
      (companyPick < 3 && !doc.isProductSpecific)
    ) {
      randomPicked.push(doc);
      if (doc.isProductSpecific) {
        productPick++;
      } else {
        companyPick++;
      }
    }
    docs.splice(randomIndex, 1);
  }
  const initialResults = randomPicked.map((doc) => ({
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
