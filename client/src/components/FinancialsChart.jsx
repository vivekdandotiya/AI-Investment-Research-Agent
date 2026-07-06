import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Landmark, BarChart2 } from 'lucide-react';

export default function FinancialsChart({ companyName, summary, investmentScore }) {
  const { revenueGrowth = '', profitability = '', balanceSheet = '' } = summary || {};

  // different companies ke statistics fetch karne ka check (sandbox mode support)
  const getChartData = () => {
    const name = companyName.toLowerCase();
    
    if (name.includes('nvidia') || name.includes('nvda')) {
      return [
        { year: '2022', Revenue: 26.9, 'Net Income': 4.3 },
        { year: '2023', Revenue: 27.0, 'Net Income': 4.4 },
        { year: '2024', Revenue: 60.9, 'Net Income': 29.7 },
        { year: '2025', Revenue: 96.3, 'Net Income': 53.0 },
        { year: '2026 (Est)', Revenue: 120.0, 'Net Income': 68.0 }
      ];
    } else if (name.includes('tesla') || name.includes('tsla')) {
      return [
        { year: '2022', Revenue: 81.4, 'Net Income': 12.6 },
        { year: '2023', Revenue: 96.7, 'Net Income': 15.0 },
        { year: '2024', Revenue: 96.8, 'Net Income': 13.5 },
        { year: '2025', Revenue: 104.5, 'Net Income': 14.8 },
        { year: '2026 (Est)', Revenue: 118.0, 'Net Income': 17.5 }
      ];
    } else if (name.includes('intel') || name.includes('intc')) {
      return [
        { year: '2022', Revenue: 63.1, 'Net Income': 8.0 },
        { year: '2023', Revenue: 54.2, 'Net Income': 1.6 },
        { year: '2024', Revenue: 54.0, 'Net Income': -1.6 },
        { year: '2025', Revenue: 52.4, 'Net Income': -0.8 },
        { year: '2026 (Est)', Revenue: 55.0, 'Net Income': 1.2 }
      ];
    }

    if (name.includes('apple') || name.includes('aapl')) {
      return [
        { year: '2022', Revenue: 394.3, 'Net Income': 99.8 },
        { year: '2023', Revenue: 383.2, 'Net Income': 97.0 },
        { year: '2024', Revenue: 391.0, 'Net Income': 100.4 },
        { year: '2025 (Est)', Revenue: 405.0, 'Net Income': 106.0 },
        { year: '2026 (Est)', Revenue: 425.0, 'Net Income': 112.5 }
      ];
    }

    // agar random target hai to statistics generate karo score ke base par
    const multiplier = investmentScore > 75 ? 1.16 : investmentScore > 50 ? 1.05 : 0.94;
    let baseRev = 40.0;
    let baseNet = 6.0;

    return Array.from({ length: 5 }, (_, i) => {
      const year = (2022 + i).toString();
      const rev = parseFloat((baseRev * Math.pow(multiplier, i) * (1 + (Math.random() - 0.5) * 0.05)).toFixed(1));
      const net = parseFloat((baseNet * Math.pow(multiplier, i) * (1 + (Math.random() - 0.5) * 0.08)).toFixed(1));
      return { year, Revenue: rev, 'Net Income': net };
    });
  };

  const data = getChartData();
  const isBillion = !companyName.toLowerCase().includes('simulated') && data[0].Revenue > 8;
  const valSuffix = isBillion ? 'B' : 'M';

  // custom design elements tooltips inside Recharts graph
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-black rounded-lg p-3 shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] font-black text-black mb-1.5 uppercase tracking-wider font-display">{label} Financials</p>
          <div className="space-y-1 text-xs font-semibold">
            <p className="flex items-center text-[#2563eb]">
              <span className="w-2 h-2 rounded-full bg-[#2563eb] mr-2"></span>
              Revenue: ${payload[0].value}{valSuffix}
            </p>
            <p className="flex items-center text-[#059669]">
              <span className="w-2 h-2 rounded-full bg-[#059669] mr-2"></span>
              Net Income: ${payload[1].value}{valSuffix}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      {/* chart graphics layout panel */}
      <div className="lg:col-span-2 premium-card rounded-2xl p-6 flex flex-col space-y-5 bg-white">
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-100 border-2 border-black rounded-xl text-black">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black tracking-wide font-display leading-none">Historical Financial Performance</h3>
              <p className="text-[9px] text-slate-555 text-slate-500 font-extrabold uppercase tracking-widest mt-1.5 font-display">Annual Revenue vs Net Income ({valSuffix})</p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-1 bg-slate-100 border-2 border-black rounded text-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
            USD Data
          </span>
        </div>

        <div className="h-[260px] w-full mt-2 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
              <XAxis dataKey="year" stroke="#000000" fontSize={10} tickLine={false} axisLine={false} className="font-bold font-mono" />
              <YAxis stroke="#000000" fontSize={10} tickLine={false} axisLine={false} className="font-bold font-mono" />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} className="font-display font-bold text-xs" />
              <Area type="monotone" name="Total Revenue" dataKey="Revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              <Area type="monotone" name="Net Income" dataKey="Net Income" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorNet)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* side key finance performance descriptions bulletins */}
      <div className="premium-card rounded-2xl p-6 flex flex-col space-y-6 bg-white">
        <div className="flex items-center space-x-3 border-b-2 border-black pb-4">
          <div className="p-2.5 bg-slate-100 border-2 border-black rounded-xl text-black">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-black tracking-wide font-display leading-none">Financial Analysis</h3>
            <p className="text-[9px] text-slate-555 text-slate-500 font-extrabold uppercase tracking-widest mt-1.5 font-display">Ratio Bulletins & Strengths</p>
          </div>
        </div>

        <div className="space-y-5 flex-1 overflow-y-auto pr-1 text-xs md:text-sm">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-800 uppercase tracking-widest font-display">
              <DollarSign className="w-3.5 h-3.5 text-black" />
              <span>Revenue Growth Trends</span>
            </div>
            <p className="text-slate-705 text-slate-700 font-semibold leading-relaxed pl-5.5">{revenueGrowth}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-800 uppercase tracking-widest font-display">
              <Landmark className="w-3.5 h-3.5 text-black" />
              <span>Operating Efficiency</span>
            </div>
            <p className="text-slate-705 text-slate-700 font-semibold leading-relaxed pl-5.5">{profitability}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-800 uppercase tracking-widest font-display">
              <Landmark className="w-3.5 h-3.5 text-black" />
              <span>Balance sheet structure</span>
            </div>
            <p className="text-slate-705 text-slate-700 font-semibold leading-relaxed pl-5.5">{balanceSheet}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
