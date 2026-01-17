export interface Breakdown {
  category: string;
  score: number; // 0-100 contribution
  maxPoints: number;
  details: string;
}

export interface Risk {
  id: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
}

export interface TradingPlan {
  entryZone: string;
  stopLoss: string;
  targetPrice: string;
  timeframe: string;
  rationale: string;
}

export interface BetterTrade {
  ticker: string;
  name: string;
  score: number;
  pitch: string;
}

export interface Source {
  name: string;
  url?: string;
  timestamp: string;
}

export interface AnalysisResult {
  ticker: string;
  companyName: string;
  price: number;
  lastUpdated: string;
  score: number; // 0-100
  confidence: number; // 1-5
  verdict: 'SHORT: STRONG' | 'SHORT: GOOD' | 'NEUTRAL' | 'LONG: AVOID' | 'LONG: BUY';
  summary: string;
  simpleExplanation: string; // Layman's terms
  tradingPlan: TradingPlan; // Specific entry/exit data
  thesisPoints: { text: string; source: string; date: string }[];
  risks: Risk[];
  invalidation: string[];
  betterTrades: BetterTrade[];
  breakdown: Breakdown[];
  sources: Source[];
}

export interface TrendingStock {
  ticker: string;
  name: string;
  previewScore: number;
  changePercent: number;
}