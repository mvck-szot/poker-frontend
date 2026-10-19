// src/pages/Landing.tsx
export function Landing() {
  return (
    <div className="flex-1 flex items-center justify-center bg-[#121212] p-8 h-full overflow-y-auto">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center my-auto">

        {/* Lewa kolumna: Miejsce na grafikę stołu lub animację */}
        <div className="aspect-square bg-zinc-900/50 border border-zinc-800 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden backdrop-blur-sm">
          {/* Przykładowy placeholder - później wrzucimy tu np. render 3D żetonów lub widok stołu */}
          <div className="text-zinc-500 flex flex-col items-center p-8 text-center">
            <div className="text-7xl mb-6 tracking-widest text-zinc-700">
              ♠️ ♥️ ♣️ ♦️
            </div>
            <h3 className="text-2xl font-bold text-zinc-400 mb-2">GTO Duel Engine</h3>
            <p className="text-sm">Miejsce na wizualizację stołu pokerowego</p>
          </div>
        </div>

        {/* Prawa kolumna: Główne hasło i akcja */}
        <div className="flex flex-col items-start text-left">
          <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
            Graj w Pokera <br />
            <span className="text-emerald-500">Zgodnie z Matmą.</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 max-w-lg leading-relaxed">
            Dołącz do platformy treningowej opartej na solverach CFR.
            Graj z silnikiem, analizuj decyzje i buduj solidną strategię od zera.
          </p>
          <button className="px-12 py-5 bg-emerald-500 hover:bg-emerald-400 text-white text-2xl font-black rounded-2xl shadow-lg hover:scale-105 transition-all duration-200">
            Zagraj Teraz
          </button>
        </div>

      </div>
    </div>
  );
}
