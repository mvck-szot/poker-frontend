import { Swords, GraduationCap, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingProps {
  onLoginClick: () => void;
  onStartTraining: () => void;
}

export function Landing({ onLoginClick, onStartTraining }: LandingProps) {

  const floatingAnim = (delay: number) => ({
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#121212] scroll-smooth">

      {/* SEKCJA 1: EKRAN GŁÓWNY ZE STOŁEM */}
      <div className="min-h-screen flex items-center justify-center p-8 border-b border-zinc-800/50">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          <div className="aspect-square bg-zinc-900/50 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
            <div className="text-zinc-500 flex flex-col items-center p-8 text-center">
              <div className="text-7xl mb-6 tracking-widest text-zinc-700">♠️ ♥️ ♣️ ♦️</div>
              <h3 className="text-2xl font-bold text-zinc-400 mb-2">GTO Duel Engine</h3>
              <p className="text-sm">Miejsce na wizualizację stołu pokerowego</p>
            </div>
          </div>

          <div className="flex flex-col items-start text-left z-10">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-900/30 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
              <Swords className="w-4 h-4" /> PokerHub 2026
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
              Graj w Pokera <br />
              <span className="text-emerald-500">Zgodnie z Matmą.</span>
            </h1>
            <p className="text-xl text-zinc-400 mb-10 max-w-lg leading-relaxed">
              Dołącz do platformy treningowej opartej na algorytmie CFR.
              Graj z silnikiem i podejmuj idealne decyzje.
            </p>
            <button
              onClick={onLoginClick}
              className="px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-white text-xl font-black rounded-xl shadow-lg shadow-emerald-900/20 hover:scale-105 transition-all duration-200"
            >
              Zacznij
            </button>
          </div>
        </div>
      </div>

      {/* SEKCJA 2: BRAMA DO PRAWDZIWEGO TRENINGU */}
      <div id="zadania-sekcja" className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="flex flex-col text-left relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Popraw swoją grę <br /> z interaktywnym treningiem
            </h2>
            <p className="text-lg text-zinc-400 mb-8 max-w-md">
              Przetestuj swoje umiejętności w darmowych scenariuszach GTO. Odkryj, jak potężna może być optymalizacja matematyczna przed założeniem konta.
            </p>

            <button
              onClick={onStartTraining}
              className="w-fit flex items-center gap-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 py-5 rounded-xl shadow-lg shadow-emerald-900/20 transition-all text-xl hover:scale-105"
            >
              <GraduationCap className="w-8 h-8" /> Start a Lesson
            </button>
          </div>

          {/* Animowana aranżacja 72o */}
          <div className="relative aspect-square flex items-center justify-center w-full max-w-md mx-auto">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[100px] rounded-full z-0"></div>

            {/* Lewitująca ikona 1 */}
            <motion.div animate={floatingAnim(0)} className="absolute top-[10%] left-[5%] w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center shadow-lg border-4 border-teal-400/50 z-20">
              <GraduationCap className="w-10 h-10 text-white" />
            </motion.div>

            {/* Centralna Ręka 72o */}
            <motion.div animate={floatingAnim(1.5)} className="relative z-10 flex items-center justify-center">
              {/* Światło pod kartami */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-[50px] w-64 h-64 rounded-full -z-10"></div>

              {/* Karta 7 Pik */}
              <div className="w-32 h-48 bg-white rounded-2xl shadow-2xl border-4 border-zinc-200 flex flex-col justify-between p-3 transform -rotate-[15deg] translate-x-6 z-10 text-zinc-900">
                <span className="text-3xl font-black leading-none">7</span>
                <span className="text-6xl self-center">♠</span>
                <span className="text-3xl font-black leading-none rotate-180">7</span>
              </div>

              {/* Karta 2 Kier */}
              <div className="w-32 h-48 bg-white rounded-2xl shadow-2xl border-4 border-zinc-200 flex flex-col justify-between p-3 transform rotate-[10deg] -translate-x-6 translate-y-8 z-20 text-rose-600">
                <span className="text-3xl font-black leading-none">2</span>
                <span className="text-6xl self-center">♥</span>
                <span className="text-3xl font-black leading-none rotate-180">2</span>
              </div>

              {/* Śmieszny badge GTO dla 72o */}
              <motion.div animate={floatingAnim(2.5)} className="absolute -bottom-2 -right-4 z-30 bg-rose-500 text-white font-black px-4 py-2 rounded-lg shadow-lg border-2 border-rose-400 rotate-12">
                100% FOLD
              </motion.div>
            </motion.div>

            {/* Lewitująca ikona 2 */}
            <motion.div animate={floatingAnim(0.8)} className="absolute bottom-[5%] right-[5%] w-24 h-24 bg-emerald-800/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border-2 border-emerald-600/50 rotate-45 z-20">
              <div className="-rotate-45 text-emerald-200"><BarChart2 className="w-10 h-10" /></div>
            </motion.div>
          </div>

        </div>
      </div>

    </div>
  );
}
