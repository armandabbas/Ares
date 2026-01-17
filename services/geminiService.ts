import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, TrendingStock } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ANALYSIS_SYSTEM_INSTRUCTION = `
You are "Ares", a minimalist and highly intelligent short-selling assistant. 
Your user may be a beginner. You must explain complex financial concepts in plain English.

1. SCORE (0-100): 100 is the perfect short. 0 is a strong buy.
2. EXPLAIN: Provide a "Simple Explanation" that anyone (even a non-trader) can understand. Why is the stock price going to go down?
3. PLAN: Provide a specific Trading Plan. Where is a good entry? Where should they cut losses?

Be aggressive but educational.
`;

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    ticker: { type: Type.STRING },
    companyName: { type: Type.STRING },
    price: { type: Type.NUMBER },
    lastUpdated: { type: Type.STRING },
    score: { type: Type.NUMBER, description: "0 to 100 integer" },
    confidence: { type: Type.NUMBER, description: "1 to 5 integer" },
    verdict: { type: Type.STRING, enum: ['SHORT: STRONG', 'SHORT: GOOD', 'NEUTRAL', 'LONG: AVOID', 'LONG: BUY'] },
    summary: { type: Type.STRING },
    simpleExplanation: { type: Type.STRING, description: "A clear, non-jargon explanation for a beginner why the stock might drop." },
    tradingPlan: {
      type: Type.OBJECT,
      properties: {
        entryZone: { type: Type.STRING, description: "Price range to start shorting" },
        stopLoss: { type: Type.STRING, description: "Price to exit if wrong" },
        targetPrice: { type: Type.STRING, description: "Price to take profit" },
        timeframe: { type: Type.STRING, description: "Expected duration (e.g. 2-4 weeks)" },
        rationale: { type: Type.STRING, description: "Why these levels were chosen" }
      }
    },
    thesisPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          source: { type: Type.STRING },
          date: { type: Type.STRING }
        }
      }
    },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ['HIGH', 'MEDIUM', 'LOW'] },
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      }
    },
    invalidation: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    betterTrades: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          ticker: { type: Type.STRING },
          name: { type: Type.STRING },
          score: { type: Type.NUMBER },
          pitch: { type: Type.STRING }
        }
      }
    },
    breakdown: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          score: { type: Type.NUMBER },
          maxPoints: { type: Type.NUMBER },
          details: { type: Type.STRING }
        }
      }
    },
    sources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          url: { type: Type.STRING },
          timestamp: { type: Type.STRING }
        }
      }
    }
  },
  required: ['ticker', 'score', 'verdict', 'simpleExplanation', 'tradingPlan', 'thesisPoints', 'risks', 'invalidation', 'betterTrades', 'breakdown']
};

export const analyzeTicker = async (ticker: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze ${ticker} for a short position. Current Date: ${new Date().toISOString()}.
      
      Tasks:
      1. Calculate short score based on valuations and technicals.
      2. Write a SIMPLE explanation for a beginner (e.g. "Think of this company like... it's losing money because...").
      3. Define a clear trading setup (Entry, Stop, Target).
      4. Find 3 better short candidates if this one is risky.`,
      config: {
        systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: analysisSchema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis Failed:", error);
    throw error;
  }
};

export const getTrendingShorts = async (): Promise<TrendingStock[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite-latest',
      contents: `List 4 currently trending stocks that are popular short candidates or highly volatile meme stocks right now. Return JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              ticker: { type: Type.STRING },
              name: { type: Type.STRING },
              previewScore: { type: Type.NUMBER },
              changePercent: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    
    const text = response.text;
    if(!text) return [];
    return JSON.parse(text) as TrendingStock[];
  } catch (error) {
    console.warn("Using fallback trending data");
    return [
        { ticker: "CVNA", name: "Carvana", previewScore: 85, changePercent: 5.2 },
        { ticker: "MARA", name: "Marathon Digital", previewScore: 72, changePercent: -2.1 },
        { ticker: "BYND", name: "Beyond Meat", previewScore: 88, changePercent: 1.5 },
        { ticker: "AMC", name: "AMC Ent.", previewScore: 92, changePercent: 8.4 },
    ];
  }
}