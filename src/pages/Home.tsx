import { Target, Sword, Wrench, BookOpen, ChartBar, Trophy, CaretRight } from '@phosphor-icons/react';

export const Home = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const user = JSON.parse(localStorage.getItem('poker_user') || '{}');

  const navItems = [
    { id: 'train', icon: <Target size={24} weight="duotone" className="text-emerald-500" />, title: 'Szybki Trening', desc: 'Graj przeciwko optymalnemu GTO' },
    { id: 'arena', icon: <Sword size={24} weight="duotone" className="text-blue-500" />, title: 'Arena 1v1 / 1v7', desc: 'Rywalizuj z botami o punkty ELO' },
    { id: 'train_custom', icon: <Wrench size={24} weight="duotone" className="text-emerald-400" />, title: 'Custom Board', desc: 'Rozwiązuj własne scenariusze' },
    { id: 'theory', icon: <BookOpen size={24} weight="duotone" className="text-blue-400" />, title: 'Preflop Charts', desc: 'Zbuduj idealne zasięgi otwarć' },
    { id: 'stats', icon: <ChartBar size={24} weight="duotone" className="text-amber-500" />, title: 'Statystyki', desc: 'Analizuj swoje błędy i postępy' },
    { id: 'leaderboard', icon: <Trophy size={24} weight="duotone" className="text-amber-400" />, title: 'Ranking', desc: 'Top 10 graczy w systemie' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 text-zinc-200">

      <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mt-2">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      {/* Płaska siatka nawigacyjna */}
      <div className="bg-[#161616] border border-zinc-800/60 rounded-md p-6 mb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-8">
          {navItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab(item.id.replace('_custom', ''))}
              className="flex items-start gap-4 cursor-pointer group p-2 -m-2 rounded hover:bg-zinc-800/40 transition-colors"
            >
              <div className="mt-0.5">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{item.title}</span>
                <span className="text-xs text-zinc-500 mt-0.5">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panele analityczne */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Moduł: Trainer stats */}
        <div className="bg-[#161616] border border-zinc-800/60 rounded-md flex flex-col cursor-pointer hover:bg-[#1a1a1a] transition-colors" onClick={() => setActiveTab('stats')}>
          <div className="flex justify-between items-center p-4 border-b border-zinc-800/60">
            <h3 className="font-bold text-sm text-zinc-100">Trainer stats</h3>
            <CaretRight size={16} weight="bold" className="text-zinc-600" />
          </div>
          <div className="p-6 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
               <div className="flex justify-between">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mb-1">Hands</span>
                   <span className="text-xl font-semibold text-zinc-200">0</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mb-1">Moves</span>
                   <span className="text-xl font-semibold text-zinc-200">0</span>
                 </div>
               </div>
               <div className="flex justify-between">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mb-1">Mistakes</span>
                   <span className="text-xl font-semibold text-zinc-200">0</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mb-1">GTO Score</span>
                   <span className="text-xl font-semibold text-zinc-200">0%</span>
                 </div>
               </div>
            </div>

            {/* Struktura progresu trafności */}
            <div className="flex flex-col justify-center gap-3">
               <div className="flex items-center gap-3 text-xs">
                 <span className="w-16 text-zinc-400 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Best</span>
                 <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="w-[80%] h-full bg-emerald-500"></div></div>
               </div>
               <div className="flex items-center gap-3 text-xs">
                 <span className="w-16 text-zinc-400 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div> Correct</span>
                 <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="w-[60%] h-full bg-emerald-400"></div></div>
               </div>
               <div className="flex items-center gap-3 text-xs">
                 <span className="w-16 text-zinc-400 flex items-center gap-1.5"><div className="w-2 h-2 border border-amber-500 rounded-full"></div> Inacc.</span>
                 <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="w-[30%] h-full bg-amber-500"></div></div>
               </div>
               <div className="flex items-center gap-3 text-xs">
                 <span className="w-16 text-zinc-400 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Blunder</span>
                 <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden"><div className="w-[10%] h-full bg-rose-500"></div></div>
               </div>
            </div>
          </div>
        </div>

        {/* Moduł: Arena Performance */}
        <div className="bg-[#161616] border border-zinc-800/60 rounded-md flex flex-col cursor-pointer hover:bg-[#1a1a1a] transition-colors" onClick={() => setActiveTab('arena')}>
          <div className="flex justify-between items-center p-4 border-b border-zinc-800/60">
            <h3 className="font-bold text-sm text-zinc-100">Arena stats</h3>
            <CaretRight size={16} weight="bold" className="text-zinc-600" />
          </div>
          <div className="p-6 flex flex-col justify-between h-full">
            <div className="flex gap-16">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mb-1">ELO (1v1)</span>
                   <span className="text-xl font-semibold text-zinc-200">{user.elo_1v1 || 1000}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-[10px] text-zinc-500 font-bold tracking-wider uppercase mb-1">ELO (1v7)</span>
                   <span className="text-xl font-semibold text-zinc-200">{user.elo_1v7 || 1000}</span>
                 </div>
            </div>
            <div className="text-xs text-zinc-500 mt-4 border-t border-zinc-800/60 pt-4">
              Twoje punkty rankingowe aktualizują się po każdym zakończonym starciu na Arenie.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
