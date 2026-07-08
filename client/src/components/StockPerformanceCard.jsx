import React from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

export default function StockPerformanceCard({ performance }) {
  if (!performance) return null;

  const { ticker = 'N/A', recentHikeOrDecline = '', isHikedRecently = true, oneYearReturn = 'N/A', previousYearDrop = 'N/A', shareGrowthDetails = '' } = performance;

  return (
    <div className="bg-white border-2 border-black text-black rounded-2xl p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)] relative overflow-hidden text-left">
      <div className="flex items-center justify-between border-b-2 border-black pb-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl border-2 border-black ${
            isHikedRecently 
              ? 'bg-emerald-100 text-emerald-950' 
              : 'bg-rose-100 text-rose-955'
          }`}>
            {isHikedRecently ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-slate-550 text-slate-500 leading-none">Price Performance</h3>
            <div className="flex items-baseline space-x-2 mt-1.5">
              <span className="text-xl font-black font-display text-black">{ticker}</span>
              <span className="text-[9px] font-mono text-slate-500 font-extrabold">TICKER SYMBOL</span>
            </div>
          </div>
        </div>

        <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg border-2 border-black font-black text-xs font-mono tracking-wider shadow-[2px_2px_0px_rgba(0,0,0,1)] ${
          isHikedRecently 
            ? 'bg-emerald-150 bg-emerald-100 text-emerald-950' 
            : 'bg-rose-150 bg-rose-100 text-rose-950'
        }`}>
          <span>{oneYearReturn}</span>
          <span className="text-[9px] uppercase font-extrabold">{isHikedRecently ? 'Hike' : 'Decline'}</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[10px] font-black text-slate-800 uppercase tracking-widest font-display">
            <Info className="w-3.5 h-3.5 text-black" />
            <span>Historical Price Action</span>
          </div>
          <p className="text-slate-850 text-sm leading-relaxed font-semibold">
            {recentHikeOrDecline}
          </p>
        </div>

        {/* Price Range / Quick Stats */}
        <div className="grid grid-cols-3 gap-2.5 pt-2 font-display">
          <div className="bg-slate-50 border-2 border-black rounded-xl p-2.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <span className="text-[8px] font-extrabold text-slate-500 block uppercase tracking-wider leading-none">12M Trend</span>
            <span className={`text-[10px] font-black mt-1.5 block uppercase leading-tight ${isHikedRecently ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isHikedRecently ? 'Uptrend' : 'Pullback'}
            </span>
          </div>
          <div className="bg-slate-50 border-2 border-black rounded-xl p-2.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <span className="text-[8px] font-extrabold text-slate-500 block uppercase tracking-wider leading-none">Rel Strength</span>
            <span className="text-[10px] font-black text-indigo-700 mt-1.5 block uppercase leading-tight">
              {isHikedRecently ? 'Strong' : 'Weak'}
            </span>
          </div>
          <div className="bg-slate-50 border-2 border-black rounded-xl p-2.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <span className="text-[8px] font-extrabold text-slate-500 block uppercase tracking-wider leading-none">Share Drop</span>
            <span className="text-[10px] font-black text-rose-700 mt-1.5 block uppercase leading-tight">
              {previousYearDrop}
            </span>
          </div>
        </div>

        {/* Share Growth & Valuation details */}
        {shareGrowthDetails && shareGrowthDetails !== 'N/A' && (
          <div className="border-t border-black/10 pt-3.5 mt-3.5 space-y-1">
            <span className="text-[9px] font-extrabold text-slate-500 block uppercase tracking-wider leading-none">Share Growth & Valuation</span>
            <p className="text-slate-800 text-xs font-semibold leading-relaxed mt-1">
              {shareGrowthDetails}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
