import { Activity, Target, TrendingDown, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react';

interface StatsProps {
  eloTrain: number;
  elo1v1: number;
  elo1v7: number;
  eloHistory: number[];
  handHistory: any[];
  handsPlayed: number;
  resetStats: () => void;
}

export function Stats({ handHistory, handsPlayed, resetStats }: StatsProps) {
  // Obliczenia statystyk w locie
  const totalMoves = handHistory.length;

  // Kategoryzacja błędów na podstawie evDiff
  const getCategory = (evDiff: number) => {
    if (evDiff === 0) return 'perfect';
    if (evDiff <= 5) return 'good';
    if (evDiff <= 15) return 'inaccurate';
    if (evDiff <= 30) return 'mistake';
    return 'blunder';
  };

  const stats = {
    perfect: 0, good: 0, inaccurate: 0, mistake: 0, blunder: 0,
    totalEvLoss: 0,
    streets: {
      Preflop: { total: 0, perfect: 0, good: 0, inaccurate: 0, mistake: 0, blunder: 0 },
      Flop: { total: 0, perfect: 0, good: 0, inaccurate: 0, mistake: 0, blunder: 0 },
      Turn: { total: 0, perfect: 0, good: 0, inaccurate: 0, mistake: 0, blunder: 0 },
      River: { total: 0, perfect: 0, good: 0, inaccurate: 0, mistake: 0, blunder: 0 }
    }
  };

  handHistory.forEach(hand => {
    const cat = getCategory(hand.evDiff);
    stats[cat]++;
    stats.totalEvLoss += hand.evDiff;

    // Zabezpieczenie na wypadek braku ulicy
    const street = hand.street || 'Preflop';
    if (stats.streets[street as keyof typeof stats.streets]) {
      stats.streets[street as keyof typeof stats.streets].total++;
      stats.streets[street as keyof typeof stats.streets][cat]++;
    }
  });

  const avgEvLoss = totalMoves > 0 ? (stats.totalEvLoss / totalMoves).toFixed(1) : '0.0';
  const gtoScore = totalMoves > 0 ? (((stats.perfect + stats.good) / totalMoves) * 100).toFixed(1) : '0.0';
  const blunderFreq = totalMoves > 0 ? ((stats.blunder / totalMoves) * 100).toFixed(1) : '0.0';

  const renderProgress = (val: number, max: number, colorClass: string) => {
    const perc = max > 0 ? (val / max) * 100 : 0;
    return (
      <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
        <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${perc}%` }}></div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto text-slate-200">

      {/* Pasek narzędzi (Filtry / Header) */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#1a1c23] p-4 rounded-xl border border-zinc-800 shadow-md">
        <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-zinc-700 pb-4 md:pb-0 md:pr-6 mb-4 md:mb-0 w-full md:w-auto">
          <BarChart2 className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-white tracking-wide">Stats</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['Streets Actions', 'Hands Details', 'Statistics and Results', 'Hole Cards'].map(tab => (
            <button key={tab} className="whitespace-nowrap px-4 py-1.5 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-4 md:mt-0 w-full md:w-auto justify-end">
          <button onClick={resetStats} className="flex items-center gap-2 bg-rose-600/10 hover:bg-rose-600/20 text-rose-500 border border-rose-600/30 px-4 py-2 rounded text-xs font-bold transition-colors">
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {/* TOP METRICS - 4 Karty */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1a1c23] p-6 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm"><Target className="w-4 h-4"/> GTO Score</div>
          <div className="text-4xl font-black text-white">{gtoScore}<span className="text-xl text-zinc-500">%</span></div>
        </div>

        <div className="bg-[#1a1c23] p-6 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm"><Activity className="w-4 h-4"/> Hands</div>
          <div className="text-4xl font-black text-white">{handsPlayed}</div>
          <div className="text-xs text-zinc-500 mt-2 font-bold uppercase tracking-wider">{totalMoves} Moves</div>
        </div>

        <div className="bg-[#1a1c23] p-6 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm"><TrendingDown className="w-4 h-4"/> Average EV Loss</div>
          <div className="flex items-end gap-4">
            <div className="text-4xl font-black text-white">{avgEvLoss}</div>
          </div>
          <div className="text-xs text-zinc-500 mt-2 font-bold uppercase tracking-wider">Per Move (x100)</div>
        </div>

        <div className="bg-[#1a1c23] p-6 rounded-xl border border-zinc-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm"><AlertTriangle className="w-4 h-4"/> Blunder Freq</div>
          <div className="text-4xl font-black text-rose-500">{blunderFreq}<span className="text-xl text-rose-500/50">%</span></div>
        </div>
      </div>

      {/* DOLNA SEKCJA - Tabele i Wykresy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tabela ulic */}
        <div className="lg:col-span-2 bg-[#1a1c23] rounded-xl border border-zinc-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="p-4 font-bold text-zinc-400">Street</th>
                  <th className="p-4 font-bold text-zinc-400">Total</th>
                  <th className="p-4 font-bold text-emerald-400">Perfect %</th>
                  <th className="p-4 font-bold text-emerald-500">Good %</th>
                  <th className="p-4 font-bold text-yellow-500">Inaccurate %</th>
                  <th className="p-4 font-bold text-orange-500">Mistake %</th>
                  <th className="p-4 font-bold text-rose-500">Blunder %</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-800/50 font-bold bg-[#1a1c23]">
                  <td className="p-4 text-white">All Streets</td>
                  <td className="p-4 text-white">{totalMoves}</td>
                  <td className="p-4 text-emerald-400">{totalMoves > 0 ? ((stats.perfect / totalMoves) * 100).toFixed(1) : '-'}</td>
                  <td className="p-4 text-emerald-500">{totalMoves > 0 ? ((stats.good / totalMoves) * 100).toFixed(1) : '-'}</td>
                  <td className="p-4 text-yellow-500">{totalMoves > 0 ? ((stats.inaccurate / totalMoves) * 100).toFixed(1) : '-'}</td>
                  <td className="p-4 text-orange-500">{totalMoves > 0 ? ((stats.mistake / totalMoves) * 100).toFixed(1) : '-'}</td>
                  <td className="p-4 text-rose-500">{totalMoves > 0 ? ((stats.blunder / totalMoves) * 100).toFixed(1) : '-'}</td>
                </tr>
                {['Preflop', 'Flop', 'Turn', 'River'].map((street) => {
                  const sStats = stats.streets[street as keyof typeof stats.streets];
                  return (
                    <tr key={street} className="border-b border-zinc-800/20 hover:bg-zinc-800/30 transition-colors">
                      <td className="p-4 text-zinc-300">{street}</td>
                      <td className="p-4 text-zinc-400">{sStats.total}</td>
                      <td className="p-4 text-emerald-400">{sStats.total > 0 ? ((sStats.perfect / sStats.total) * 100).toFixed(1) : '-'}</td>
                      <td className="p-4 text-emerald-500">{sStats.total > 0 ? ((sStats.good / sStats.total) * 100).toFixed(1) : '-'}</td>
                      <td className="p-4 text-yellow-500">{sStats.total > 0 ? ((sStats.inaccurate / sStats.total) * 100).toFixed(1) : '-'}</td>
                      <td className="p-4 text-orange-500">{sStats.total > 0 ? ((sStats.mistake / sStats.total) * 100).toFixed(1) : '-'}</td>
                      <td className="p-4 text-rose-500">{sStats.total > 0 ? ((sStats.blunder / sStats.total) * 100).toFixed(1) : '-'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paski postępu (Score Breakdown) */}
        <div className="bg-[#1a1c23] rounded-xl border border-zinc-800 p-6">
          <h3 className="text-sm font-bold text-white mb-6">Score Breakdown - Count moves</h3>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-400">Perfect</span>
                <span className="text-zinc-400">{stats.perfect}</span>
              </div>
              {renderProgress(stats.perfect, totalMoves, 'bg-emerald-400')}
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-500">Good</span>
                <span className="text-zinc-400">{stats.good}</span>
              </div>
              {renderProgress(stats.good, totalMoves, 'bg-emerald-500')}
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-yellow-500">Inaccurate</span>
                <span className="text-zinc-400">{stats.inaccurate}</span>
              </div>
              {renderProgress(stats.inaccurate, totalMoves, 'bg-yellow-500')}
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-orange-500">Mistake</span>
                <span className="text-zinc-400">{stats.mistake}</span>
              </div>
              {renderProgress(stats.mistake, totalMoves, 'bg-orange-500')}
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-rose-500">Blunder</span>
                <span className="text-zinc-400">{stats.blunder}</span>
              </div>
              {renderProgress(stats.blunder, totalMoves, 'bg-rose-500')}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
