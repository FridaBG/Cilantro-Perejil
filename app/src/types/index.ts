export interface ClassificationResult {
  label: 'parsley' | 'cilantro';
  confidence: number;
}

export interface ApiResponse {
  label: string;
  confidence: number;
}

export interface HerbFact {
  parsley: string;
  cilantro: string;
}