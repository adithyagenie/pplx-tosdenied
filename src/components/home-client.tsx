"use client";

import { useState, useEffect } from "react";
import type { SearchFormData, AnalysisResult } from "@/lib/types";
import { SearchForm } from "@/components/search-form";
import { ResultsGrid } from "@/components/results-grid";
import { toast } from "sonner";
import { AnalysisModal } from "@/components/analysis-modal";
import { RotatingText } from "@/components/rotating-text";

export function HomeClient({
  initialResults,
}: {
  initialResults: AnalysisResult[];
}) {
  const [companyGenerations, setCompanyGenerations] = useState<
    AnalysisResult[]
  >([]);
  const [productGenerations, setProductGenerations] = useState<
    AnalysisResult[]
  >([]);
  const [searchType, setSearchType] = useState<"company" | "product">(
    "company",
  );
  const seededCompany = initialResults.filter((r) => !r.isProductSpecific);
  const seededProduct = initialResults.filter((r) => r.isProductSpecific);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] =
    useState<AnalysisResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    try {
      const rawC = localStorage.getItem("companyGenerations");
      if (rawC) {
        const arr = JSON.parse(rawC) as (Omit<AnalysisResult, "analyzedAt"> & {
          analyzedAt: string;
        })[];
        setCompanyGenerations(
          arr.map((r) => ({ ...r, analyzedAt: new Date(r.analyzedAt) })),
        );
      }
      const rawP = localStorage.getItem("productGenerations");
      if (rawP) {
        const arr = JSON.parse(rawP) as (Omit<AnalysisResult, "analyzedAt"> & {
          analyzedAt: string;
        })[];
        setProductGenerations(
          arr.map((r) => ({ ...r, analyzedAt: new Date(r.analyzedAt) })),
        );
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleSearch = async (searchData: SearchFormData): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: searchData.company,
          product: searchData.product,
          type: searchData.type,
          url: searchData.url,
        }),
      });
      if (!response.ok) throw new Error("Failed to analyze");
      type Received = Omit<AnalysisResult, "analyzedAt"> & {
        analyzedAt: string;
      };
      const data = (await response.json()) as Received;
      const analysis: AnalysisResult = {
        ...data,
        analyzedAt: new Date(data.analyzedAt),
      };
      if (analysis.isProductSpecific) {
        setProductGenerations((prev) => {
          const filtered = prev.filter(
            (r) =>
              !(
                r.company === analysis.company && r.product === analysis.product
              ),
          );
          const next = [analysis, ...filtered];
          localStorage.setItem(
            "productGenerations",
            JSON.stringify(
              next.map((r) => ({
                ...r,
                analyzedAt: r.analyzedAt.toISOString(),
              })),
            ),
          );
          return next;
        });
      } else {
        setCompanyGenerations((prev) => {
          const filtered = prev.filter((r) => r.company !== analysis.company);
          const next = [analysis, ...filtered];
          localStorage.setItem(
            "companyGenerations",
            JSON.stringify(
              next.map((r) => ({
                ...r,
                analyzedAt: r.analyzedAt.toISOString(),
              })),
            ),
          );
          return next;
        });
      }
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

  const handleViewDetails = (analysis: AnalysisResult): void => {
    setSelectedAnalysis(analysis);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <main className="container mx-auto px-4 py-12">
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
            <span className="text-gray-400">Declined</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
            &quot;I have read and agree to the Terms and Conditions.&quot;
            <br />
            Perplexity can fix that.
          </p>
        </div>
        {/* Toggle control for Company/Product */}
        <div className="flex justify-center mb-8">
          {(["company", "product"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSearchType(type)}
              className={`mx-2 px-8 py-4 text-lg font-semibold rounded-lg transition-transform transform ${
                searchType === type
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {type === "company" ? "Company Analysis" : "Product Analysis"}
            </button>
          ))}
        </div>
        {/* Featured section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Featured Analysis
          </h2>
          <div className="flex flex-col items-center text-center text-gray-400 mb-6 max-w-xl mx-auto space-y-4">
            <span>See our curated analysis examples below or</span>
            <a
              href="#search-form"
              className="px-5 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition hover:scale-105"
            >
              Try Your Own&nbsp;&rarr;
            </a>
          </div>
          <ResultsGrid
            results={
              (searchType === "company" ? seededCompany : seededProduct).slice(0, 3)
            }
            onViewDetails={handleViewDetails}
          />
        </div>
        {/* search section header and form */}
        <div id="search-form" className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Analyze Your Own
            </h2>
            <p className="text-gray-400 text-lg">
              Enter a company or product to generate a quick analysis.
            </p>
          </div>
          <SearchForm
            onSearch={handleSearch}
            isLoading={isLoading}
            searchType={searchType}
            onTypeChange={setSearchType}
            hideToggle
          />
        </div>
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">
              <RotatingText
                texts={[
                  "Searching for terms...",
                  "Searching for privacy policies...",
                  "Analyzing terms of service...",
                  "Analyzing privacy policies...",
                  "Reviewing terms of service...",
                  "Reviewing privacy policies...",
                  "Consolidating results....",
                  "Grading policies...",
                  "Identifying red flags...",
                  "Running deep research...",
                  "Finding additional sources...",
                  "Compiling analysis...",
                  "Preparing results...",
                  "Finalizing analysis...",
                  "Almost done...",
                  "Just a moment...",
                  "Hang tight...",
                  "We're on it...",
                  "Your results are coming...",
                  "Processing your request...",
                ]}
              />
            </p>
          </div>
        )}
        <div className="mb-12">
          {searchType === "company" && companyGenerations.length > 0 && (
            <div className="mb-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Your Analyses
              </h2>
              <ResultsGrid
                results={companyGenerations}
                onViewDetails={handleViewDetails}
              />
            </div>
          )}
          {searchType === "product" && productGenerations.length > 0 && (
            <div className="mb-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Your Analyses
              </h2>
              <ResultsGrid
                results={productGenerations}
                onViewDetails={handleViewDetails}
              />
            </div>
          )}
        </div>
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
