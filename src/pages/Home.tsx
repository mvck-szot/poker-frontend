import { motion } from 'framer-motion';
import { Swords, Users, Grid, Dices, ChevronRight } from 'lucide-react';

interface DashboardProps {
  currentUser: any;
}

export function Dashboard({ currentUser }: DashboardProps) {
  // Przykładowe kafelki trybów gry / nauki
  const modules = [
    {
      id: 'duel',
      title: 'GTO Duel (1v1)',
      description: 'Zaufaj matematyce. Zmierz się z oponentem w formacie Heads-Up opartym na CFR.',
      icon: <Swords className="w-6 h-6 text-emerald-400" />,
      bg: 'bg-emerald-950/20',
      border: 'border-emerald-500/30',
      hover: 'hover:border-emerald-500',
    },
    {
      id: 'arena',
      title: 'Arena (1v7)',
      description: 'Wieloosobowy stół treningowy. Sprawdź swoje decyzje w pulach multi-way.',
      icon: <Users className="w-6 h-6 text-blue-400" />,
      bg: 'bg-blue-950/20',
      border: 'border-blue-500/30',
      hover: 'hover:border-blue-500',
    },
    {
      id: 'preflop',
      title: 'Preflop Charts',
      description: 'Przeglądaj optymalne zasięgi otwarć, 3-betów i obrony dla każdej pozycji.',
      icon: <Grid className="w-6 h-6 text-purple-400" />,
      bg: 'bg-purple-950/20',
      border: 'border-purple-500/30',
      hover: 'hover:border-purple-500',
    },
    {
      id: 'custom',
      title: 'Custom Board',
      description: 'Zbuduj własne rozdanie od zera i pozwól silnikowi przeanalizować spot.',
      icon: <Dices className="w-6 h-6 text-amber-400" />,
      bg: 'bg-amber-950/20',
      border: 'border-amber-500/30',
      hover: 'hover:border-amber-500',
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto text-slate-200 min-h-full p-4 md:p-8">

      {/* Nagłówek powitalny */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 border-b border-zinc-800 pb-8"
      >
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
          Welcome back, {currentUser?.display_name || currentUser?.username || 'Player'}.
        </h1>
        <p className="text-zinc-400">
          Wybierz tryb treningu i poprawiaj swoją strategię każdego dnia.
        </p>
      </motion.div>

      {/* Siatka głównych modułów (Kafelki) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod, index) => (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`group flex flex-col justify-between p-6 rounded-2xl bg-[#121212] border ${mod.border} ${mod.hover} transition-all cursor-pointer shadow-lg shadow-black/50`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${mod.bg}`}>
                {mod.icon}
              </div>
              <div className="w-8 h-8 rounded-full bg-zinc-900/50 flex items-center justify-center border border-zinc-800 group-hover:bg-zinc-800 transition-colors">
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-2">{mod.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {mod.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Szybkie podsumowanie pod kafelkami (opcjonalnie) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-[#121212] border border-zinc-800 flex items-center justify-between"
      >
        <div>
          <h4 className="text-zinc-300 font-bold mb-1">Twój obecny ranking (ELO)</h4>
          <div className="text-3xl font-black text-emerald-400">1450 <span className="text-sm font-normal text-zinc-500 uppercase tracking-widest ml-1">Silver</span></div>
        </div>
        <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors border border-zinc-700">
          Zobacz statystyki
        </button>
      </motion.div>

    </div>
  );
}
