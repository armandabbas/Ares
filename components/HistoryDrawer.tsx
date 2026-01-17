import React from 'react';
import { AnalysisResult } from '../types';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisResult[];
  onSelect: (data: AnalysisResult) => void;
}

const HistoryDrawer: React.FC<Props> = ({ isOpen, onClose, history, onSelect }) => {
  if (!isOpen) return null;

  // Sort: High score (Good short) to Low score (Bad short)
  const sortedHistory = [...history].sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full md:w-[500px] h-full bg-ares-panel border-l border-white/10 flex flex-col p-8 animate-fadeIn">
        
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-2xl font-serif italic text-white">History</h2>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300">
            <X className="text-white" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {sortedHistory.length === 0 ? (
            <p className="text-gray-600 font-mono text-xs uppercase tracking-widest text-center mt-20">
              No analysis recorded yet.
            </p>
          ) : (
            sortedHistory.map((item) => (
              <div 
                key={item.ticker + item.lastUpdated}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="group cursor-pointer border border-white/5 hover:border-white/30 hover:bg-white/5 p-6 transition-all duration-300 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-serif italic text-white group-hover:translate-x-1 transition-transform">
                      {item.ticker}
                    </span>
                    <span className="text-xs font-sans text-gray-500 uppercase">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors">
                    {item.companyName}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-sans font-light text-white">
                    {item.score}
                  </div>
                  <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                    Score
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryDrawer;