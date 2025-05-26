"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Shield,
  AlertCircle,
  ExternalLink,
  Calendar,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/types";

interface AnalysisModalProps {
  analysis: AnalysisResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AnalysisModal({
  analysis,
  isOpen,
  onClose,
}: AnalysisModalProps) {
  if (!analysis) return null;

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "S":
        return "bg-green-500";
      case "A":
        return "bg-green-400";
      case "B":
        return "bg-yellow-500";
      case "C":
        return "bg-orange-500";
      case "E":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getGradeDescription = (grade: string) => {
    switch (grade) {
      case "S":
        return "Excellent - Very fair and clear terms that respect user rights";
      case "A":
        return "Good - Pretty good for users, with only minor concerns";
      case "B":
        return "Fair - Be careful, some terms could be unfair or risky";
      case "C":
        return "Poor - Not good for users, has major problems or unfair terms";
      case "E":
        return "Very Poor - Significant red flags and user-unfriendly terms";
      default:
        return "Unknown grade";
    }
  };

  const getSeverityIcon = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "low":
        return <Shield className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityBg = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "bg-red-900/20 border-red-900/30";
      case "medium":
        return "bg-yellow-900/20 border-yellow-900/30";
      case "low":
        return "bg-blue-900/20 border-blue-900/30";
    }
  };

  const getSeverityLabel = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "High Risk";
      case "medium":
        return "Medium Risk";
      case "low":
        return "Low Risk";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">
                  {analysis.company.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {analysis.product || analysis.company}
                </h2>
                {analysis.product && (
                  <p className="text-sm text-gray-400">by {analysis.company}</p>
                )}
              </div>
            </div>
            <Badge
              className={`${getGradeColor(analysis.grade)} text-white font-bold px-4 py-2 text-lg`}
            >
              Grade {analysis.grade}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Grade Description */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Overall Assessment</h3>
            <p className="text-gray-300">
              {getGradeDescription(analysis.grade)}
            </p>
          </div>

          {/* Analysis Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>
                Analyzed: {new Date(analysis.analyzedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span>•</span>
              <span>
                {analysis.isProductSpecific
                  ? "Product-specific"
                  : "Company-wide"}{" "}
                analysis
              </span>
            </div>
          </div>

          {/* Red Flags */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Privacy & Terms Concerns ({analysis.redFlags.length})
            </h3>

            {analysis.redFlags.length === 0 ? (
              <div className="bg-green-900/20 border border-green-900/30 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-400">
                      No major red flags identified
                    </p>
                    <p className="text-sm text-gray-300">
                      This service appears to have user-friendly terms and
                      privacy policies.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {analysis.redFlags.map((flag, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getSeverityBg(flag.severity)}`}
                  >
                    <div className="flex items-start space-x-3">
                      {getSeverityIcon(flag.severity)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              flag.severity === "high"
                                ? "border-red-500 text-red-400"
                                : flag.severity === "medium"
                                  ? "border-yellow-500 text-yellow-400"
                                  : "border-blue-500 text-blue-400"
                            }`}
                          >
                            {getSeverityLabel(flag.severity)}
                          </Badge>
                        </div>
                        <p className="text-gray-200 leading-relaxed">
                          {flag.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
            {/* Link to Terms of Service and Privacy Policy documents if available */}
            {analysis.tosUrl && (
              <Button
                asChild
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <a href={analysis.tosUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 py-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Terms of Service</span>
                </a>
              </Button>
            )}
            {analysis.privacyPolicyUrl && (
              <Button
                asChild
                size="sm"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <a href={analysis.privacyPolicyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center space-x-2 py-2">
                  <ExternalLink className="h-4 w-4" />
                  <span>View Privacy Policy</span>
                </a>
              </Button>
            )}
            <Button
              size="sm"
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              <span>Share Analysis</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
