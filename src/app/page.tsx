"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { SearchForm } from "@/components/search-form";
import { ResultsGrid } from "@/components/results-grid";
import type { AnalysisResult, SearchFormData } from "@/lib/types";
import { toast } from "sonner";
import { AnalysisModal } from "@/components/analysis-modal";
import { useSonner } from "sonner";

export default function HomePage() {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<AnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = async (searchData: SearchFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: searchData.company,
          product: searchData.product,
          type: searchData.type,
          url: searchData.url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze");
      }

      const analysis: AnalysisResult = await response.json();

      // Add to results, replacing any existing analysis for the same company/product
      setResults((prev) => {
        const filtered = prev.filter(
          (r) =>
            !(
              r.company === analysis.company &&
              r.product === analysis.product &&
              r.isProductSpecific === analysis.isProductSpecific
            ),
        );
        return [analysis, ...filtered];
      });

      toast.success(
        `Successfully analyzed ${analysis.product || analysis.company}`,
      );
    } catch (error) {
      console.error("Search error:", error);
      toast.error(
        "Failed to analyze the terms and privacy policy. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (analysis: AnalysisResult) => {
    setSelectedAnalysis(analysis);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="flex flex-col space-y-2">
              <div className="flex space-x-2">
                <div className="w-12 h-3 bg-green-500 rounded"></div>
                <div className="w-12 h-3 bg-yellow-500 rounded"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-12 h-3 bg-red-500 rounded"></div>
                <div className="w-12 h-3 bg-gray-500 rounded"></div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Terms of Service
            <br />
            <span className="text-gray-400">Didn't Read</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            "I have read and agree to the Terms" is the biggest lie on the web.
            <br />
            Perplexity can fix that.
          </p>

          {/* <div className="text-sm text-gray-500 mb-8">
            <p>AS FEATURED ON</p>
            <div className="flex justify-center items-center space-x-6 mt-2 text-gray-600">
              <span>Waka TIME</span>
              <span>The Verge</span>
              <span>Le Monde</span>
              <span>Zeit Online</span>
              <span>WIRED</span>
              <span>strategy+business</span>
            </div>
          </div> */}
        </div>

        {/* Search Form */}
        <div className="mb-12">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">
              Analyzing terms and privacy policies...
            </p>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Analysis Results
            </h2>
            <ResultsGrid results={results} onViewDetails={handleViewDetails} />
          </div>
        )}

        {/* Analysis Modal */}
        <AnalysisModal
          analysis={selectedAnalysis}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAnalysis(null);
          }}
        />
      </main>
    </div>
  );
}
