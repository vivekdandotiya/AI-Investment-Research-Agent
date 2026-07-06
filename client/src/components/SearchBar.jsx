import React, { useState } from 'react';
import { Search, Sparkles, Cpu } from 'lucide-react';

export default function SearchBar({ onSearch, isLoading, sandboxMode, setSandboxMode }) {
  const [query, setQuery] = useState('');

  // form submit hone par search trigger karne ka handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  // quick suggest list me se click hone par analyze trigger karne ke liye
  const quickSelect = (name) => {
    if (!isLoading) {
      setQuery(name);
      onSearch(name);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* search input box container */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex items-center bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 transition-all duration-150">
          <div className="absolute left-4 text-black">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter company name or ticker..."
            className="w-full py-4 pl-12 pr-36 bg-transparent text-black placeholder-slate-500 focus:outline-none focus:ring-0 border-none font-sans text-sm md:text-base font-semibold"
            disabled={isLoading}
          />
          <div className="absolute right-2">
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="btn-premium px-5 py-2.5 rounded-lg font-black flex items-center space-x-1.5 transition-all text-xs"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  <span className="tracking-widest uppercase">SCANNING...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="tracking-widest uppercase">RUN ENGINE</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* demo targets suggestion block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-black font-extrabold uppercase tracking-widest text-[9px] mr-1 flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-black mr-2"></span>
            QUICK TARGETS:
          </span>
          {['Apple Inc', 'NVIDIA Corporation', 'Tesla Inc', 'Intel Corporation'].map((company) => (
            <button
              key={company}
              type="button"
              onClick={() => quickSelect(company)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-white border-2 border-black rounded-lg hover:bg-black hover:text-white text-black font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 text-[11px]"
            >
              {company.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* sandbox mode toggle button - offline testing ke liye */}
        <button
          type="button"
          onClick={() => setSandboxMode(!sandboxMode)}
          className={`flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg border-2 border-black text-[10px] font-bold tracking-widest transition-all duration-300 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 ${
            sandboxMode
              ? 'bg-amber-100 text-amber-900 shadow-[1px_1px_0px_rgba(0,0,0,1)]'
              : 'bg-white text-black'
          }`}
          title="Sandbox mode runs analyses offline using pre-cached mock datasets"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>{sandboxMode ? 'SANDBOX ACTIVE' : 'LIVE API'}</span>
        </button>
      </div>
    </div>
  );
}
