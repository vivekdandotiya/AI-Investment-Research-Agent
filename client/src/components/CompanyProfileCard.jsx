import React from 'react';
import { Building2, Cpu, KeyRound, ArrowUpRight } from 'lucide-react';

export default function CompanyProfileCard({ companyName, profile }) {
  const { sector = 'N/A', businessModel = 'N/A', moat = 'N/A', marketShare = 'N/A' } = profile || {};

  return (
    <div className="bg-white border-2 border-black text-black rounded-2xl p-6 space-y-6 flex flex-col justify-between text-left shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-100 border-2 border-black rounded-xl text-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-black font-display tracking-wide leading-none">{companyName}</h2>
              <p className="text-[9px] text-cyan-800 font-extrabold uppercase tracking-widest mt-1.5 font-display">{sector}</p>
            </div>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-500 hover:text-black transition-colors cursor-pointer" />
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-800 uppercase tracking-widest font-display">
              <Cpu className="w-3.5 h-3.5 text-black" />
              <span>Core Business Model</span>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed pl-5.5 font-semibold">
              {businessModel}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-800 uppercase tracking-widest font-display">
              <KeyRound className="w-3.5 h-3.5 text-black" />
              <span>Competitive Moat & Barrier</span>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed pl-5.5 font-semibold">
              {moat}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-800 uppercase tracking-widest font-display">
              <Building2 className="w-3.5 h-3.5 text-black" />
              <span>Sector Market Share</span>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed pl-5.5 font-semibold">
              {marketShare}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
