import React from 'react';
import { AnalysisResult } from '../types';
import GaugeChart from './GaugeChart';
import { 
  ExternalLink,
  ChevronDown,
  Info,
  TrendingDown,
  XCircle,
  Target
} from 'lucide-react';

interface Props {
  data: AnalysisResult;
  onSearchNew: (ticker: string) => void;
}

const AnalysisDashboard: React.FC<Props> = ({ data, onSearchNew }) => {
  const [showSources, setShowSources] = React.useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-12 animate-fadeIn pb-32">
      
      {/* Header */}
      <div className="mb-12 text-center border-b border-white/20 pb-8">
        <h1 className="text-8xl md:text-9xl font-serif italic text-white mb-2">{data.ticker}</h1>
        <div className="flex justify-center items-center gap-4 text-sm font-mono text-gray-500 uppercase tracking-widest">
          <span>{data.companyName}</span>
          <span>—</span>
          <span>${data.price?.toFixed(2)}</span>
        </div>
      </div>

      {/* Top Section: Gauge & Verdict */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
        {/* Score Gauge */}
        <div className="flex justify-center md:justify-end order-2 md:order-1">
           <div className="w-64 h-64">
             <GaugeChart score={data.score} />
           </div>
        </div>

        {/* Verdict & Simple Explanation */}
        <div className="flex flex-col justify-center text-center md:text-left order-1 md:order-2">
          <h3 className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-4">The Verdict</h3>
          <div className="text-5xl font-serif italic text-white leading-tight mb-6">
            {data.verdict}
          </div>
          
          <div className="bg-white/5 border border-white/10 p-6 rounded-sm relative">
            <div className="absolute -top-3 left-4 bg-black px-2 text-xs font-mono text-white uppercase flex items-center gap-1">
               <Info size={12} /> Simply Put
            </div>
            <p className="text-lg text-gray-300 font-serif leading-relaxed italic">
              "{data.simpleExplanation}"
            </p>
          </div>
        </div>
      </div>

      {/* Trading Plan Section - "When to Enter?" */}
      <div className="mb-16">
        <h2 className="text-3xl font-serif italic mb-8 border-b border-white/20 pb-2">The Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           
           {/* Entry */}
           <div className="border border-white/20 p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors group">
              <TrendingDown size={24} className="text-gray-500 mb-4 group-hover:text-white" />
              <div className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Ideal Entry</div>
              <div className="text-3xl font-serif italic text-white">{data.tradingPlan.entryZone}</div>
              <p className="text-xs text-gray-600 mt-2">{data.tradingPlan.rationale}</p>
           </div>

           {/* Stop Loss */}
           <div className="border border-white/20 p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors group">
              <XCircle size={24} className="text-gray-500 mb-4 group-hover:text-white" />
              <div className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Stop Loss</div>
              <div className="text-3xl font-serif italic text-white">{data.tradingPlan.stopLoss}</div>
              <p className="text-xs text-gray-600 mt-2">Exit if price hits this</p>
           </div>

           {/* Target */}
           <div className="border border-white/20 p-6 flex flex-col items-center text-center hover:bg-white/5 transition-colors group">
              <Target size={24} className="text-gray-500 mb-4 group-hover:text-white" />
              <div className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">Target</div>
              <div className="text-3xl font-serif italic text-white">{data.tradingPlan.targetPrice}</div>
              <p className="text-xs text-gray-600 mt-2">Take profit here</p>
           </div>

        </div>
      </div>

      {/* Deep Dive Grid */}
      <div className="grid grid-cols-1 gap-12">
        
        {/* Thesis Points */}
        <div className="border-t border-white/20 pt-8">
          <h2 className="text-3xl font-serif italic mb-8">Why Short?</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.thesisPoints.map((point, idx) => (
              <li key={idx} className="flex flex-col gap-2">
                <span className="font-mono text-xs text-gray-600">0{idx + 1}</span>
                <p className="text-lg text-gray-300 font-serif leading-snug">{point.text}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks & Invalidation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/20 pt-8">
            <div>
                <h2 className="text-3xl font-serif italic mb-6">Risks</h2>
                <div className="space-y-6">
                    {data.risks.map((risk, idx) => (
                    <div key={idx}>
                        <h4 className="font-mono text-xs uppercase text-white mb-1">{risk.title}</h4>
                        <p className="text-gray-500 text-sm">{risk.description}</p>
                    </div>
                    ))}
                </div>
            </div>
            
            <div>
                <h2 className="text-3xl font-serif italic mb-6">Invalidation</h2>
                <ul className="space-y-4">
                {data.invalidation.map((point, idx) => (
                    <li key={idx} className="flex gap-4 text-sm text-gray-400 border-l border-white/20 pl-4">
                        {point}
                    </li>
                ))}
                </ul>
            </div>
        </div>

        {/* Better Trades */}
        <div className="border-t border-white/20 pt-8">
          <h2 className="text-3xl font-serif italic mb-8">Better Alternatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.betterTrades.map((trade, idx) => (
              <div 
                key={idx} 
                className="group cursor-pointer border border-transparent hover:border-white/20 p-4 transition-all"
                onClick={() => onSearchNew(trade.ticker)}
              >
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-serif italic text-2xl group-hover:text-white transition-colors">{trade.ticker}</span>
                  <span className="font-mono text-xs text-gray-600">{trade.score} PTS</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{trade.pitch}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Sources Toggle */}
      <div className="mt-16 text-center">
        <button 
          onClick={() => setShowSources(!showSources)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest"
        >
          {showSources ? 'Hide' : 'View'} Sources <ChevronDown className={`transition-transform ${showSources ? 'rotate-180' : ''}`} size={12} />
        </button>
        {showSources && (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {data.sources.map((src, idx) => (
              <a 
                key={idx} 
                href={src.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-white underline underline-offset-4"
              >
                {src.name}
              </a>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AnalysisDashboard;