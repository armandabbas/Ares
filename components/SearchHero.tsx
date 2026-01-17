import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface Props {
  onSearch: (ticker: string) => void;
}

const SearchHero: React.FC<Props> = ({ onSearch }) => {
  const [mode, setMode] = useState<'IDLE' | 'TYPING'>('IDLE');
  const [ticker, setTicker] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === 'TYPING' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.toUpperCase());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force uppercase immediately on input
    setTicker(e.target.value.toUpperCase());
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen">
      
      {mode === 'IDLE' ? (
        <button 
          onClick={() => setMode('TYPING')}
          className="w-64 h-64 rounded-full border border-white flex items-center justify-center group hover:bg-white hover:text-black transition-all duration-500 ease-out animate-fadeIn"
        >
          <span className="font-serif text-5xl italic tracking-wide group-hover:scale-110 transition-transform duration-300">
            Short
          </span>
        </button>
      ) : (
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col items-center animate-fadeIn"
        >
          <input
            ref={inputRef}
            type="text"
            value={ticker}
            onChange={handleInputChange}
            placeholder="TICKER"
            className="bg-transparent border-b border-white text-center text-6xl md:text-8xl font-serif italic text-white placeholder-gray-800 focus:outline-none w-[80vw] max-w-2xl py-4 uppercase"
            autoComplete="off"
            onBlur={() => !ticker && setMode('IDLE')}
          />
          
          <button 
            type="submit" 
            className={`mt-12 flex items-center gap-2 text-sm uppercase tracking-widest hover:opacity-70 transition-opacity ${!ticker ? 'opacity-0' : 'opacity-100'}`}
          >
            Analyze <ArrowRight size={16} />
          </button>
        </form>
      )}

    </div>
  );
};

export default SearchHero;