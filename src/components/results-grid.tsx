"use client";

import type { AnalysisResult } from "@/lib/types";
import { ServiceCard } from "./service-card";

interface ResultsGridProps {
  results: AnalysisResult[];
  onViewDetails?: (analysis: AnalysisResult) => void;
}

export function ResultsGrid({ results, onViewDetails }: ResultsGridProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {results.map((result, index) => (
          <ServiceCard
            key={`${result.company}-${result.product || "general"}-${index}`}
            analysis={result}
            onViewDetails={() => onViewDetails?.(result)}
          />
        ))}
      </div>
    </div>
  );
}
