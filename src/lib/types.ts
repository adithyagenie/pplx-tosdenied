export interface RedFlag {
  text: string;
  severity: "high" | "medium" | "low";
}

export interface AnalysisResult {
  company: string;
  product?: string;
  /** Optional URL provided by user for policy or main page */
  url?: string;
  /** Direct URL of the Terms of Service document found, if any */
  tosUrl?: string | null;
  /** Direct URL of the Privacy Policy document found, if any */
  privacyPolicyUrl?: string | null;
  /** Optional URL for the company or product icon, if available */
  iconUrl?: string | null;
  redFlags: RedFlag[];
  /** Overall policy grade: S, A, B, C, or E if no policies found */
  grade: "S" | "A" | "B" | "C" | "E";
  isProductSpecific: boolean;
  analyzedAt: Date;
}

export interface CachedAnalysis extends AnalysisResult {
  _id?: string;
  cacheKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFormData {
  query: string;
  type: "product" | "company";
  company?: string;
  product?: string;
  /** Optional URL to the service's policy or main page for analysis */
  url?: string;
}

// interface RedFlagItem {
//   /** Order of concern, 1 being most concerning. */
//   concern_level: number;
//   /** A very short, simple explanation of the red flag (1-2 sentences, everyday words). */
//   description: string;
// }

// interface ProductAnalysisOutput {
//   /** The name of the product analyzed. */
//   entity_name: string;
//   /** Specifies that the analysis is for a product. */
//   analyzed_for: "product";
//   /** The name of the company that makes the product. */
//   company_name: string;
//   /** The policy page URL provided by the user for analysis, if any. */
//   input_url_provided?: string | null; // Assuming URL can be a string
//   /** A publicly accessible URL for the product logo/icon, or null if not found. */
//   icon_url?: string | null; // Assuming URL can be a string
//   /** True if policies were found and analyzed, false otherwise. */
//   policies_found: boolean;
//   /** The direct URL of the Terms of Service document found, or null. */
//   tos_url?: string | null; // Assuming URL can be a string
//   /** The direct URL of the Privacy Policy document found, or null. */
//   privacy_policy_url?: string | null; // Assuming URL can be a string
//   /** Suggested alternatives or a message if policies were not found at the provided URL. Null if policies were found. */
//   suggestions_if_not_found?: string[] | string | null;
//   /** A list of red flags, ordered from most to least concerning by concern_level. Null if policies were not found. */
//   red_flags?: RedFlagItem[] | null;
//   /** Overall consumer-friendliness grade (S, A, B, C). Null if policies were not found. */
//   consumer_friendliness_grade?: "S" | "A" | "B" | "C" | null;
// }

// export interface CompanyAnalysisOutput {
//   /** The name of the company analyzed. */
//   entity_name: string;
//   /** Specifies that the analysis is for a company's general policies. */
//   analyzed_for: "company";
//   /** The policy page URL provided by the user for analysis, if any. */
//   input_url_provided?: string | null; // Assuming URL can be a string
//   /** A publicly accessible URL for the company logo/icon, or null if not found. */
//   icon_url?: string | null; // Assuming URL can be a string
//   /** True if policies were found and analyzed, false otherwise. */
//   policies_found: boolean;
//   /** The direct URL of the Terms of Service document found, or null. */
//   tos_url?: string | null; // Assuming URL can be a string
//   /** The direct URL of the Privacy Policy document found, or null. */
//   privacy_policy_url?: string | null; // Assuming URL can be a string
//   /** Suggested alternatives or a message if policies were not found at the provided URL. Null if policies were found. */
//   suggestions_if_not_found?: string[] | string | null;
//   /** A list of red flags, ordered from most to least concerning by concern_level. Null if policies were not found. */
//   red_flags?: RedFlagItem[] | null;
//   /** Overall consumer-friendliness grade (S, A, B, C). Null if policies were not found. */
//   consumer_friendliness_grade?: "S" | "A" | "B" | "C" | null;
// }

export const ProductAnalysisOutputSchema = `
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "additionalProperties": false,
    "definitions": {
        "RedFlagItem": {
            "additionalProperties": false,
            "properties": {
                "concern_level": {
                    "description": "Order of concern, 1 being most concerning.",
                    "type": "number"
                },
                "description": {
                    "description": "A very short, simple explanation of the red flag (1-2 sentences, everyday words).",
                    "type": "string"
                }
            },
            "required": [
                "concern_level",
                "description"
            ],
            "type": "object"
        }
    },
    "properties": {
        "analyzed_for": {
            "const": "product",
            "description": "Specifies that the analysis is for a product.",
            "type": "string"
        },
        "company_name": {
            "description": "The name of the company that makes the product.",
            "type": "string"
        },
        "consumer_friendliness_grade": {
            "anyOf": [
                {
                    "enum": [
                        "A",
                        "B",
                        "C",
                        "S"
                    ],
                    "type": "string"
                },
                {
                    "type": "null"
                }
            ],
            "description": "Overall consumer-friendliness grade (S, A, B, C). Null if policies were not found."
        },
        "entity_name": {
            "description": "The name of the product analyzed.",
            "type": "string"
        },
        "icon_url": {
            "description": "A publicly accessible URL for the product logo/icon, or null if not found.",
            "type": [
                "null",
                "string"
            ]
        },
        "input_url_provided": {
            "description": "The policy page URL provided by the user for analysis, if any.",
            "type": [
                "null",
                "string"
            ]
        },
        "policies_found": {
            "description": "True if policies were found and analyzed, false otherwise.",
            "type": "boolean"
        },
        "privacy_policy_url": {
            "description": "The direct URL of the Privacy Policy document found, or null.",
            "type": [
                "null",
                "string"
            ]
        },
        "red_flags": {
            "anyOf": [
                {
                    "items": {
                        "$ref": "#/definitions/RedFlagItem"
                    },
                    "type": "array"
                },
                {
                    "type": "null"
                }
            ],
            "description": "A list of red flags, ordered from most to least concerning by concern_level. Null if policies were not found."
        },
        "suggestions_if_not_found": {
            "anyOf": [
                {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                {
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ],
            "description": "Suggested alternatives or a message if policies were not found at the provided URL. Null if policies were found."
        },
        "tos_url": {
            "description": "The direct URL of the Terms of Service document found, or null.",
            "type": [
                "null",
                "string"
            ]
        }
    },
    "required": [
        "analyzed_for",
        "company_name",
        "entity_name",
        "policies_found"
    ],
    "type": "object"
}
`;

export const CompanyAnalysisOutputSchema = `
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "additionalProperties": false,
    "definitions": {
        "RedFlagItem": {
            "additionalProperties": false,
            "properties": {
                "concern_level": {
                    "description": "Order of concern, 1 being most concerning.",
                    "type": "number"
                },
                "description": {
                    "description": "A very short, simple explanation of the red flag (1-2 sentences, everyday words).",
                    "type": "string"
                }
            },
            "required": [
                "concern_level",
                "description"
            ],
            "type": "object"
        }
    },
    "properties": {
        "analyzed_for": {
            "const": "company",
            "description": "Specifies that the analysis is for a company's general policies.",
            "type": "string"
        },
        "consumer_friendliness_grade": {
            "anyOf": [
                {
                    "enum": [
                        "A",
                        "B",
                        "C",
                        "S"
                    ],
                    "type": "string"
                },
                {
                    "type": "null"
                }
            ],
            "description": "Overall consumer-friendliness grade (S, A, B, C). Null if policies were not found."
        },
        "entity_name": {
            "description": "The name of the company analyzed.",
            "type": "string"
        },
        "icon_url": {
            "description": "A publicly accessible URL for the company logo/icon, or null if not found.",
            "type": [
                "null",
                "string"
            ]
        },
        "input_url_provided": {
            "description": "The policy page URL provided by the user for analysis, if any.",
            "type": [
                "null",
                "string"
            ]
        },
        "policies_found": {
            "description": "True if policies were found and analyzed, false otherwise.",
            "type": "boolean"
        },
        "privacy_policy_url": {
            "description": "The direct URL of the Privacy Policy document found, or null.",
            "type": [
                "null",
                "string"
            ]
        },
        "red_flags": {
            "anyOf": [
                {
                    "items": {
                        "$ref": "#/definitions/RedFlagItem"
                    },
                    "type": "array"
                },
                {
                    "type": "null"
                }
            ],
            "description": "A list of red flags, ordered from most to least concerning by concern_level. Null if policies were not found."
        },
        "suggestions_if_not_found": {
            "anyOf": [
                {
                    "items": {
                        "type": "string"
                    },
                    "type": "array"
                },
                {
                    "type": [
                        "null",
                        "string"
                    ]
                }
            ],
            "description": "Suggested alternatives or a message if policies were not found at the provided URL. Null if policies were found."
        },
        "tos_url": {
            "description": "The direct URL of the Terms of Service document found, or null.",
            "type": [
                "null",
                "string"
            ]
        }
    },
    "required": [
        "analyzed_for",
        "entity_name",
        "policies_found"
    ],
    "type": "object"
}
`;
