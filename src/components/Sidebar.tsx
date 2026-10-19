// src/components/Sidebar.tsx
import { Play, BookOpen, BarChart2, HelpCircle } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#212121] flex flex-col border-r border-zinc-800 shrink-0">
      {/* Logo */}
      <div className="p-6">
        <h2 className="text-3xl font-black text-emerald-500 tracking-tighter">
          GTO<span className="text-white">Duel</span>
        </h2>
      </div>

      {/* Nawigacja główna - flex-1 spycha dolną sekcję na sam dół */}
      <nav className="flex-1 px-4 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl font-bold transition-colors">
          <Play className="w-6 h-6" /> Graj
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl font-bold transition-colors">
          <BookOpen className="w-6 h-6" /> Trening
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-xl font-bold transition-colors">
          <BarChart2 className="w-6 h-6" /> Statystyki
        </button>
      </nav>

      {/* Dolna sekcja (Logowanie/Rejestracja) */}
      <div className="p-4 space-y-3 mb-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-zinc-400 hover:text-zinc-200 transition-colors font-medium">
          <HelpCircle className="w-5 h-5" /> Pomoc
        </button>
        <button className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg rounded-xl shadow-lg transition-colors">
          Zarejestruj się
        </button>
        <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition-colors border border-zinc-700">
          Zaloguj się
        </button>
      </div>
    </div>
  );
}
