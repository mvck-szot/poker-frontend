import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XSquare, User, Lock, Eye, EyeOff, Loader2, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

export function AuthModal({ initialMode, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`https://poker-api-fsle.onrender.com/api/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        onSuccess({
          id: data.id,
          username: data.username,
          elo_train: data.elo_train,
          elo_1v1: data.elo_1v1,
          elo_1v7: data.elo_1v7
        });
      } else {
        setError(data.message || 'Wystąpił błąd autoryzacji.');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl w-full max-w-md flex flex-col gap-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        {/* Górna poświata */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-teal-400"></div>

        {/* Nagłówek i przycisk zamknięcia */}
        <div className="flex justify-between items-center z-10">
          <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            GTO<span className="text-emerald-500">Duel</span>
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors bg-zinc-800 p-2 rounded-lg">
            <XSquare className="w-5 h-5"/>
          </button>
        </div>

        {/* Zakładki (Logowanie / Rejestracja) */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 z-10 relative">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 relative z-10 ${mode === 'login' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <LogIn className="w-4 h-4" /> Logowanie
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 relative z-10 ${mode === 'register' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <UserPlus className="w-4 h-4" /> Rejestracja
          </button>

          {/* Animowane tło zakładki */}
          <motion.div
            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-zinc-800 rounded-lg shadow-sm border border-zinc-700 z-0"
            animate={{ left: mode === 'login' ? '4px' : 'calc(50% + 2px)' }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        </div>

        {/* Formularz */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 z-10">

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nazwa Użytkownika</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Wpisz swój nick"
                className="w-full bg-[#121212] border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-white outline-none focus:border-emerald-500 transition-colors focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Hasło</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Wpisz hasło"
                className="w-full bg-[#121212] border border-zinc-700 rounded-xl pl-10 pr-10 py-3 text-white outline-none focus:border-emerald-500 transition-colors focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 text-xs font-bold p-3 rounded-lg flex items-center justify-center text-center">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl mt-2 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Przetwarzanie...</>
            ) : (
              mode === 'login' ? 'Zaloguj się do gry' : 'Utwórz konto'
            )}
          </button>
        </form>

      </motion.div>
    </div>
  );
}
