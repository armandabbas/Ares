import React from 'react';

interface Props {
  children: React.ReactNode;
  onHome: () => void;
  onOpenHistory: () => void;
}

const Layout: React.FC<Props> = ({ children, onHome, onOpenHistory }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-white selection:text-black">
      
      {/* Navbar - Ultra Minimal */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center mix-blend-difference">
        <div 
          onClick={onHome} 
          className="cursor-pointer group"
        >
          <span className="font-serif text-4xl italic tracking-wide group-hover:opacity-70 transition-opacity">
            Ares
          </span>
        </div>
        
        {/* Right Side: Status & History Trigger */}
        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
           </div>

           {/* History Trigger: The requested Horizontal Line */}
           <button 
             onClick={onOpenHistory}
             className="w-12 h-12 flex items-center justify-center group cursor-pointer"
             aria-label="Open History"
           >
             <div className="w-8 h-[1px] bg-white transition-all duration-300 group-hover:w-10"></div>
           </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center relative w-full h-full">
        {children}
      </main>

    </div>
  );
};

export default Layout;