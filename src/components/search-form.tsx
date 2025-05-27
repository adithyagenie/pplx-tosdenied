"use client";

import React, { useState } from "react";
import type { SearchFormData } from "@/lib/types";

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
  isLoading: boolean;
  searchType: "company" | "product";
  onTypeChange: (type: "company" | "product") => void;
}

export function SearchForm({ onSearch, isLoading, searchType, onTypeChange }: SearchFormProps) {
  const [company, setCompany] = useState("");
  const [product, setProduct] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!company.trim()) return;

    if (searchType === "product" && !product.trim()) return;

    onSearch({
      query: searchType === "product" ? `${product} by ${company}` : company,
      type: searchType,
      company: company.trim(),
      product: searchType === "product" ? product.trim() : undefined,
      url: url.trim() || undefined,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto shadow-xl rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-2 bg-zinc-800 rounded">
        {(["company", "product"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`flex-1 py-2 text-center font-medium rounded ${
                searchType === type
                  ? "bg-zinc-600 text-white"
                  : "text-gray-400 hover:bg-zinc-600"
              }`}
            >
              {type === "company" ? "Company Analysis" : "Product Analysis"}
            </button>
          ))}
        </div>
        {searchType === "company" ? (
          <div className="space-y-2">
            <label htmlFor="company-name" className="block text-gray-400">
              Company Name
            </label>
            <input
              id="company-name"
              type="text"
              placeholder="e.g., Facebook, Google, Amazon"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <label htmlFor="product-company" className="block text-gray-400">
                Company Name
              </label>
              <input
                id="product-company"
                type="text"
                placeholder="e.g., Meta, Google, Amazon"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="product-name" className="block text-gray-400">
                Product Name
              </label>
              <input
                id="product-name"
                type="text"
                placeholder="e.g., Instagram, Gmail, Prime Video"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                required
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}
        <div className="space-y-2">
          <label htmlFor="url" className="block text-gray-400">
            Policy or Main Page URL (optional)
          </label>
          <input
            id="url"
            type="url"
            placeholder="https://example.com/terms"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={
            isLoading ||
            !company.trim() ||
            (searchType === "product" && !product.trim())
          }
          className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Analyzing..." : "Analyze Terms & Privacy"}
        </button>
      </form>
    </div>
  );
}
