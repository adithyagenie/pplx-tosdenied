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
      <div className="flex overflow-x-auto space-x-6 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-6 md:space-x-0">
        {results.map((result, index) => (
          <div
            key={`${result.company}-${result.product || "general"}-${index}`}
            className="flex-shrink-0 snap-center w-[80%] md:w-auto"
          >
            <ServiceCard
              analysis={result}
              onViewDetails={() => onViewDetails?.(result)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
