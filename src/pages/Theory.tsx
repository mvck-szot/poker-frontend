import { useState } from 'react';
import { BookOpen, Info } from 'lucide-react';

interface TheoryProps {
  activeTheoryPos: string;
  setActiveTheoryPos: (pos: string) => void;
  preflopData: any;
  selectedPreflop: any;
  setSelectedPreflop: (val: any) => void;
}

export function Theory({ activeTheoryPos, setActiveTheoryPos, preflopData }: TheoryProps) {
  const positions = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
  const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

  // Pobieramy zakres dla aktualnie wybranej pozycji
  // (Na ten moment backend zwraca tylko UTG i BTN, dla innych dajemy domyślnie pusty)
  const currentRange = preflopData ? preflopData[activeTheoryPos] || {} : {};

  // Funkcja przypisująca kolory
  const getActionColor = (action: string) => {
    switch (action) {
      case 'R': return 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]'; // Raise
      case 'C': return 'bg-emerald-500 text-white'; // Call
      case 'F': return 'bg-zinc-800 text-zinc-500 opacity-50'; // Fold
      default: return 'bg-zinc-900 border-zinc-800 text-zinc-600'; // Brak danych
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full h-full text-slate-200">

      {/* Nagłówek i Nawigacja */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#1a1c23] p-4 rounded-xl border border-zinc-800 shadow-md gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <BookOpen className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-white tracking-wide">Preflop Charts</h2>
        </div>

        {/* Wybór Pozycji */}
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setActiveTheoryPos(pos)}
              className={`px-6 py-2 text-xs font-black uppercase tracking-wider rounded transition-all ${
                activeTheoryPos === pos
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Główna Siatka 13x13 (Grid) */}
        <div className="bg-[#1a1c23] p-6 rounded-xl border border-zinc-800 shadow-2xl overflow-x-auto w-full lg:w-auto">
          <div className="min-w-[600px]">
            {ranks.map((r1, i) => (
              <div key={r1} className="flex">
                {ranks.map((r2, j) => {
                  let handStr = '';
                  if (i === j) {
                    handStr = `${r1}${r2}`; // Pary (AA)
                  } else if (i < j) {
                    handStr = `${r1}${r2}s`; // Suited (AKs) - wyższa karta zawsze pierwsza (r1)
                  } else {
                    handStr = `${r2}${r1}o`; // Offsuit (AKo) - wyższa karta zawsze pierwsza (r2)
                  }

                  const action = currentRange[handStr] || 'F';
                  const colorClass = getActionColor(action);

                  return (
                    <div
                      key={handStr}
                      className={`w-12 h-12 m-[1px] rounded border border-black/20 flex items-center justify-center font-bold text-[11px] cursor-pointer hover:ring-2 ring-white transition-all ${colorClass}`}
                      title={`${handStr} - ${action === 'R' ? 'Raise' : action === 'C' ? 'Call' : 'Fold'}`}
                    >
                      {handStr}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Panel boczny (Legenda i info) */}
        <div className="flex flex-col gap-6 w-full lg:w-80">

          <div className="bg-[#1a1c23] p-6 rounded-xl border border-zinc-800">
            <h3 className="font-bold text-white mb-4 uppercase tracking-widest text-xs text-zinc-500">Legenda</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></div>
                <span className="font-bold text-sm text-white">Raise (Open)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-emerald-500"></div>
                <span className="font-bold text-sm text-white">Call (Limp)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-zinc-800 border border-zinc-700"></div>
                <span className="font-bold text-sm text-zinc-400">Fold</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-900/50 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-blue-400 font-bold mb-2">
              <Info className="w-5 h-5" />
              Informacja
            </div>
            <p className="text-sm text-blue-200/70 leading-relaxed">
              Obecnie wyświetlasz zakres dla pozycji <span className="text-white font-black">{activeTheoryPos}</span>.
              {activeTheoryPos === 'UTG' && " UTG (Under The Gun) to pozycja otwierająca. Graj tylko najsilniejsze układy."}
              {activeTheoryPos === 'BTN' && " BTN (Button) to najlepsza pozycja przy stole. Możesz otwierać bardzo szeroko, aby kraść blindy."}
              {!['UTG', 'BTN'].includes(activeTheoryPos) && " Baza danych GTO dla tej pozycji jest w trakcie przeliczania."}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
