import { useState } from 'react';
import { Swords, GraduationCap, BarChart2, Target, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Landing({ onLoginClick }: { onLoginClick: () => void }) {
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [isDemoActive, setIsDemoActive] = useState(false);
  const [demoFeedback, setDemoFeedback] = useState<'success' | 'error' | null>(null);

  const demoScenarios = [
    { hand: ['Ah', 'Ad'], board: [], desc: 'Preflop. Jesteś na UTG. Akcja folduje do Ciebie. Co robisz?', correctIdx: 2 },
    { hand: ['Kh', 'Ks'], board: ['2c', '7d', '8h'], desc: 'Flop. Jesteś na IP. Przeciwnik czeka. Masz mocną overparę.', correctIdx: 2 },
    { hand: ['7h', '8h'], board: ['9h', 'Th', '2c'], desc: 'Flop. Masz potężnego drawa (Straight Flush Draw). Przeciwnik betuje.', correctIdx: 3 },
    { hand: ['2s', '2d'], board: ['Ah', 'Kh', 'Qh'], desc: 'Flop. 3 karty w jednym kolorze, Ty masz niską parę bez koloru.', correctIdx: 0 },
    { hand: ['Js', 'Jc'], board: ['2h', '2d', '5s', '9c', 'Ts'], desc: 'River. Pula to 100bb, przeciwnik gra all-in za 150bb. Posiadasz overparę, ale board jest niebezpieczny.', correctIdx: 1 },
  ];

  const currentTask = demoScenarios[Math.min(tasksCompleted, 4)];
  const isLocked = tasksCompleted >= 5;

  const handleDemoAction = (idx: number) => {
    if (isLocked) return;
    const isCorrect = idx === currentTask.correctIdx;
    setDemoFeedback(isCorrect ? 'success' : 'error');
    setTimeout(() => {
      setDemoFeedback(null);
      setTasksCompleted(prev => prev + 1);
    }, 1500);
  };

  const floatingAnim = (delay: number) => ({
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#121212] scroll-smooth">

      {/* =========================================
          SEKCJA 1: EKRAN GŁÓWNY ZE STOŁEM
          ========================================= */}
      <div className="min-h-screen flex items-center justify-center p-8 border-b border-zinc-800/50">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Lewa: Stół Pokerowy (Klasyczny Placeholder) */}
          <div className="aspect-square bg-zinc-900/50 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
            <div className="text-zinc-500 flex flex-col items-center p-8 text-center">
              <div className="text-7xl mb-6 tracking-widest text-zinc-700">♠️ ♥️ ♣️ ♦️</div>
              <h3 className="text-2xl font-bold text-zinc-400 mb-2">GTO Duel Engine</h3>
              <p className="text-sm">Miejsce na wizualizację stołu pokerowego</p>
            </div>
          </div>

          {/* Prawa: Tekst Hero */}
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
              onClick={() => document.getElementById('zadania-sekcja')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-white text-xl font-black rounded-xl shadow-lg shadow-emerald-900/20 hover:scale-105 transition-all duration-200"
            >
              Rozwiąż Darmowe Zadania
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          SEKCJA 2: ZADANIA I LEWITUJĄCE IKONY
          ========================================= */}
      <div id="zadania-sekcja" className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Lewa strona: Tekst + Lewitująca Grafika */}
          <div className="flex flex-col text-left relative h-full justify-center">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Popraw swoją grę <br /> z interaktywnym treningiem
            </h2>
            <p className="text-lg text-zinc-400 mb-8 max-w-md">
              Przetestuj swoje umiejętności w 5 darmowych scenariuszach GTO. Odkryj, jak potężna może być optymalizacja matematyczna.
            </p>

            {!isDemoActive && (
              <button
                onClick={() => setIsDemoActive(true)}
                className="w-fit flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-8 py-4 rounded-xl border border-zinc-700 transition-all text-lg mb-12 z-10 relative"
              >
                <Target className="w-6 h-6 text-emerald-500" /> Rozpocznij Trening (Demo)
              </button>
            )}

            {/* Kompozycja Lewitująca (przesunięta pod tekst) */}
            <div className="relative h-64 w-full mt-auto hidden lg:block opacity-80 pointer-events-none">
              <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] rounded-full"></div>

              <motion.div animate={floatingAnim(0)} className="absolute top-4 left-[5%] w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center shadow-lg border-4 border-teal-400/50 z-20">
                <GraduationCap className="w-10 h-10 text-white" />
              </motion.div>

              <motion.div animate={floatingAnim(1.5)} className="absolute top-1/2 left-1/3 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] border-4 border-emerald-300/50 rotate-45 z-10">
                <div className="-rotate-45 text-emerald-950 flex flex-col items-center">
                  <span className="text-6xl drop-shadow-md">♠</span>
                </div>
              </motion.div>

              <motion.div animate={floatingAnim(0.8)} className="absolute bottom-4 right-[25%] w-24 h-24 bg-emerald-800/90 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl border-2 border-emerald-600/50 rotate-45 z-20">
                <div className="-rotate-45 text-emerald-200"><BarChart2 className="w-10 h-10" /></div>
              </motion.div>
            </div>
          </div>

          {/* Prawa strona: Interaktywny Moduł Demo */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden min-h-[450px] flex flex-col z-20">

            {!isDemoActive ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
                <Target className="w-20 h-20 text-zinc-700 mb-4" />
                <p className="font-bold text-zinc-500">Kliknij przycisk obok, aby załadować pierwsze zadanie.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                    Zadanie {Math.min(tasksCompleted + 1, 5)} z 5
                  </span>
                  <div className="flex gap-2">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className={`w-3 h-3 rounded-full ${i < tasksCompleted ? 'bg-emerald-500' : 'bg-zinc-700'}`}></div>
                    ))}
                  </div>
                </div>

                <div className={`flex-1 flex flex-col gap-6 transition-opacity ${isLocked ? 'opacity-20 blur-sm pointer-events-none' : ''}`}>
                  <p className="text-white font-bold text-lg">{currentTask.desc}</p>

                  <div className="flex items-center gap-6 bg-[#121212] p-4 rounded-xl border border-zinc-800">
                    <div className="flex gap-2">
                      {currentTask.hand.map((c, i) => (
                        <div key={i} className={`w-12 h-16 bg-white rounded shadow flex items-center justify-center font-black text-xl border-2 border-zinc-300 ${c.includes('h') || c.includes('d') ? 'text-rose-600' : 'text-zinc-900'}`}>{c}</div>
                      ))}
                    </div>
                    {currentTask.board.length > 0 && <span className="text-zinc-600 font-black text-2xl">/</span>}
                    <div className="flex gap-2">
                      {currentTask.board.map((c, i) => (
                        <div key={i} className={`w-12 h-16 bg-white rounded shadow flex items-center justify-center font-black text-xl border-2 border-zinc-300 ${c.includes('h') || c.includes('d') ? 'text-rose-600' : 'text-zinc-900'}`}>{c}</div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    {['FOLD', 'CHECK / CALL', 'BET / RAISE 33%', 'ALL-IN'].map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDemoAction(idx)}
                        disabled={demoFeedback !== null}
                        className="bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-bold text-white transition-colors border border-zinc-700 disabled:opacity-50"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>

                <AnimatePresence>
                  {demoFeedback && !isLocked && (
                    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}} className={`absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/90 backdrop-blur-sm z-10`}>
                      {demoFeedback === 'success' ? <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-4" /> : <XCircle className="w-20 h-20 text-rose-500 mb-4" />}
                      <h3 className={`text-2xl font-black ${demoFeedback === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {demoFeedback === 'success' ? 'Poprawna Decyzja!' : 'Błąd GTO!'}
                      </h3>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {isLocked && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-md p-8 text-center border-2 border-emerald-500/30 rounded-2xl">
                      <Lock className="w-16 h-16 text-emerald-500 mb-4" />
                      <h3 className="text-2xl font-black text-white mb-2">Wykorzystałeś darmowe próby!</h3>
                      <p className="text-zinc-400 mb-6">Załóż darmowe konto, aby uzyskać nielimitowany dostęp do silnika, rywalizacji na arenie i preflop charts.</p>
                      <button onClick={onLoginClick} className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-xl shadow-lg w-full">
                        Zarejestruj się za darmo
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

          </div>
        </div>
      </div>

    </div>
  );
}
