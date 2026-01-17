import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SearchHero from './components/SearchHero';
import AnalysisDashboard from './components/AnalysisDashboard';
import HistoryDrawer from './components/HistoryDrawer';
import { AnalysisResult } from './types';
import { analyzeTicker } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'HOME' | 'ANALYSIS'>('HOME');
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  
  // Initialize history from localStorage
  const [history, setHistory] = useState<AnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem('ares_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const saveToHistory = (result: AnalysisResult) => {
    setHistory(prev => {
      // Remove existing entry for same ticker to update it, keeping list unique by ticker
      const filtered = prev.filter(item => item.ticker !== result.ticker);
      const newHistory = [result, ...filtered];
      localStorage.setItem('ares_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleSearch = async (ticker: string) => {
    setLoading(true);
    setError(null);
    try {
      // Minimal artificial delay to show the animation circle
      const [result] = await Promise.all([
        analyzeTicker(ticker),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      setAnalysisData(result);
      saveToHistory(result); // Save successful analysis
      setView('ANALYSIS');
    } catch (err) {
      setError("Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => {
    setView('HOME');
    setAnalysisData(null);
    setError(null);
  };

  const handleHistorySelect = (data: AnalysisResult) => {
    setAnalysisData(data);
    setView('ANALYSIS');
  };

  return (
    <Layout onHome={goHome} onOpenHistory={() => setHistoryOpen(true)}>
      
      <HistoryDrawer 
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelect={handleHistorySelect}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <div className="w-64 h-64 rounded-full border border-white/30 flex items-center justify-center animate-pulse relative">
             <span className="font-serif text-3xl italic text-white animate-pulse">
               Analyzing...
             </span>
             {/* Optional spinning ring for subtle activity */}
             <div className="absolute inset-0 rounded-full border-t border-white animate-spin-slow"></div>
          </div>
        </div>
      ) : view === 'HOME' ? (
        <>
           {error && (
             <div className="absolute top-24 text-center w-full font-mono text-xs text-red-400">
               {error}
             </div>
           )}
           <SearchHero onSearch={handleSearch} />
        </>
      ) : (
        analysisData && <AnalysisDashboard data={analysisData} onSearchNew={handleSearch} />
      )}
    </Layout>
  );
};

export default App;