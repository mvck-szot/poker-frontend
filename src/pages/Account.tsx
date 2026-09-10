import { useState } from 'react';
import { Settings, History } from 'lucide-react';

interface AccountProps {
  currentUser: any;
  friends: any[];
  handHistory: any[];
  setActiveTab: (tab: any) => void;
}

export function Account({ currentUser, friends, handHistory, setActiveTab }: AccountProps) {
  // LOKALNY STAN ZAKŁADEK W PROFILU
  const [subTab, setSubTab] = useState<'overview' | 'stats' | 'friends' | 'clubs'>('overview');

  const acceptedFriends = friends.filter(f => f.status === 'accepted');

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-4">
        <p>Musisz być zalogowany, aby wyświetlić profil.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Nagłówek profilu */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col md:flex-row gap-6 md:items-center relative">
        <div className="absolute top-6 right-6">
          <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded font-bold text-xs transition-colors">
            <Settings className="w-4 h-4" /> Edytuj Profil
          </button>
        </div>

        {/* Awatar */}
        <div className="w-32 h-32 bg-zinc-800 rounded-xl flex items-center justify-center shadow-inner border border-zinc-700/50 shrink-0">
          <span className="text-6xl opacity-50">♠️</span>
        </div>

        {/* Dane użytkownika */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white">{currentUser.username}</h1>
            <span className="text-2xl" title="Polska">🇵🇱</span>
            <span className="bg-zinc-800 text-zinc-400 text-[10px] uppercase font-bold px-2 py-1 rounded">Add flair</span>
          </div>
          <p className="text-zinc-400 mt-1">Maciej Szot</p>
          <p className="text-zinc-600 text-sm mt-2 italic">Kliknij, aby ustawić status...</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs font-bold text-zinc-500">
            <span>Dołączono: W tym miesiącu</span>
            <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
            <span>Znajomi: {acceptedFriends.length}</span>
            <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
            <span>Wyświetlenia: 0</span>
            <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
            <span className="text-emerald-500 flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Online
            </span>
          </div>
        </div>
      </div>

      {/* WEWNĘTRZNE MENU NAWIGACYJNE */}
      <div className="flex gap-6 border-b border-zinc-800 px-2">
        <button
          onClick={() => setSubTab('overview')}
          className={`pb-3 font-bold text-sm transition-colors ${subTab === 'overview' ? 'text-white border-b-2 border-emerald-500' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Przegląd
        </button>
        <button
          onClick={() => setSubTab('stats')}
          className={`pb-3 font-bold text-sm transition-colors ${subTab === 'stats' ? 'text-white border-b-2 border-emerald-500' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Statystyki
        </button>
        <button
          onClick={() => setSubTab('friends')}
          className={`pb-3 font-bold text-sm transition-colors ${subTab === 'friends' ? 'text-white border-b-2 border-emerald-500' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Znajomi
        </button>
        <button
          onClick={() => setSubTab('clubs')}
          className={`pb-3 font-bold text-sm transition-colors ${subTab === 'clubs' ? 'text-white border-b-2 border-emerald-500' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          Kluby
        </button>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* ZAWARTOŚĆ ZAKŁADEK (RENDEROWANA WARUNKOWO ZALEŻNIE OD WYBORU) */}
      {/* ---------------------------------------------------------------- */}

      {/* 1. ZAKŁADKA: PRZEGLĄD (DOMYŚLNA) */}
      {subTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <div className="bg-zinc-800/50 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold text-sm text-zinc-300">Gry na żywo (0)</h3>
              </div>
              <div className="p-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-zinc-400 text-sm">
                <span>Nie masz obecnie aktywnych pojedynków GTO Duel.</span>
                {/* Ten przycisk dla odmiany przerzuca do głównej zakładki "Znajomi", żeby wyzwać kogoś do gry */}
                <button onClick={() => setActiveTab('friends')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded shadow-lg transition-colors">
                  Graj
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <div className="bg-zinc-800/50 px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                <h3 className="font-bold text-sm text-zinc-300">Historia Rozdań ({handHistory.length})</h3>
              </div>
              {handHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
                  <History className="w-12 h-12 opacity-50" />
                  <div className="text-center">
                    <p className="font-bold text-zinc-400">Brak historii rozdań</p>
                    <p className="text-sm">Ukończone rozdania pojawią się tutaj</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-2">
                  {handHistory.slice(0, 3).map((hand, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-[#121212] rounded border border-zinc-800">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono bg-zinc-800 px-2 py-1 rounded text-zinc-400">{hand.street}</span>
                        <span className="font-bold text-white text-sm">{hand.action}</span>
                      </div>
                      <span className={`text-xs font-bold ${hand.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {hand.isCorrect ? '+ EV' : '- EV'}
                      </span>
                    </div>
                  ))}
                  <button onClick={() => setSubTab('stats')} className="mt-2 text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest text-center py-2">
                    Pokaż mini-statystyki
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-1 flex flex-col gap-6">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
              <h3 className="font-bold text-sm text-zinc-300 mb-3">Wygląd stołu</h3>
              <div className="h-20 bg-emerald-800 rounded flex items-center justify-center border-2 border-zinc-700 shadow-inner relative overflow-hidden">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                 <span className="text-3xl font-black text-emerald-950/40 tracking-widest relative z-10">GTO</span>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <div className="bg-zinc-800/50 px-4 py-3 border-b border-zinc-800">
                <h3 className="font-bold text-sm text-zinc-300">Szybcy Znajomi</h3>
              </div>
              <div className="p-4">
                {acceptedFriends.length === 0 ? (
                  <p className="text-sm text-zinc-500">Brak znajomych.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {acceptedFriends.slice(0, 5).map(f => (
                      <div key={f.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 rounded flex items-center justify-center text-xs">👤</div>
                        <span className="font-bold text-white text-sm">{f.username}</span>
                        <div className="ml-auto w-2 h-2 bg-zinc-600 rounded-full"></div>
                      </div>
                    ))}
                    <button onClick={() => setSubTab('friends')} className="mt-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest text-left">
                      Pokaż wszystkich
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ZAKŁADKA: STATYSTYKI (MINI-WIDOK W PROFILU) */}
      {subTab === 'stats' && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-white">Mini Statystyki Konta</h3>
            <button onClick={() => setActiveTab('stats')} className="bg-emerald-600/20 text-emerald-500 border border-emerald-500/50 px-4 py-1.5 rounded text-xs font-bold hover:bg-emerald-600 hover:text-white transition-colors">
              Pełny Panel GTO
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#121212] p-6 rounded border border-zinc-800 flex flex-col items-center justify-center gap-2">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Rozegrane Rozdania</span>
              <span className="text-4xl font-black text-white">{handHistory.length}</span>
            </div>

            <div className="md:col-span-2 bg-[#121212] p-6 rounded border border-zinc-800 border-dashed flex items-center justify-center">
              <span className="text-zinc-500 italic">Czekam na Twoje wytyczne odnośnie wyglądu statystyk! Możemy tu wrzucić wykresy, winrate, cokolwiek zechcesz.</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. ZAKŁADKA: ZNAJOMI (LOKALNA LISTA) */}
      {subTab === 'friends' && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6 flex flex-col gap-4">
          <h3 className="font-bold text-lg text-white">Twoja lista znajomych</h3>
          {acceptedFriends.length === 0 ? (
            <p className="text-zinc-500">Brak znajomych. Użyj głównej zakładki "Znajomi" (po lewej stronie), aby kogoś dodać.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {acceptedFriends.map(f => (
                <div key={f.id} className="flex justify-between items-center bg-[#121212] p-4 rounded border border-zinc-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-sm">👤</div>
                    <span className="font-bold text-white">{f.username}</span>
                  </div>
                  <span className="text-xs font-mono bg-zinc-800 px-3 py-1 rounded-full text-zinc-400">ELO: {f.elo_1v1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. ZAKŁADKA: KLUBY */}
      {subTab === 'clubs' && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 flex flex-col items-center justify-center gap-4">
          <span className="text-4xl">🛡️</span>
          <h3 className="font-bold text-lg text-white">Kluby Pokerowe</h3>
          <p className="text-zinc-500 text-center max-w-md">Moduł klubów (grupy szkoleniowe, tabele wyników dla zamkniętych społeczności) pojawi się w przyszłych aktualizacjach.</p>
        </div>
      )}
    </div>
  );
}
