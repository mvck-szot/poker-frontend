import { Sparkles, Swords } from 'lucide-react';

export const Home = ({ setActiveTab }: any) => {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-10 mt-10">
      <div className="w-full bg-gradient-to-br from-[#0d1f14] to-[#0a0c0b] border border-slate-800 rounded-sm p-14 shadow-2xl">
        <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles className="w-4 h-4"/> Najlepszy symulator na rynku
        </div>
        <h1 className="text-5xl font-black text-white leading-tight">
          The Home of <span className="text-emerald-500">Texas Hold'em</span> GTO
        </h1>
        <p className="text-slate-400 mt-4 max-w-xl text-lg">
          Trenuj z najszybszym silnikiem matematycznym CFR. Popraw swoją strategię, walcz z botami i rywalizuj o ranking ELO w trybie Battle Royale.
        </p>
        <button
          onClick={() => setActiveTab('arena')}
          className="mt-8 bg-rose-600 hover:bg-rose-500 text-white px-8 py-4 rounded-sm font-bold flex items-center gap-3 transition-transform active:scale-95 shadow-[0_0_20px_rgba(225,29,72,0.3)]"
        >
          <Swords className="w-5 h-5"/> Wejdź na Arenę
        </button>
      </div>
    </div>
  );
};
