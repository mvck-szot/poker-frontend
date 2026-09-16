import { useState } from 'react';
import { User, Box, Palette, Keyboard, Globe, FlaskConical, ChevronDown, Save, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface AccountProps {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  elo1v1: number;
  friends: any[];
  // Te dwa są przekazywane z App.tsx, więc musimy je tu zadeklarować, nawet jeśli tymczasowo z nich nie korzystamy
  handHistory?: any[];
  setActiveTab?: (tab: any) => void;
}

export function Account({ currentUser, setCurrentUser, elo1v1, friends }: AccountProps) {
  // Nawigacja ustawień
  const [activeMenu, setActiveMenu] = useState<'account' | 'subscriptions' | 'analyzer' | 'appearance' | 'hotkeys' | 'languages' | 'insider'>('account');

  // Stan dla formularza edycji profilu
  const [editName, setEditName] = useState(currentUser?.display_name || '');
  const [editCountry, setEditCountry] = useState(currentUser?.country || '🇵🇱');
  const [editStatus, setEditStatus] = useState(currentUser?.status || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Wczytanie znajomych (żeby aplikacja nie wyrzucała białego ekranu)
  const acceptedFriends = friends?.filter(f => f.status === 'accepted') || [];

  // Funkcja rang (żeby działała flara z ELO pod nickiem)
  const getRank = (elo: number) => {
    if (elo >= 2000) return { name: 'Grandmaster', icon: '👑', color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/50' };
    if (elo >= 1800) return { name: 'Diament', icon: '🔮', color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/20', border: 'border-fuchsia-400/50' };
    if (elo >= 1600) return { name: 'Platyna', icon: '💎', color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/50' };
    if (elo >= 1400) return { name: 'Złoto', icon: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' };
    if (elo >= 1200) return { name: 'Srebro', icon: '🥈', color: 'text-slate-300', bg: 'bg-slate-300/20', border: 'border-slate-300/50' };
    return { name: 'Brąz', icon: '🥉', color: 'text-amber-600', bg: 'bg-amber-900/40', border: 'border-amber-700/50' };
  };

  if (!currentUser) return <div className="flex justify-center h-full text-zinc-500"><p>Zaloguj się, aby wyświetlić profil.</p></div>;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMsg('');
    try {
      const res = await fetch('https://poker-api-fsle.onrender.com/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, display_name: editName, country: editCountry, status: editStatus })
      });
      const data = await res.json();
      if (data.success) {
        const updatedUser = { ...currentUser, display_name: editName, country: editCountry, status: editStatus };
        setCurrentUser(updatedUser);
        localStorage.setItem('poker_user', JSON.stringify(updatedUser));
        setSaveMsg('Zapisano pomyślnie!');
        setTimeout(() => setSaveMsg(''), 3000);
      }
    } catch (error) {
      console.error(error);
      setSaveMsg('Wystąpił błąd podczas zapisu.');
    }
    setIsSaving(false);
  };

  const menuItems = [
    { id: 'account', icon: <User className="w-5 h-5" />, label: 'ACCOUNT' },
    { id: 'subscriptions', icon: <Box className="w-5 h-5" />, label: 'SUBSCRIPTIONS' },
    { id: 'analyzer', icon: <Settings className="w-5 h-5" />, label: 'ANALYZER' },
    { id: 'appearance', icon: <Palette className="w-5 h-5" />, label: 'APPEARANCE' },
    { id: 'hotkeys', icon: <Keyboard className="w-5 h-5" />, label: 'HOTKEYS' },
    { id: 'languages', icon: <Globe className="w-5 h-5" />, label: 'LANGUAGES' },
    { id: 'insider', icon: <FlaskConical className="w-5 h-5" />, label: 'INSIDER' },
  ];

  const myRank = getRank(elo1v1);

  return (
    <div className="flex flex-col md:flex-row gap-12 w-full max-w-6xl mx-auto text-slate-200 min-h-full">

      {/* LEWE MENU (SIDEBAR USTAWIEŃ) */}
      <div className="w-full md:w-56 flex flex-col gap-2 shrink-0 border-b md:border-b-0 md:border-r border-zinc-800 pb-6 md:pb-0 md:pr-6 overflow-x-auto md:overflow-visible">
        <div className="flex md:flex-col gap-2 min-w-max md:min-w-0">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id as any)}
              className={`flex flex-row md:flex-col items-center md:justify-center gap-3 md:gap-2 px-4 py-3 md:py-4 rounded-xl transition-all ${
                activeMenu === item.id
                  ? 'text-emerald-400 bg-emerald-950/20'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
              }`}
            >
              <div className={activeMenu === item.id ? 'text-emerald-500' : 'text-zinc-600'}>
                {item.icon}
              </div>
              <span className="text-[10px] font-black tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* PRAWA STRONA (ZAWARTOŚĆ USTAWIEŃ) */}
      <div className="flex-1 flex flex-col max-w-3xl">

        {activeMenu === 'account' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-10">

            {/* Nagłówek Konta */}
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black text-white tracking-tight">Account</h1>
              <p className="text-zinc-400 text-sm">
                Need help? Contact us <a href="#" className="text-emerald-500 hover:underline">here</a> or via <a href="mailto:support@pokerhub.com" className="text-emerald-500 hover:underline">support@pokerhub.com</a>
              </p>
            </div>

            {/* SEKCJA Z AVATAREM I STATUSEM */}
            <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-zinc-900/50 p-6 rounded-xl border border-zinc-800">
               <div className="w-24 h-24 bg-zinc-800 rounded-xl flex items-center justify-center shadow-inner border border-zinc-700/50 shrink-0">
                  <span className="text-4xl opacity-50">♠️</span>
               </div>
               <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black text-white">{currentUser.username}</h2>
                    <span className="text-xl" title="Kraj gracza">{currentUser.country || '🇵🇱'}</span>
                    <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded border ${myRank.bg} ${myRank.color} ${myRank.border} shadow-sm`}>
                      {myRank.icon} {myRank.name}
                    </span>
                  </div>
                  <p className="text-zinc-300 font-bold mt-1">{currentUser.display_name || ''}</p>
                  {currentUser.status && <p className="text-zinc-400 text-sm mt-1">{currentUser.status}</p>}

                  <div className="flex items-center gap-x-4 mt-3 text-xs font-bold text-zinc-500">
                    <span>Znajomi: {acceptedFriends.length}</span>
                    <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                    <span className="text-emerald-500 flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Online
                    </span>
                  </div>
               </div>
            </div>

            {/* Sekcja Profilu Publicznego Formularz */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16 border-b border-zinc-800 pb-8">
              <span className="w-32 text-zinc-300 font-bold text-sm shrink-0 mt-2">Public Profile</span>
              <form onSubmit={handleSaveProfile} className="flex-1 flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Display Name</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="bg-[#121212] border border-zinc-700 rounded px-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Country</label>
                    <select value={editCountry} onChange={e => setEditCountry(e.target.value)} className="bg-[#121212] border border-zinc-700 rounded px-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors">
                      <option value="🇵🇱">🇵🇱 Poland</option>
                      <option value="🇬🇧">🇬🇧 United Kingdom</option>
                      <option value="🇺🇸">🇺🇸 United States</option>
                      <option value="🇩🇪">🇩🇪 Germany</option>
                      <option value="🌎">🌎 Rest of World</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Status / Bio</label>
                  <input type="text" value={editStatus} onChange={e => setEditStatus(e.target.value)} className="bg-[#121212] border border-zinc-700 rounded px-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors" />
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <button type="submit" disabled={isSaving} className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold px-6 py-2 rounded transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Profile'}
                  </button>
                  {saveMsg && <span className="text-sm font-bold text-emerald-500">{saveMsg}</span>}
                </div>
              </form>
            </div>

            {/* Email */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16 border-b border-zinc-800 pb-8">
              <span className="w-32 text-zinc-300 font-bold text-sm shrink-0">Email</span>
              <span className="text-zinc-400 font-mono text-sm">{currentUser.username}@pokerhub.com</span>
            </div>

            {/* Limity Analizatora */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16 border-b border-zinc-800 pb-8">
              <span className="w-32 text-zinc-300 font-bold text-sm shrink-0">Analyze</span>
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-lg tracking-wide">Others</span>
                  <span className="text-white font-bold text-sm tracking-widest">0 / 10</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-zinc-600 h-1.5 rounded-full w-0"></div>
                </div>
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  Hands quota reset on 9/20/2026 <span className="w-4 h-4 rounded-full border border-zinc-500 text-[10px] flex items-center justify-center cursor-help" title="Limit darmowych analiz">i</span>
                </span>
                <button className="bg-[#1e1e1e] hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold py-2.5 px-4 rounded transition-colors w-fit text-sm">
                  Get more hands
                </button>
              </div>
            </div>

            {/* Discord */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-16 border-b border-zinc-800 pb-8">
              <span className="w-32 text-zinc-300 font-bold text-sm shrink-0">Discord tag</span>
              <span className="text-zinc-300 flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                Only for <span className="font-bold underline decoration-zinc-700 underline-offset-4">subscribed users</span> ↗
              </span>
            </div>

            {/* Instalacja */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-16">
              <span className="w-32 text-zinc-300 font-bold text-sm shrink-0">Install</span>
              <div className="flex-1 flex flex-col gap-4 w-full">
                <div className="flex items-center justify-between p-4 bg-[#121212] rounded border border-zinc-800 cursor-pointer hover:border-zinc-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <LightbulbIcon className="w-5 h-5 text-emerald-500" />
                    <span className="text-zinc-300 text-sm">How to install as an app on your phone.</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-zinc-600" />
                </div>
                <div className="flex items-center justify-between p-4 bg-[#121212] rounded border border-zinc-800 cursor-pointer hover:border-zinc-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <LightbulbIcon className="w-5 h-5 text-emerald-500" />
                    <span className="text-zinc-300 text-sm">How to install as an app on your desktop.</span>
                  </div>
                  <ChevronDown className="w-5 h-5 text-zinc-600" />
                </div>
              </div>
            </div>

          </motion.div>
        )}

        {/* Placeholdery dla pozostałych zakładek z menu */}
        {activeMenu !== 'account' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <span className="text-6xl opacity-20">⚙️</span>
            <h2 className="text-2xl font-black text-white tracking-wide uppercase">{activeMenu}</h2>
            <p className="text-zinc-500 max-w-sm">
              Panel konfiguracji dla modułu <span className="font-bold text-zinc-400 uppercase">{activeMenu}</span> pojawi się w kolejnej aktualizacji aplikacji.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Lokalny komponent ikony żarówki
function LightbulbIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5"/>
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
    </svg>
  );
}
