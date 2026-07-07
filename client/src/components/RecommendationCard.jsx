import React from 'react';
import { TrendingUp, ShieldCheck, ShieldAlert, BadgeDollarSign } from 'lucide-react';

export default function RecommendationCard({ recommendation, investmentScore, confidenceScore, riskScore, explanation }) {
  const isInvest = recommendation === 'INVEST';

  // dynamic progress circular gauge render karne ka block
  const renderGauge = (score, label, colorClass, gradientId, strokeColor, shadowClass, icon) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div className="flex flex-col items-center bg-white border-2 border-black rounded-xl p-5 flex-1 min-w-[130px] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] relative group overflow-hidden">
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* circular svg arc path */}
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
            <defs>
              <linearGradient id={`grad-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={strokeColor[0]} />
                <stop offset="100%" stopColor={strokeColor[1]} />
              </linearGradient>
            </defs>
            <circle
              cx="48"
              cy="48"
              r={radius}
              className="stroke-slate-100"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={`url(#grad-${gradientId})`}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* gauge ke center me score value display kiya */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black font-mono text-black leading-none">{score}</span>
            <span className="text-[9px] text-slate-555 text-slate-550 text-slate-500 font-extrabold tracking-widest uppercase mt-0.5">%</span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 mt-3 z-10">
          {icon}
          <span className="text-slate-655 text-slate-600 text-[10px] font-extrabold tracking-widest uppercase font-display">{label}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`premium-card p-0 rounded-2xl overflow-hidden ${
      isInvest ? 'glow-border-emerald' : 'glow-border-rose'
    }`}>
      <div className="p-6 md:p-8 flex flex-col gap-6 relative z-10 bg-white">
        
        {/* final recommendation tag aur details verdict block */}
        <div className="w-full space-y-4 text-left">
          <div className="flex items-center space-x-2" title="AI research agents collective portfolio verdict consensus">
            <BadgeDollarSign className={`w-4.5 h-4.5 ${isInvest ? 'text-emerald-600' : 'text-rose-600'}`} />
            <span className="text-[10px] font-extrabold text-slate-600 tracking-widest uppercase font-display">
              Consensus Investment Verdict
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className={`text-4xl md:text-5xl font-black tracking-widest font-display px-8 py-3.5 rounded-2xl text-center border-2 border-black leading-none ${
              isInvest 
                ? 'bg-emerald-100 text-emerald-950 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                : 'bg-rose-100 text-rose-955 text-rose-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
            }`}>
              {recommendation}
            </div>
            
            <div className="flex items-center space-x-2.5 text-slate-900 text-sm font-bold tracking-wide">
              {isInvest ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span className="text-emerald-700 font-black uppercase tracking-widest text-[10px] font-display">APPROVED FOR CAPITAL ALLOCATION</span>
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="text-rose-700 font-black uppercase tracking-widest text-[10px] font-display">HIGH DOWN-SIDE POTENTIAL</span>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-black text-black uppercase tracking-wider block font-display">Decision Agent Portfolio Synthesis</span>
            <p className="text-slate-800 text-sm md:text-base leading-relaxed font-semibold">
              {explanation}
            </p>
          </div>
        </div>

        {/* right display metrics gauges panels - placed in a clean bottom grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full border-t-2 border-black pt-6">
          {renderGauge(
            investmentScore, 
            "Investment Quality", 
            isInvest ? "stroke-emerald-500" : "stroke-rose-500",
            "inv",
            isInvest ? ["#10b981", "#059669"] : ["#f43f5e", "#be123c"],
            "",
            <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
          )}
          {renderGauge(
            confidenceScore, 
            "Confidence Index", 
            "stroke-cyan-500",
            "conf",
            ["#06b6d4", "#3b82f6"],
            "",
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          )}
          {renderGauge(
            riskScore, 
            "Risk Exposure", 
            riskScore > 60 ? "stroke-rose-500" : "stroke-emerald-500",
            "risk",
            riskScore > 60 ? ["#ef4444", "#dc2626"] : riskScore > 40 ? ["#f59e0b", "#d97706"] : ["#10b981", "#059669"],
            "",
            <ShieldAlert className="w-3.5 h-3.5 text-slate-700" />
          )}
        </div>

      </div>
    </div>
  );
}
