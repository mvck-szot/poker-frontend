import { BookOpen, Search } from 'lucide-react';
import { PreflopChart } from '../components/PreflopChart';
import { PokerCard } from '../components/PokerCard';

export const Theory = ({ activeTheoryPos, setActiveTheoryPos, preflopData, selectedPreflop, setSelectedPreflop }: any) => {
  const renderRangeExplorerPanel = () => {
    const currentPositionData = preflopData ? preflopData[activeTheoryPos] : null;

    if (!selectedPreflop || !currentPositionData) {
      return (
        <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center gap-4 py-20 px-6">
          <Search className="w-12 h-12 mb-2 opacity-20" />
          <p className="text-sm font-bold uppercase tracking-widest">Eksplorator</p>
          <p className="text-xs">Kliknij rękę na siatce, aby zobaczyć strategię.</p>
        </div>
      );
    }

    const { row, col } = selectedPreflop;
    const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
    let handKey = "", label = "", cards: string[] = [];

    if (row === col) {
        handKey = `${ranks[row]}h${ranks[row]}s__`; label = `${ranks[row]}${ranks[row]}`; cards = [`${ranks[row]}h`, `${ranks[row]}s`];
    } else if (col > row) {
        handKey = `${ranks[row]}h${ranks[col]}h__`; label = `${ranks[row]}${ranks[col]}s`; cards = [`${ranks[row]}h`, `${ranks[col]}h`];
    } else {
        handKey = `${ranks[col]}h${ranks[row]}d__`; label = `${ranks[col]}${ranks[row]}o`; cards = [`${ranks[col]}h`, `${ranks[row]}d`];
    }

    const strat = currentPositionData[handKey] || [1, 0, 0, 0];
    const [fold, call, smallRaise, bigRaise] = strat;

    let category = "Grywalna";
    if (bigRaise + smallRaise > 0.8) category = "Premium / Value";
    else if (fold > 0.8) category = "Fold / Śmieci";
    else if (call > 0.3 && (bigRaise + smallRaise) > 0.3) category = "Mix (Mieszana)";

    return (
      <div className="flex flex-col gap-8 w-full h-full">
        <div className="flex justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-black text-white">{label}</h3>
            <span className="text-[10px] text-amber-500 border border-amber-500/30 px-2 py-1 rounded-sm bg-amber-500/10 uppercase font-black">{activeTheoryPos}</span>
          </div>
          <span className="text-[10px] text-slate-500 border border-slate-800 px-3 py-1.5 rounded-sm bg-slate-900/50 uppercase font-mono">{category}</span>
        </div>
        <div className="flex justify-center gap-4">
          <PokerCard card={cards[0]} size="large" />
          <PokerCard card={cards[1]} size="large" />
        </div>
        <div className="flex flex-col gap-4 mt-2">
          {[
            { label: 'Raise 75%', val: bigRaise, color: 'bg-purple-600', text: 'text-purple-500' },
            { label: 'Raise 33%', val: smallRaise, color: 'bg-emerald-500', text: 'text-emerald-500' },
            { label: 'Call', val: call, color: 'bg-cyan-500', text: 'text-cyan-500' },
            { label: 'Fold', val: fold, color: 'bg-rose-600', text: 'text-rose-500' }
          ].map(s => (
            <div key={s.label} className="bg-[#0a0c0b] p-3 rounded-sm border border-slate-800 flex flex-col gap-1.5">
              <div className="flex justify-between text-[10px] font-bold">
                <span className={`${s.text} uppercase tracking-widest`}>{s.label}</span>
                <span className={`${s.text} opacity-80 font-mono text-base`}>{(s.val * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-sm overflow-hidden">
                <div style={{width: `${s.val * 100}%`}} className={`h-full ${s.color} transition-all duration-500`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 flex flex-col gap-6 w-full">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-emerald-500"/> Preflop GTO Ranges
          </h2>
          <p className="text-slate-400 text-sm">Wybierz pozycję przy stole, aby zobaczyć optymalny zakres rąk.</p>
        </div>
        <div className="flex gap-2 p-1.5 bg-[#0d100f] border border-slate-800 rounded-sm w-fit shadow-xl">
          {['UTG', 'CO', 'BTN', 'SB'].map(pos => (
            <button key={pos} onClick={() => setActiveTheoryPos(pos)} className={`px-6 py-2 rounded-sm font-black text-xs transition-colors ${activeTheoryPos === pos ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              {pos}
            </button>
          ))}
        </div>
        <div className="flex justify-center bg-[#0d100f] border border-slate-800 p-8 rounded-sm shadow-xl relative">
          <PreflopChart strategyData={preflopData ? preflopData[activeTheoryPos] : null} selectedPreflop={selectedPreflop} setSelectedPreflop={setSelectedPreflop} />
        </div>
      </div>
      <div className="w-full lg:w-96 shrink-0 bg-[#0d100f] border border-slate-800 p-6 rounded-sm shadow-xl sticky top-6 min-h-[500px]">
        {renderRangeExplorerPanel()}
      </div>
    </div>
  );
};
