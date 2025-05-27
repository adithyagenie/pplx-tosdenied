import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractValidJson(response: string): string {
  const content: string = response ?? "";
  const marker = "</think>";
  const idx = content.lastIndexOf(marker);

  let jsonStrToParse: string;

  if (idx === -1) {
    jsonStrToParse = content.trim();
  } else {
    jsonStrToParse = content.substring(idx + marker.length).trim();
  }
  if (jsonStrToParse.startsWith("```json")) {
    jsonStrToParse = jsonStrToParse.substring("```json".length).trim();
  } else if (jsonStrToParse.startsWith("```")) {
    jsonStrToParse = jsonStrToParse.substring(3).trim();
  }

  if (jsonStrToParse.endsWith("```")) {
    jsonStrToParse = jsonStrToParse
      .substring(0, jsonStrToParse.length - 3)
      .trim();
  }
  if (!jsonStrToParse) {
    if (idx === -1) {
      throw new Error(
        "No </think> marker found and content is empty or not valid JSON after stripping fences.",
      );
    } else {
      throw new Error(
        "Content after </think> marker is empty or not valid JSON after stripping fences.",
      );
    }
  }

  try {
    return jsonStrToParse;
  } catch (e: unknown) {
    const originalErrorMessage = e instanceof Error ? e.message : String(e);
    if (idx === -1 && content.trim() !== jsonStrToParse) {
      throw new Error(
        `No </think> marker found. Content after stripping fences is not valid JSON: ${originalErrorMessage}`,
      );
    } else if (idx === -1) {
      throw new Error(
        `No </think> marker found and content is not valid JSON: ${originalErrorMessage}`,
      );
    }
    throw new Error(
      `Failed to parse valid JSON from response content after '</think>' marker: ${originalErrorMessage}`,
    );
  }
}
