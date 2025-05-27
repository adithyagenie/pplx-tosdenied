"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, AlertCircle, CheckCircle } from "lucide-react";
import type { AnalysisResult } from "@/lib/types";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface ServiceCardProps {
  analysis: AnalysisResult;
  onViewDetails?: () => void;
}

export function ServiceCard({ analysis, onViewDetails }: ServiceCardProps) {
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

  // const getGradeText = (grade: string) => {
  //   switch (grade) {
  //     case "S":
  //       return "Excellent";
  //     case "A":
  //       return "Good";
  //     case "B":
  //       return "Fair";
  //     case "C":
  //       return "Poor";
  //     case "E":
  //       return "Very Poor";
  //     default:
  //       return "Unknown";
  //   }
  // };

  const getSeverityIcon = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBg = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "bg-red-500/20 border-red-900/90";
      case "medium":
        return "bg-yellow-500/20 border-yellow-900/90";
      case "low":
        return "bg-blue-500/20 border-blue-900/90";
    }
  };

  const [imageError, setImageError] = useState(false);
  const [validImage, setValidImage] = useState<boolean>(
    Boolean(analysis.iconUrl),
  );
  // On URL change, reset validity and error; reject only if HEAD indicates an HTML page
  useEffect(() => {
    const url = analysis.iconUrl;
    if (!url) {
      setValidImage(false);
      return;
    }
    setValidImage(true);
    setImageError(false);
    fetch(url, { method: "HEAD" })
      .then((res) => {
        const ct = res.headers.get("content-type")?.toLowerCase() || "";
        if (ct.startsWith("text/html")) {
          setValidImage(false);
        }
      })
      .catch(() => {
        // ignore errors, keep optimistic validity
      });
  }, [analysis.iconUrl]);
  return (
    <Card className="w-full bg-gray-900 border-gray-800 text-white flex flex-col h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-gray-800">
              {analysis.iconUrl && validImage && !imageError ? (
                <img
                  src={analysis.iconUrl}
                  alt={`${analysis.product || analysis.company} logo`}
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-sm font-bold text-white">
                  {(analysis.company || "").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {analysis.product || analysis.company}
              </h3>
              {analysis.product && (
                <p className="text-sm text-gray-400">by {analysis.company}</p>
              )}
            </div>
          </div>
          <Badge
            className={`${getGradeColor(analysis.grade)} text-white font-bold px-3 py-1`}
          >
            Grade {analysis.grade}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex flex-col flex-1">
        <div className="space-y-2">
          {analysis.redFlags.slice(0, 4).map((flag, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getSeverityBg(flag.severity)}`}
            >
              <div className="flex items-start space-x-2">
                {getSeverityIcon(flag.severity)}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  components={{
                    p: ({ ...props }) => (
                      <p
                        className="text-sm text-gray-200 leading-relaxed"
                        {...props}
                      />
                    ),
                  }}
                >
                  {flag.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {analysis.redFlags.length > 4 && (
            <p className="text-sm text-gray-400 text-center">
              +{analysis.redFlags.length - 4} more concerns
            </p>
          )}

          {analysis.redFlags.length === 0 && (
            <div className="p-3 rounded-lg bg-green-900/20 border border-green-900/30">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <p className="text-sm text-gray-200">
                  No major red flags identified
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-2 mt-auto">
          <Button
            variant="default"
            size="sm"
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={onViewDetails}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
