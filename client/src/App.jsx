import React, { useState } from 'react';
import { Sparkles, Terminal, Activity, TrendingUp, ShieldAlert, Cpu, Layers, ArrowLeft } from 'lucide-react';
import SearchBar from './components/SearchBar';
import AgentTerminal from './components/AgentTerminal';
import RecommendationCard from './components/RecommendationCard';
import CompanyProfileCard from './components/CompanyProfileCard';
import FinancialsChart from './components/FinancialsChart';
import StrengthsWeaknesses from './components/StrengthsWeaknesses';
import NewsSentimentCard from './components/NewsSentimentCard';

export default function App() {
  const [activeCompany, setActiveCompany] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [sandboxMode, setSandboxMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'research', 'financials', 'news', 'risks'

  const handleSearch = (companyName) => {
    setIsLoading(true);
    setActiveCompany(companyName);
    setLogs([]);
    setResult(null);
    setActiveTab('overview');

    const sseUrl = `/api/analyze/stream?companyName=${encodeURIComponent(companyName)}&useMockData=${sandboxMode}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.status === 'complete') {
          setResult(data.result);
          setIsLoading(false);
          eventSource.close();
        } else if (data.status === 'error') {
          setLogs((prev) => [
            ...prev,
            { status: 'error', message: data.message, timestamp: Date.now() },
          ]);
          setIsLoading(false);
          eventSource.close();
        } else {
          setLogs((prev) => [
            ...prev,
            { status: data.status, message: data.message, timestamp: Date.now() },
          ]);
        }
      } catch (err) {
        console.error('Failed to parse SSE event message:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource connection error:', err);
      setLogs((prev) => [
        ...prev,
        { status: 'error', message: 'Connection lost or server timeout. Aborting scan.', timestamp: Date.now() },
      ]);
      setIsLoading(false);
      eventSource.close();
    };
  };

  const resetToLanding = () => {
    setResult(null);
    setIsLoading(false);
    setLogs([]);
    setActiveCompany('');
  };

  // Safe and clean parser for agent markdown logs
  const renderAgentMarkdown = (text) => {
    if (!text) return <p className="text-slate-500 italic">No report contents compiled.</p>;
    
    return (
      <div className="space-y-4 text-slate-800 font-sans text-sm md:text-base leading-relaxed">
        {text.split('\n').map((line, index) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={index} className="text-lg font-bold text-black mt-6 mb-3 pb-2 border-b-2 border-black tracking-wide flex items-center">
                <span className="w-1.5 h-4.5 bg-black rounded-full mr-2.5"></span>
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={index} className="text-base font-bold text-slate-900 mt-4 mb-2 tracking-wide">
                {trimmed.replace('#### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
            const content = trimmed.substring(2);
            if (content.startsWith('**')) {
              const parts = content.split('**');
              if (parts.length >= 3) {
                return (
                  <li key={index} className="list-disc ml-6 pl-1 mb-1.5 text-slate-800">
                    <strong className="text-black font-bold">{parts[1]}</strong>
                    {parts.slice(2).join('**')}
                  </li>
                );
              }
            }
            return <li key={index} className="list-disc ml-6 pl-1 mb-1.5 text-slate-800">{content}</li>;
          }
          if (trimmed.startsWith('>')) {
            return (
              <blockquote key={index} className="border-l-4 border-black bg-slate-50 px-4 py-2 italic my-3 text-slate-650 text-slate-600 rounded-r-lg">
                {trimmed.replace('>', '').trim()}
              </blockquote>
            );
          }
          if (trimmed === '') return <div key={index} className="h-2"></div>;
          
          if (trimmed.includes('**')) {
            const parts = trimmed.split('**');
            return (
              <p key={index} className="mb-2">
                {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="text-black font-bold">{part}</strong> : part)}
              </p>
            );
          }
          return <p key={index} className="mb-2">{trimmed}</p>;
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-transparent">
      {/* Navigation Header */}
      <header className="w-full border-b-2 border-black bg-white sticky top-0 z-50 shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={resetToLanding}>
            <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center text-white font-black text-lg border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              I
            </div>
            <div>
              <h1 className="text-base font-black text-black tracking-wider flex items-center leading-none">
                InvesTrack
                <span className="ml-1.5 text-[8px] font-mono font-black bg-black text-white px-1.5 py-0.5 rounded uppercase tracking-widest leading-none">
                  PRO
                </span>
              </h1>
              <p className="text-[8px] text-slate-600 font-extrabold uppercase tracking-widest mt-1">Multi-Agent Equity Research</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {result && !isLoading && (
              <button
                onClick={resetToLanding}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border-2 border-black hover:bg-black hover:text-white rounded-lg text-xs font-bold text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all hover:translate-x-0.5 hover:translate-y-0.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>NEW SCAN</span>
              </button>
            )}
            <div className={`px-2.5 py-1.5 rounded-lg border-2 border-black text-[9px] font-mono font-bold tracking-widest flex items-center space-x-1.5 ${
              sandboxMode 
                ? 'bg-amber-100 text-amber-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]' 
                : 'bg-emerald-100 text-emerald-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sandboxMode ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600'}`}></span>
              <span>{sandboxMode ? 'SANDBOX ACTIVE' : 'LIVE API'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full flex flex-col justify-center relative z-10">
        
        {/* ================= STATE 1: MINIMAL LANDING PAGE ================= */}
        {!result && !isLoading && (
          <div className="max-w-2xl mx-auto w-full py-12 md:py-20 flex flex-col items-center justify-center space-y-10 text-center animate-fade-in">
            {/* Header Hero Area */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-white border-2 border-black rounded-full text-[10px] font-extrabold text-black tracking-widest uppercase shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <span>Next-Gen Investment Intelligence</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight leading-tight">
                AI-Powered <br />
                <span className="underline decoration-black decoration-4 underline-offset-4">
                  Investment Research
                </span>
              </h2>
              <p className="text-slate-700 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-bold">
                Deploy a committee of specialized AI agents to crawl web intelligence, analyze financials, assess risks, and issue institutional consensus ratings.
              </p>
            </div>

            {/* Centralized Search Box */}
            <div className="w-full bg-white border-2 border-black rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <SearchBar 
                onSearch={handleSearch} 
                isLoading={isLoading} 
                sandboxMode={sandboxMode} 
                setSandboxMode={setSandboxMode} 
              />
            </div>

            {/* Small Footer Notice */}
            <div className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider">
              No API Keys? Simply activate **Sandbox Mode** to explore compiled profiles instantly.
            </div>
          </div>
        )}

        {/* ================= STATE 2: PIPELINE LOADING SCREEN & TERMINAL ================= */}
        {isLoading && (
          <div className="max-w-3xl mx-auto w-full space-y-8 py-10">
            {/* Loading Indicator Header */}
            <div className="premium-card rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-black animate-spin"></div>
                  <Cpu className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-black uppercase tracking-wider">Analyzing {activeCompany}</h3>
                  <p className="text-xs text-slate-800 mt-1 font-bold">Multi-agent committee parsing market data...</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-black border-2 border-black px-3 py-1 bg-slate-100 rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                <span className="w-2.5 h-2.5 rounded-full bg-black animate-pulse mr-2"></span>
                <span>PROCESSING STAGES</span>
              </div>
            </div>

            {/* Scrolling Logs Terminal */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-widest flex items-center">
                <Terminal className="w-3.5 h-3.5 text-black mr-2" />
                Agent Pipeline Logs
              </h3>
              <AgentTerminal logs={logs} isRunning={isLoading} />
            </div>
          </div>
        )}

        {/* ================= STATE 3: FULL SYNTHESIZED DASHBOARD ================= */}
        {result && !isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            
            {/* LEFT SIDEBAR: Quick Profile & Context (span 4/12) */}
            <div className="lg:col-span-4 space-y-6">
              <CompanyProfileCard companyName={activeCompany} profile={result.companyProfile} />
              <NewsSentimentCard sentimentSummary={result.sentimentSummary} />
            </div>

            {/* RIGHT MAIN PANEL: Verdict & Deep Reports (span 8/12) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Verdict Summary Header */}
              <RecommendationCard 
                recommendation={result.recommendation}
                investmentScore={result.investmentScore}
                confidenceScore={result.confidenceScore}
                riskScore={result.riskScore}
                explanation={result.explanation}
              />

              {/* Document/Report Tabs */}
              <div className="flex border-b-2 border-black overflow-x-auto text-[10px] font-extrabold tracking-widest uppercase">
                {[
                  { id: 'overview', label: 'Consensus Dashboard', icon: <Layers className="w-3.5 h-3.5" /> },
                  { id: 'research', label: 'Business Profile', icon: <Cpu className="w-3.5 h-3.5" /> },
                  { id: 'financials', label: 'Financial Health', icon: <TrendingUp className="w-3.5 h-3.5" /> },
                  { id: 'news', label: 'Catalysts & News', icon: <Activity className="w-3.5 h-3.5" /> },
                  { id: 'risks', label: 'Risk Evaluation', icon: <ShieldAlert className="w-3.5 h-3.5" /> },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4.5 py-3 border-t-2 border-x-2 border-transparent transition-all duration-150 whitespace-nowrap -mb-[2px] ${
                      activeTab === tab.id
                        ? 'border-black bg-black text-white shadow-[2px_0px_0px_rgba(0,0,0,1)] rounded-t-lg'
                        : 'text-slate-800 hover:text-black hover:bg-slate-50'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Active Tab Panel Output */}
              <div className="transition-all duration-300">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Financial Trend Visualizations */}
                    <FinancialsChart 
                      companyName={activeCompany} 
                      summary={result.financialSummary} 
                      investmentScore={result.investmentScore}
                    />

                    {/* Highlights vs Concerns Grid */}
                    <StrengthsWeaknesses strengths={result.strengths} concerns={result.concerns} />
                  </div>
                )}

                {activeTab === 'research' && (
                  <div className="premium-card rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
                      <span className="text-[9px] font-extrabold font-mono px-3 py-1.5 bg-black text-white rounded border border-black tracking-wider">
                        RESEARCH REPORT
                      </span>
                      <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider">STATUS: FINALIZED</span>
                    </div>
                    {renderAgentMarkdown(result.researchReport)}
                  </div>
                )}

                {activeTab === 'financials' && (
                  <div className="premium-card rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
                      <span className="text-[9px] font-extrabold font-mono px-3 py-1.5 bg-black text-white rounded border border-black tracking-wider">
                        FINANCIAL ANALYSIS REPORT
                      </span>
                      <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider">STATUS: FINALIZED</span>
                    </div>
                    {renderAgentMarkdown(result.financialReport)}
                  </div>
                )}

                {activeTab === 'news' && (
                  <div className="premium-card rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
                      <span className="text-[9px] font-extrabold font-mono px-3 py-1.5 bg-black text-white rounded border border-black tracking-wider">
                        SENTIMENT & NEWS CATALOG
                      </span>
                      <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider">STATUS: FINALIZED</span>
                    </div>
                    {renderAgentMarkdown(result.newsReport)}
                  </div>
                )}

                {activeTab === 'risks' && (
                  <div className="premium-card rounded-2xl p-6 md:p-8">
                    <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-6">
                      <span className="text-[9px] font-extrabold font-mono px-3 py-1.5 bg-black text-white rounded border border-black tracking-wider">
                        RISK ASSESSMENT REPORT
                      </span>
                      <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider">STATUS: FINALIZED</span>
                    </div>
                    {renderAgentMarkdown(result.riskReport)}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer Info */}
      <footer className="w-full text-center py-6 text-[10px] text-slate-800 border-t border-black bg-white mt-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 font-bold">
        <p>© {new Date().getFullYear()} InvesTrack Inc. For demonstrative investment screening purposes only.</p>
        <p className="uppercase tracking-widest">
          Powered by Express, LangChain.js & Google Gemini
        </p>
      </footer>
    </div>
  );
}
