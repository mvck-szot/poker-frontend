import { Loader2 } from 'lucide-react';

export const PreflopChart = ({ strategyData, selectedPreflop, setSelectedPreflop }: any) => {
  if (!strategyData) {
    return (
      <div className="p-10 text-emerald-500 flex items-center gap-2">
        <Loader2 className="animate-spin" /> Generowanie drzew pozycyjnych...
      </div>
    );
  }

  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  const getHandColor = (row: number, col: number) => {
    let handKey = row === col
      ? `${ranks[row]}h${ranks[row]}s__`
      : (col > row ? `${ranks[row]}h${ranks[col]}h__` : `${ranks[col]}h${ranks[row]}d__`);

    const strat = strategyData[handKey];
    if (!strat) return 'bg-slate-800 text-slate-700';

    const [fold, call, smallRaise, bigRaise] = strat;
    const totalRaise = smallRaise + bigRaise;

    if (totalRaise > call && totalRaise > fold) {
      return bigRaise > smallRaise
        ? 'bg-purple-600 text-purple-950 shadow-[0_0_10px_rgba(147,51,234,0.3)]'
        : 'bg-emerald-500 text-emerald-950 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
    }
    if (call > fold) return 'bg-cyan-500 text-cyan-950';
    return 'bg-rose-950/40 text-rose-500/50 border border-rose-900/30';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-[13] gap-[2px] p-2 bg-slate-900 rounded-sm border border-slate-800 shadow-xl">
        {ranks.map((r1, row) => (
          <div key={`row-${row}`} className="flex gap-[2px]">
            {ranks.map((r2, col) => {
              let label = row === col
                ? `${r1}${r2}`
                : (col > row ? `${ranks[row]}${ranks[col]}s` : `${ranks[col]}${ranks[row]}o`);
              const isSelected = selectedPreflop?.row === row && selectedPreflop?.col === col;

              return (
                <div
                  key={`${row}-${col}`}
                  onClick={() => setSelectedPreflop({row, col})}
                  className={`w-9 h-9 lg:w-11 lg:h-11 flex items-center justify-center text-[10px] lg:text-xs font-bold rounded-sm transition-all duration-150 cursor-pointer select-none ${getHandColor(row, col)} ${isSelected ? 'ring-2 ring-white z-10 scale-110 shadow-2xl' : 'hover:opacity-75'}`}
                  title={label}
                >
                  {label}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex gap-6 mt-6 bg-[#0a0c0b] px-6 py-3 rounded-sm border border-slate-800 shadow-inner flex-wrap justify-center">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-purple-600"></div><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Big Raise</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-emerald-500"></div><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Small Raise</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-cyan-500"></div><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Call / Mix</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-rose-950 border border-rose-900"></div><span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fold</span></div>
      </div>
    </div>
  );
};
