import React from 'react';
import { Newspaper, Activity, Radio } from 'lucide-react';

export default function NewsSentimentCard({ sentimentSummary }) {
  const { sentiment = 'Neutral', highlights = '' } = sentimentSummary || {};

  const getSentimentStyles = () => {
    switch (sentiment.toLowerCase()) {
      case 'bullish':
        return {
          bg: 'bg-emerald-100 border-2 border-black text-emerald-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] font-display',
          barColor: 'bg-emerald-500 border-r-2 border-black',
          percent: 'w-[85%]',
          label: 'Bullish'
        };
      case 'bearish':
        return {
          bg: 'bg-rose-100 border-2 border-black text-rose-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] font-display',
          barColor: 'bg-rose-500 border-r-2 border-black',
          percent: 'w-[20%]',
          label: 'Bearish'
        };
      default:
        return {
          bg: 'bg-amber-100 border-2 border-black text-amber-950 shadow-[2px_2px_0px_rgba(0,0,0,1)] font-display',
          barColor: 'bg-amber-500 border-r-2 border-black',
          percent: 'w-[50%]',
          label: 'Neutral'
        };
    }
  };

  const style = getSentimentStyles();

  return (
    <div className="premium-card rounded-2xl p-6 space-y-6 text-left bg-white">
      <div className="flex items-center justify-between border-b-2 border-black pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-100 border-2 border-black rounded-xl text-black">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-black tracking-wide leading-none font-display">Market Sentiment</h3>
            <p className="text-[9px] text-slate-550 font-extrabold uppercase tracking-widest mt-1.5 font-display">Media & Headline Cataloging</p>
          </div>
        </div>

        <span className={`text-[10px] font-extrabold font-mono px-3 py-1.5 rounded-lg border uppercase tracking-widest flex items-center leading-none ${style.bg}`}>
          <Radio className="w-3 h-3 mr-1.5 animate-pulse" />
          {style.label}
        </span>
      </div>

      <div className="space-y-5">
        {/* Sentiment Scale Bar */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-[10px] font-black text-slate-800 uppercase tracking-widest font-display">
            <span>Sentiment Consensus Meter</span>
            <span className="font-mono text-black">{sentiment} Overview</span>
          </div>
          <div className="h-3.5 w-full bg-slate-100 border-2 border-black rounded-full overflow-hidden relative">
            <div className={`h-full rounded-full ${style.barColor} ${style.percent} transition-all duration-1000 ease-out`} />
            {/* Center tick indicator */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/25" title="Neutral line" />
          </div>
          <div className="flex justify-between text-[9px] font-extrabold font-mono tracking-widest text-slate-500">
            <span>BEARISH</span>
            <span>NEUTRAL</span>
            <span>BULLISH</span>
          </div>
        </div>

        {/* Highlights Summary */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-[10px] font-black text-slate-800 uppercase tracking-widest font-display">
            <Activity className="w-3.5 h-3.5 text-black" />
            <span>Sentiment Summary Highlights</span>
          </div>
          <p className="text-slate-800 text-sm leading-relaxed pl-5.5 font-semibold">
            {highlights}
          </p>
        </div>
      </div>
    </div>
  );
}
