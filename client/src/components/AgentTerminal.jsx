import React, { useEffect, useRef } from 'react';
import { Terminal, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AgentTerminal({ logs = [], isRunning }) {
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const getLogIcon = (status) => {
    switch (status) {
      case 'connected':
        return <Terminal className="w-4 h-4 text-black" />;
      case 'researching':
      case 'financials':
      case 'news':
      case 'risks':
      case 'deciding':
        return <Cpu className="w-4 h-4 text-black animate-spin" style={{ animationDuration: '3s' }} />;
      case 'research_complete':
      case 'financials_complete':
      case 'news_complete':
      case 'risks_complete':
      case 'deciding_complete':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <Terminal className="w-4 h-4 text-slate-500" />;
    }
  };

  const getLogStyle = (status) => {
    if (status?.includes('complete')) return 'text-emerald-700 font-bold';
    if (status === 'error') return 'text-rose-700 font-bold';
    if (status === 'warning') return 'text-amber-700 italic font-bold';
    return 'text-slate-800 font-medium';
  };

  return (
    <div className="w-full bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative text-left">
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-100 border-b-2 border-black relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 border border-black"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500 border border-black"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-black"></div>
          </div>
          <span className="text-[10px] font-mono font-black text-black tracking-wider ml-2">INVESTMENT_PIPELINE.LOG</span>
        </div>
        {isRunning && (
          <span className="flex items-center text-[10px] font-mono font-black text-black border border-black px-2 py-0.5 bg-white rounded shadow-[1px_1px_0px_rgba(0,0,0,1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping mr-2"></span>
            PIPELINE_RUNNING
          </span>
        )}
      </div>

      {/* Terminal Display */}
      <div className="p-5 bg-slate-50 min-h-[220px] max-h-[300px] overflow-y-auto font-mono text-xs md:text-sm space-y-3.5 terminal-scroll relative z-10">
        {logs.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-slate-500 italic space-y-2">
            <Terminal className="w-8 h-8 text-slate-400" />
            <span className="text-xs font-semibold">Waiting to trigger multi-agent pipeline...</span>
          </div>
        ) : (
          logs.map((log, index) => (
            <div key={index} className="flex items-start space-x-3 transition-opacity duration-300">
              <div className="mt-0.5 shrink-0">{getLogIcon(log.status)}</div>
              <div className="flex-1">
                <span className="text-slate-500 mr-2.5 font-bold">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                <span className={getLogStyle(log.status)}>{log.message}</span>
              </div>
            </div>
          ))
        )}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
