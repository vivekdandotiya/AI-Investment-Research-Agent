import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function StrengthsWeaknesses({ strengths = [], concerns = [] }) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
      {/* Key Strengths */}
      <div className="premium-card rounded-2xl p-6 border-emerald-500/10 shadow-lg">
        <div className="flex items-center space-x-3 border-b-2 border-black pb-4 mb-5">
          <div className="p-2.5 bg-emerald-100 border-2 border-black rounded-xl text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-black tracking-wide">Investment Catalysts & Strengths</h3>
            <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest mt-1.5">Bull Thesis Drivers</p>
          </div>
        </div>

        <ul className="space-y-4">
          {strengths.length === 0 ? (
            <li className="text-slate-500 italic text-sm">No highlights compiled.</li>
          ) : (
            strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-3 text-xs md:text-sm font-semibold">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-relaxed">{strength}</span>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Key Concerns */}
      <div className="premium-card rounded-2xl p-6 border-rose-500/10 shadow-lg">
        <div className="flex items-center space-x-3 border-b-2 border-black pb-4 mb-5">
          <div className="p-2.5 bg-rose-100 border-2 border-black rounded-xl text-rose-800">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-black tracking-wide">Investment Risks & Concerns</h3>
            <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest mt-1.5">Bear Thesis Threats</p>
          </div>
        </div>

        <ul className="space-y-4">
          {concerns.length === 0 ? (
            <li className="text-slate-500 italic text-sm">No critical risks cataloged.</li>
          ) : (
            concerns.map((concern, index) => (
              <li key={index} className="flex items-start space-x-3 text-xs md:text-sm font-semibold">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 leading-relaxed">{concern}</span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
