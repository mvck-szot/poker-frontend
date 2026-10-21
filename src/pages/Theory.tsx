import { useState } from 'react';
import { Crosshair, MapTrifold, CaretRight, TrendUp } from '@phosphor-icons/react';

interface TheoryProps {
  activeTheoryPos: string;
  setActiveTheoryPos: (pos: string) => void;
  preflopData: any;
  selectedPreflop: any;
  setSelectedPreflop: (hand: any) => void;
}

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const positions = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

export const Theory = ({ activeTheoryPos, setActiveTheoryPos, selectedPreflop, setSelectedPreflop }: TheoryProps) => {
  // Funkcja generująca etykietę ręki (np. AKs, 77, JTo)
  const getHandLabel = (row: number, col: number) => {
    if (row === col) return `${ranks[row]}${ranks[col]}`;
    if (row < col) return `${ranks[row]}${ranks[col]}s`;
    return `${ranks[col]}${ranks[row]}o`;
  };

  // Symulacja danych z solvera dla celów UI (docelowo zastąpisz to danymi z API)
  const getCellColor = (row: number, col: number) => {
    const isPremium = row < 4 && col < 4;
    const isPlayable = row < 8 && col < 8;

    if (isPremium) return 'bg-rose-500/80 hover:bg-rose-400 text-white font-bold'; // Raise
    if (isPlayable && row !== col) return 'bg-emerald-500/80 hover:bg-emerald-400 text-white font-bold'; // Call/Mix
    return 'bg-zinc-900 hover:bg-zinc-700 text-zinc-500'; // Fold
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 text-zinc-200">

      {/* Nagłówek */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4 mt-2">
        <div className="flex items-center gap-3">
          <MapTrifold size={28} weight="duotone" className="text-emerald-500" />
          <h1 className="text-xl font-bold">Preflop Charts</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Panel boczny - Kontrolki */}
        <div className="lg:col-span-1 flex flex-col gap-6">

          <div className="bg-[#161616] border border-zinc-800/60 rounded-md p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
              <Crosshair size={18} weight="bold" className="text-zinc-500" />
              Wybierz Pozycję
            </div>
            <div className="grid grid-cols-2 gap-2">
              {positions.map(pos => (
                <button
                  key={pos}
                  onClick={() => setActiveTheoryPos(pos)}
                  className={`py-2 text-xs font-bold rounded border transition-colors ${
                    activeTheoryPos === pos
                      ? 'bg-zinc-200 text-zinc-900 border-zinc-200'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#161616] border border-zinc-800/60 rounded-md p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-300 mb-2">
              <TrendUp size={18} weight="bold" className="text-zinc-500" />
              Legenda Akcji
            </div>
            <div className="flex flex-col gap-2 text-xs font-bold">
              <div className="flex items-center justify-between bg-zinc-900 p-2 rounded border border-zinc-800">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> Raise</div>
                <span className="text-zinc-500">100%</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-900 p-2 rounded border border-zinc-800">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Call</div>
                <span className="text-zinc-500">100%</span>
              </div>
              <div className="flex items-center justify-between bg-zinc-900 p-2 rounded border border-zinc-800">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-zinc-700 rounded-sm"></div> Fold</div>
                <span className="text-zinc-500">0%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Siatka 13x13 (Hand Matrix) */}
        <div className="lg:col-span-3 flex justify-center items-start">
          <div className="bg-[#161616] border border-zinc-800/60 p-4 rounded-md overflow-x-auto w-full">
            <div className="grid grid-cols-13 gap-[1px] bg-zinc-800/50 p-[1px] rounded shrink-0 min-w-[600px]">
              {ranks.map((_, row) =>
                ranks.map((_, col) => {
                  const hand = getHandLabel(row, col);
                  return (
                    <div
                      key={hand}
                      onMouseEnter={() => setSelectedPreflop(hand)}
                      className={`aspect-square flex items-center justify-center text-[10px] sm:text-xs cursor-pointer transition-colors ${getCellColor(row, col)}`}
                      style={{ gridColumn: col + 1, gridRow: row + 1 }}
                    >
                      {hand}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
