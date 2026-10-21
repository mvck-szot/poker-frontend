import { Play, Swords, Wrench, BookOpen, BarChart2, ChevronRight } from 'lucide-react';

export const Home = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  // Pobieranie danych użytkownika z localStorage dla szybkiego dostępu na pulpicie
  const user = JSON.parse(localStorage.getItem('poker_user') || '{}');

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 w-full">

      {/* Nagłówek */}
      <div className="flex justify-between items-end border-b border-zinc-800 pb-6 mt-2">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Witaj, {user.username || 'Graczu'}.
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">Twój panel dowodzenia i podsumowanie sesji.</p>
        </div>
      </div>

      {/* Główny moduł - Quick Start */}
      <div className="w-full bg-emerald-900/10 border border-emerald-500/20 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col gap-3 z-10">
          <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest mb-1">
            <Play className="w-3 h-3" /> Rekomendowane na dziś
          </div>
          <h2 className="text-3xl font-black text-white leading-tight">Szybki Trening GTO</h2>
          <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
            Rozegraj losowe scenariusze przeciwko silnikowi CFR. Popraw swoją strategię preflop i postflop podejmując matematycznie optymalne decyzje.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('train')}
          className="z-10 w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          Rozpocznij Trening
        </button>
      </div>

      {/* Siatka nawigacyjna - Surowy, analityczny styl */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => setActiveTab('arena')} className="group flex flex-col bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-xl transition-all text-left relative overflow-hidden">
          <div className="p-3 bg-zinc-950 rounded-lg w-fit border border-zinc-800 mb-4 group-hover:border-zinc-600 transition-colors">
            <Swords className="w-5 h-5 text-zinc-300" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-1">Arena 1v1 & 1v7</h3>
          <p className="text-xs text-zinc-500">Rywalizuj z botami o punkty ELO.</p>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
        </button>

        <button onClick={() => setActiveTab('theory')} className="group flex flex-col bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-xl transition-all text-left relative overflow-hidden">
          <div className="p-3 bg-zinc-950 rounded-lg w-fit border border-zinc-800 mb-4 group-hover:border-zinc-600 transition-colors">
            <BookOpen className="w-5 h-5 text-zinc-300" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-1">Preflop Charts</h3>
          <p className="text-xs text-zinc-500">Analizuj tabele otwarć i zasięgi.</p>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
        </button>

        <button onClick={() => setActiveTab('stats')} className="group flex flex-col bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-6 rounded-xl transition-all text-left relative overflow-hidden">
          <div className="p-3 bg-zinc-950 rounded-lg w-fit border border-zinc-800 mb-4 group-hover:border-zinc-600 transition-colors">
            <BarChart2 className="w-5 h-5 text-zinc-300" />
          </div>
          <h3 className="text-lg font-bold text-zinc-100 mb-1">Twoje Statystyki</h3>
          <p className="text-xs text-zinc-500">Historia rozdań i wykres ELO.</p>
          <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Dolny moduł - Skrót do Custom Board */}
      <div className="w-full bg-[#161616] border border-zinc-800 p-6 rounded-xl flex justify-between items-center group cursor-pointer hover:border-zinc-700 transition-colors" onClick={() => setActiveTab('train')}>
         <div className="flex items-center gap-4">
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <Wrench className="w-5 h-5 text-zinc-400" />
            </div>
            <div>
              <h4 className="text-zinc-200 font-bold text-sm">Kreator Custom Board</h4>
              <p className="text-zinc-500 text-xs mt-0.5">Skonfiguruj własny scenariusz i przeanalizuj go w silniku.</p>
            </div>
         </div>
         <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
      </div>

    </div>
  );
};
