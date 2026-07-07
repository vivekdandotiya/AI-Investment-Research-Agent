import React, { useEffect, useRef } from 'react';
import { ShieldAlert, Play, CheckCircle, Terminal } from 'lucide-react';

export default function AgentTerminal({ logs = [], isRunning }) {
  const terminalEndRef = useRef(null);

  // jab bhi naye logs aayein, terminal ko automatically bottom par scroll kar do
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // log update ka dynamic standard timestamp format return karne ke liye
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toTimeString().split(' ')[0];
  };

  // agent status ke base par visual classes aur icon define karne ka selector block
  const getEventMeta = (status) => {
    switch (status) {
      case 'researching':
        return {
          textColor: 'text-indigo-900 bg-indigo-50 border-indigo-200',
          badgeText: 'RESEARCHING',
          icon: <Play className="w-3 h-3 animate-pulse text-indigo-600" />
        };
      case 'research_complete':
        return {
          textColor: 'text-emerald-900 bg-emerald-50 border-emerald-200',
          badgeText: 'RESEARCH DONE',
          icon: <CheckCircle className="w-3 h-3 text-emerald-600" />
        };
      case 'financials':
        return {
          textColor: 'text-blue-900 bg-blue-50 border-blue-200',
          badgeText: 'FINANCIAL ANALYSIS',
          icon: <Play className="w-3 h-3 animate-pulse text-blue-600" />
        };
      case 'financials_complete':
        return {
          textColor: 'text-emerald-900 bg-emerald-50 border-emerald-200',
          badgeText: 'FINANCIALS DONE',
          icon: <CheckCircle className="w-3 h-3 text-emerald-600" />
        };
      case 'news':
        return {
          textColor: 'text-purple-900 bg-purple-50 border-purple-200',
          badgeText: 'SENTIMENT SCAN',
          icon: <Play className="w-3 h-3 animate-pulse text-purple-600" />
        };
      case 'news_complete':
        return {
          textColor: 'text-emerald-900 bg-emerald-50 border-emerald-200',
          badgeText: 'SENTIMENT DONE',
          icon: <CheckCircle className="w-3 h-3 text-emerald-600" />
        };
      case 'risks':
        return {
          textColor: 'text-rose-900 bg-rose-50 border-rose-200',
          badgeText: 'RISK INDEX',
          icon: <Play className="w-3 h-3 animate-pulse text-rose-600" />
        };
      case 'risks_complete':
        return {
          textColor: 'text-emerald-900 bg-emerald-50 border-emerald-200',
          badgeText: 'RISK DONE',
          icon: <CheckCircle className="w-3 h-3 text-emerald-600" />
        };
      case 'deciding':
        return {
          textColor: 'text-amber-900 bg-amber-50 border-amber-200',
          badgeText: 'CIO DECISION',
          icon: <Play className="w-3 h-3 animate-pulse text-amber-600" />
        };
      case 'deciding_complete':
        return {
          textColor: 'text-teal-900 bg-teal-50 border-teal-200',
          badgeText: 'CIO COMPLETE',
          icon: <CheckCircle className="w-3 h-3 text-teal-600" />
        };
      case 'warning':
        return {
          textColor: 'text-amber-950 bg-amber-100 border-amber-300',
          badgeText: 'WARNING',
          icon: <ShieldAlert className="w-3 h-3 text-amber-800" />
        };
      case 'error':
        return {
          textColor: 'text-red-950 bg-red-100 border-red-300',
          badgeText: 'FAILED',
          icon: <ShieldAlert className="w-3 h-3 text-red-805 text-red-800" />
        };
      default:
        return {
          textColor: 'text-slate-800 bg-slate-100 border-slate-300',
          badgeText: 'SYSTEM',
          icon: <Terminal className="w-3 h-3 text-black" />
        };
    }
  };

  return (
    <div className="w-full bg-slate-50 border-2 border-black rounded-xl p-5 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col justify-between">
      {/* terminal core display logs block */}
      <div className="h-[220px] overflow-y-auto space-y-3.5 pr-2 font-mono text-[11px] md:text-xs text-left scrollbar-thin">
        {logs.length === 0 ? (
          <div className="flex items-center space-x-2 text-slate-500 animate-pulse py-1">
            <Play className="w-3.5 h-3.5 animate-spin" />
            <span>AI pipelines load hone ka wait kar rahe hain...</span>
          </div>
        ) : (
          logs.map((log, index) => {
            const meta = getEventMeta(log.status);
            return (
              <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-2 border-b border-black/5 pb-2 last:border-none last:pb-0">
                <div className="flex items-center space-x-1.5 shrink-0">
                  <span className="text-slate-500 font-extrabold">{formatTime(log.timestamp)}</span>
                  <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded border-2 border-black text-[9px] font-black uppercase tracking-wider ${meta.textColor}`}>
                    {meta.icon}
                    <span>{meta.badgeText}</span>
                  </span>
                </div>
                <div className="text-slate-800 font-semibold break-words leading-relaxed pl-1 sm:pl-0">
                  {log.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* terminal bottom active state banner */}
      {isRunning && (
        <div className="border-t border-black/10 pt-3.5 mt-3.5 flex items-center justify-between text-[9px] font-black tracking-widest text-slate-600">
          <span className="flex items-center uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping mr-2" />
            Active pipeline execution: Stream alive
          </span>
          <span>LANGCHAIN WORKFLOW</span>
        </div>
      )}
    </div>
  );
}
