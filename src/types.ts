export interface AnalysisResult {
  confidenceScore: number; 
  verdict: 'Safe' | 'Suspicious' | 'Phishing';
  redFlags: string[];
  safePoints: string[];
  headerAnalysis: string;
}

export interface AnalyzeRequest {
  emailHeaders: string;
  emailBody: string;
}