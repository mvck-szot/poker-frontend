import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Target, BarChart2, BookOpen, Wrench, XSquare, Users, Trophy, User, LogIn, UserPlus, LogOut, Loader2 } from 'lucide-react';

import { generateRandomScenario, parseScenario } from './utils/poker';
import { Home } from './pages/Home';
import { Theory } from './pages/Theory';
import { Stats } from './pages/Stats';
import { Arena } from './pages/Arena';
import { Train } from './pages/Train';
import { Account } from './pages/Account';
import { Landing } from './pages/Landing';
import { AuthModal } from './components/AuthModal';
import { PokerCard } from './components/PokerCard';

// --- SYSTEM RANG ---
export const getRank = (elo: number) => {
  if (elo >= 2000) return { name: 'Grandmaster', icon: '👑', color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/50' };
  if (elo >= 1800) return { name: 'Diament', icon: '🔮', color: 'text-fuchsia-400', bg: 'bg-fuchsia-400/20', border: 'border-fuchsia-400/50' };
  if (elo >= 1600) return { name: 'Platyna', icon: '💎', color: 'text-cyan-400', bg: 'bg-cyan-400/20', border: 'border-cyan-400/50' };
  if (elo >= 1400) return { name: 'Złoto', icon: '🥇', color: 'text-yellow-500', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' };
  if (elo >= 1200) return { name: 'Srebro', icon: '🥈', color: 'text-slate-300', bg: 'bg-slate-300/20', border: 'border-slate-300/50' };
  return { name: 'Brąz', icon: '🥉', color: 'text-amber-600', bg: 'bg-amber-900/40', border: 'border-amber-700/50' };
};

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const savedUser = localStorage.getItem('poker_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'train' | 'stats' | 'theory' | 'arena' | 'friends' | 'duel' | 'leaderboard' | 'account'>('home');
  const [trainMode, setTrainMode] = useState<'random' | 'custom'>('random');
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  const [eloTrain, setEloTrain] = useState(1000);
  const [elo1v1, setElo1v1] = useState(1000);
  const [elo1v7, setElo1v7] = useState(1000);
  const [streak, setStreak] = useState(0);
  const [handsPlayed, setHandsPlayed] = useState(0);
  const [eloHistory, setEloHistory] = useState<number[]>([1000]);
  const [handHistory, setHandHistory] = useState<any[]>([]);

  const [friends, setFriends] = useState<any[]>([]);
  const [friendSearch, setFriendSearch] = useState('');
  const [friendMsg, setFriendMsg] = useState('');

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const [duelState, setDuelState] = useState<'idle' | 'lobby' | 'playing' | 'gameover'>('idle');
  const [duelRoomId, setDuelRoomId] = useState('');
  const [duelOpponent, setDuelOpponent] = useState<{id: number, username: string} | null>(null);
  const [duelHeroHp, setDuelHeroHp] = useState(1000);
  const [duelOpponentHp, setDuelOpponentHp] = useState(1000);
  const [duelHand, setDuelHand] = useState<any>(null);
  const [duelFeedback, setDuelFeedback] = useState<any>({msg: '', type: null});
  const [duelWinner, setDuelWinner] = useState<'hero' | 'opponent' | null>(null);
  const duelWsRef = useRef<WebSocket | null>(null);

  const [preflopData, setPreflopData] = useState<any>(null);
  const [selectedPreflop, setSelectedPreflop] = useState<any>(null);
  const [activeTheoryPos, setActiveTheoryPos] = useState('BTN');

  const [trainHand, setTrainHand] = useState<any>(null);
  const [trainStrategy, setTrainStrategy] = useState<any>(null);
  const [trainIsSolving, setTrainIsSolving] = useState(false);
  const [trainFeedback, setTrainFeedback] = useState<any>({msg: '', type: null});
  const [trainActionLogs, setTrainActionLogs] = useState<string[]>([]);
  const [isCopied, setIsCopied] = useState(false);

  const [arenaHand, setArenaHand] = useState<any>(null);
  const [arenaStrategy, setArenaStrategy] = useState<any>(null);
  const [arenaIsSolving, setArenaIsSolving] = useState(false);
  const [arenaFeedback, setArenaFeedback] = useState<any>({msg: '', type: null});
  const [arenaState, setArenaState] = useState<'setup' | 'playing1v1' | 'playing1v7' | 'gameover'>('setup');
  const [arenaWinner, setArenaWinner] = useState<'hero' | 'bot' | null>(null);
  const [arenaPlacement, setArenaPlacement] = useState<number>(1);
  const [arenaEloChange, setArenaEloChange] = useState<number>(0);
  const [arenaRound, setArenaRound] = useState(1);

  const [customHero, setCustomHero] = useState<string[]>([]);
  const [customBoard, setCustomBoard] = useState<string[]>([]);
  const [customPosition, setCustomPosition] = useState('BTN');
  const [customHistory, setCustomHistory] = useState('');

  const [heroHP, setHeroHP] = useState(1000);
  const [botHP, setBotHP] = useState(1000);
  const [botElo, setBotElo] = useState(1000);
  const [botMoveData, setBotMoveData] = useState<{action: string, damage: number} | null>(null);
  const [players8, setPlayers8] = useState<any[]>([]);
  const [aliveCount, setAliveCount] = useState(8);
  const [shake, setShake] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetch('https://poker-api-fsle.onrender.com/api/stats').then(res => res.json()).then(data => {
      setEloTrain(data.elo_train); setElo1v1(data.elo_1v1); setElo1v7(data.elo_1v7);
      setStreak(data.streak); setHandsPlayed(data.hands_played); setEloHistory([data.elo_train]);
    }).catch(e => console.log(e));

    fetch('https://poker-api-fsle.onrender.com/api/preflop').then(res => res.json()).then(data => setPreflopData(data)).catch(e => console.log(e));
  }, []);

  const loadFriends = () => {
    if (!currentUser) return;
    fetch(`https://poker-api-fsle.onrender.com/api/friends/list?user_id=${currentUser.id}`)
      .then(res => res.json())
      .then(data => setFriends(data))
      .catch(e => console.log(e));
  };

  const loadLeaderboard = () => {
    fetch('https://poker-api-fsle.onrender.com/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data))
      .catch(e => console.log(e));
  };

  useEffect(() => {
    if (activeTab === 'friends' || activeTab === 'account') {
      loadFriends();
    }
    if (activeTab === 'leaderboard') loadLeaderboard();
  }, [activeTab, currentUser]);

  const handleSendFriendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !friendSearch) return;
    fetch('https://poker-api-fsle.onrender.com/api/friends/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: currentUser.id, friend_username: friendSearch })
    }).then(res => res.json()).then(data => {
      setFriendMsg(data.message); setFriendSearch(''); loadFriends(); setTimeout(() => setFriendMsg(''), 3000);
    });
  };

  const handleAcceptFriend = (friendId: number) => {
    if (!currentUser) return;
    fetch('https://poker-api-fsle.onrender.com/api/friends/accept', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: currentUser.id, friend_id: friendId })
    }).then(() => loadFriends());
  };

  const handleChallengeFriend = (friendId: number, friendName: string) => {
    if (!currentUser) return;
    const roomId = `room_${Math.min(currentUser.id, friendId)}_${Math.max(currentUser.id, friendId)}`;
    setDuelRoomId(roomId); setDuelOpponent({ id: friendId, username: friendName }); setDuelHeroHp(1000); setDuelOpponentHp(1000); setDuelState('lobby'); setActiveTab('duel');

    if (duelWsRef.current) duelWsRef.current.close();
    const ws = new WebSocket(`wss://poker-api-fsle.onrender.com/ws/duel?room_id=${roomId}&user_id=${currentUser.id}&username=${currentUser.username}`);
    duelWsRef.current = ws;

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'error') {
            alert(data.msg); setDuelState('idle'); setActiveTab('friends');
        } else if (data.type === 'ready') {
            setDuelState('playing'); setDuelFeedback({msg: 'Połączono! Rozpoczynanie meczu...', type: 'info'});
            if (currentUser.id < friendId) {
                setTimeout(() => { const s = generateRandomScenario(); ws.send(JSON.stringify({ type: 'new_round', hand: s.hand, board: s.board, pos: s.pos })); }, 2000);
            }
        } else if (data.type === 'round_start') {
            setDuelHand({ hand: data.hand, board: data.board, pos: data.pos }); setDuelFeedback({msg: 'Twoja kolej! Wybierz akcję GTO.', type: 'info'});
        } else if (data.type === 'round_result') {
            const isP1 = data.p1_id === currentUser.id;
            setDuelHeroHp(isP1 ? data.p1_hp : data.p2_hp); setDuelOpponentHp(isP1 ? data.p2_hp : data.p1_hp);
            const myLoss = isP1 ? data.p1_loss : data.p2_loss; const oppLoss = isP1 ? data.p2_loss : data.p1_loss;
            setDuelFeedback({ msg: `Wynik rundy: Otrzymujesz -${myLoss} HP | ${friendName} otrzymuje -${oppLoss} HP`, type: myLoss <= oppLoss ? 'success' : 'error' });
            if (myLoss > 0) { setShake(true); setTimeout(() => setShake(false), 600); }
            if (data.game_over) {
                setTimeout(() => { setDuelState('gameover'); setDuelWinner(data.winner_id === currentUser.id ? 'hero' : 'opponent'); }, 3000);
            } else {
                if (currentUser.id < friendId) {
                    setTimeout(() => { const s = generateRandomScenario(); ws.send(JSON.stringify({ type: 'new_round', hand: s.hand, board: s.board, pos: s.pos })); }, 4000);
                }
            }
        } else if (data.type === 'opponent_disconnected') {
            alert('Przeciwnik opuścił pokój lub stracił połączenie!'); setDuelState('idle'); setActiveTab('friends');
        }
    };
  };

  const handleDuelAction = (idx: number) => {
    if (duelWsRef.current && duelWsRef.current.readyState === WebSocket.OPEN) {
        duelWsRef.current.send(JSON.stringify({ type: 'action', action_idx: idx }));
        setDuelFeedback({msg: 'Ukryto akcję. Czekam na uderzenie przeciwnika...', type: 'info'});
    }
  };

  const saveStatsToDb = (mode: string, newElo: number, newStreak: number, newHandsPlayed: number) => {
    fetch('https://poker-api-fsle.onrender.com/api/stats', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: currentUser?.id || null, mode, elo: newElo, streak: newStreak, hands_played: newHandsPlayed })
    }).catch(e => console.log(e));
  };

  const resetStats = () => {
    if (window.confirm('Czy na pewno chcesz zresetować statystyki?')) {
      setStreak(0); setEloTrain(1000); setEloHistory([1000]); setHandHistory([]); setHandsPlayed(0); saveStatsToDb('train', 1000, 0, 0);
    }
  };

  const triggerSolver = (scenario: any) => {
    setTrainIsSolving(true); setTrainHand(null); setTrainStrategy(null); setTrainFeedback({msg: '', type: null}); setShowCustomBuilder(false);
    setTrainActionLogs([`[SYSTEM] Obliczanie scenariusza: ${scenario.spotTitle || 'Custom'}...`]);
    fetch(`https://poker-api-fsle.onrender.com/api/solve?hand=${scenario.hand}&board=${scenario.board}&pos=${scenario.pos}&history=${scenario.history || ''}`)
      .then(res => res.json()).then(data => {
        setTrainStrategy([...data.strategy, data.equity]); setTrainHand(scenario); setTrainIsSolving(false);
        setTrainActionLogs(prev => [...prev, `[SILNIK] GTO wyliczone. Twój ruch.`].slice(-8));
      }).catch(() => setTrainIsSolving(false));
  };

  const loadNewRandomHand = () => { triggerSolver(generateRandomScenario()); };

  useEffect(() => {
    if (activeTab === 'train' && trainMode === 'random' && !trainHand && !trainIsSolving) loadNewRandomHand();
  }, [activeTab, trainMode]);

  const handleAction = (idx: number, actionName: string) => {
    if (!trainStrategy || !trainHand) return;
    const gd = parseScenario(trainHand); let strategyOnly = [...trainStrategy.slice(0, 4)];
    const optimalProb = Math.max(...strategyOnly);
    const actions = ['FOLD', gd?.toCall === "0.0" ? 'CHECK' : 'CALL', gd?.toCall === "0.0" ? 'BET 33%' : 'RAISE 33%', gd?.toCall === "0.0" ? 'BET 75%' : 'RAISE 75%'];
    const optimalAction = actions[strategyOnly.indexOf(optimalProb)];
    const isCorrect = strategyOnly[idx] === optimalProb;
    const evDiff = Math.floor((optimalProb - strategyOnly[idx]) * 100);
    const newElo = isCorrect ? eloTrain + 15 : Math.max(0, eloTrain - 10);
    setTrainFeedback({ msg: isCorrect ? `✅ GTO! Optymalny ruch` : `❌ Błąd! Optymalnie: ${optimalAction}`, type: isCorrect ? 'success' : 'error' });
    if (!isCorrect) { setShake(true); setTimeout(() => setShake(false), 500); }
    setEloTrain(newElo); setStreak(isCorrect ? streak + 1 : 0); setHandsPlayed(handsPlayed + 1); setEloHistory(p => [...p, newElo]);
    saveStatsToDb('train', newElo, isCorrect ? streak + 1 : 0, handsPlayed + 1);
    setHandHistory(p => [{ id: handsPlayed + 1, street: gd?.street || 'Preflop', heroCards: trainHand.hand.match(/.{1,2}/g) || [], boardCards: trainHand.board.match(/.{1,2}/g) || [], action: actionName, optimal: optimalAction, evDiff, isCorrect }, ...p].slice(0, 50));
    setTimeout(() => { if (trainMode === 'random') loadNewRandomHand(); else setShowCustomBuilder(true); }, 2000);
  };

  const startArena1v1 = (selectedElo: number) => {
    setBotElo(selectedElo); setHeroHP(1000); setBotHP(1000); setArenaState('playing1v1'); setArenaWinner(null); setArenaRound(1); loadArena1v1Hand(selectedElo);
  };

  const loadArena1v1Hand = (currentBotElo: number) => {
    const s = generateRandomScenario(); setArenaIsSolving(true); setArenaHand(null); setArenaStrategy(null); setArenaFeedback({msg: '', type: null});
    fetch(`https://poker-api-fsle.onrender.com/api/arena?hand=${s.hand}&board=${s.board}&pos=${s.pos}&bot_elo=${currentBotElo}`)
      .then(res => res.json()).then(data => { setArenaStrategy([...data.strategy, 0]); setBotMoveData({ action: data.bot_action, damage: Math.round(data.bot_damage) }); setArenaHand(s); setArenaIsSolving(false); });
  };

  const handleArena1v1Action = (idx: number) => {
    if (!arenaStrategy || !botMoveData) return;
    const evDiff = Math.floor((Math.max(...arenaStrategy.slice(0, 4)) - arenaStrategy[idx]) * 100);
    const newHeroHp = Math.max(0, heroHP - evDiff); const newBotHp = Math.max(0, botHP - botMoveData.damage);
    setHeroHP(newHeroHp); setBotHP(newBotHp);
    setArenaFeedback({ msg: `Cios! Ty tracisz ${evDiff} HP | Bot traci ${botMoveData.damage} HP`, type: evDiff <= botMoveData.damage ? 'success' : 'error' });
    if (evDiff > 0) { setShake(true); setTimeout(() => setShake(false), 500); }
    if (newHeroHp === 0 || newBotHp === 0) {
       setArenaState('gameover');
       if (newHeroHp > newBotHp || newBotHp === 0) { setArenaWinner('hero'); setElo1v1(elo1v1 + 25); saveStatsToDb('1v1', elo1v1 + 25, streak, handsPlayed); }
       else { setArenaWinner('bot'); setElo1v1(Math.max(0, elo1v1 - 25)); saveStatsToDb('1v1', Math.max(0, elo1v1 - 25), 0, handsPlayed); }
    } else {
       setTimeout(() => { setArenaRound(r => r + 1); loadArena1v1Hand(botElo); }, 3500);
    }
  };

  const startArena1v7 = () => {
    const initialPlayers = [ { id: 0, name: currentUser ? currentUser.username : "Hero", isHero: true, hp: 1000, isDead: false, placement: null } ];
    for (let i = 0; i < 7; i++) initialPlayers.push({ id: i + 1, name: ["Nowicjusz", "Fish", "Reg", "Pros", "GTO Nerd", "Maszyna", "Terminator"][i], isHero: false, hp: 1000, isDead: false, placement: null });
    setPlayers8(initialPlayers); setAliveCount(8); setArenaState('playing1v7'); setArenaRound(1); loadArena1v7Hand();
  };

  const loadArena1v7Hand = () => {
    const s = generateRandomScenario(); setArenaIsSolving(true); setArenaHand(null); setArenaStrategy(null); setArenaFeedback({msg: '', type: null});
    setPlayers8(prev => prev.map(p => ({ ...p, lastDamage: 0 })));
    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket("wss://poker-api-fsle.onrender.com/ws/arena8");
    wsRef.current = ws;
    ws.onopen = () => ws.send(JSON.stringify({ hand: s.hand, board: s.board, pos: s.pos }));
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "strategy") {
         setArenaStrategy([...data.strategy, []]); setArenaHand(s); setArenaIsSolving(false);
      } else if (data.type === "bot_action") {
         setPlayers8(prev => {
             let currentAlive = prev.filter(p => !p.isDead).length;
             return prev.map(p => {
                 if (p.id === data.bot_id && !p.isDead) {
                     const newHp = Math.max(0, p.hp - data.damage); let placement = p.placement; if (newHp === 0) { placement = currentAlive; }
                     return { ...p, hp: newHp, isDead: newHp === 0, placement, lastDamage: data.damage };
                 }
                 return p;
             }).sort((a, b) => { if (a.isDead && !b.isDead) return 1; if (!a.isDead && b.isDead) return -1; return b.hp - a.hp; });
         });
      }
    };
  };

  const handleArena1v7Action = (idx: number) => {
    if (!arenaStrategy || !arenaHand) return;
    const evDiff = Math.floor((Math.max(...arenaStrategy.slice(0, 4)) - arenaStrategy[idx]) * 100);
    setPlayers8(prev => {
        let currentAlive = prev.filter(p => !p.isDead).length;
        return prev.map(p => {
            if (p.isHero && !p.isDead) {
                const newHp = Math.max(0, p.hp - evDiff); let placement = p.placement; if (newHp === 0) { placement = currentAlive; }
                return { ...p, hp: newHp, isDead: newHp === 0, placement, lastDamage: evDiff };
            }
            return p;
        }).sort((a, b) => { if (a.isDead && !b.isDead) return 1; if (!a.isDead && b.isDead) return -1; return b.hp - a.hp; });
    });
    setArenaFeedback({ msg: `Twój cios: -${evDiff} HP`, type: evDiff === 0 ? 'success' : 'error' });
    if (evDiff > 0) { setShake(true); setTimeout(() => setShake(false), 500); }
    setTimeout(() => {
        setPlayers8(currentPlayers => {
            const hero = currentPlayers.find(p => p.isHero); const alive = currentPlayers.filter(p => !p.isDead).length;
            if (hero?.isDead || alive <= 1) {
                const placement = hero?.placement || 1;
                const eloChange = ({ 1: 40, 2: 20, 3: 10, 4: 5, 5: -5, 6: -10, 7: -20, 8: -40 } as Record<number, number>)[placement] || 0;
                setArenaPlacement(placement); setArenaEloChange(eloChange); setElo1v7(Math.max(0, elo1v7 + eloChange)); saveStatsToDb('1v7', Math.max(0, elo1v7 + eloChange), streak, handsPlayed); setArenaState('gameover');
            } else {
                setArenaRound(r => r + 1); loadArena1v7Hand();
            }
            return currentPlayers;
        });
    }, 3000);
  };

  const currentDisplayElo = activeTab === 'arena' || activeTab === 'duel' ? (arenaState === 'playing1v7' ? elo1v7 : elo1v1) : eloTrain;
  const currentRank = getRank(currentDisplayElo);

  const oppElo = friends.find(f => f.id === duelOpponent?.id)?.elo_1v1 || 1000;
  const heroRank = getRank(elo1v1);
  const oppRank = getRank(oppElo);

  const arenaProps = { arenaState, setArenaState, shake, heroHP, botHP, botElo, feedback: arenaFeedback, isSolving: arenaIsSolving, currentHand: arenaHand, currentStrategy: arenaStrategy, handleArena1v1Action, handleArena1v7Action, startArena1v1, startArena1v7, aliveCount, players8, arenaPlacement, arenaWinner, arenaEloChange, arenaRound };
  const trainProps = { trainMode, showCustomBuilder, isSolving: trainIsSolving, currentHand: trainHand, feedback: trainFeedback, currentStrategy: trainStrategy, handleAction, actionLogs: trainActionLogs, customHero, customBoard, customPosition, setCustomPosition, customHistory, setCustomHistory, toggleCustomCard: (card: string) => { if (customHero.includes(card)) setCustomHero(p => p.filter(c => c !== card)); else if (customBoard.includes(card)) setCustomBoard(p => p.filter(c => c !== card)); else { if (customHero.length < 2) setCustomHero(p => [...p, card]); else if (customBoard.length < 5) setCustomBoard(p => [...p, card]); } }, clearCustomBuilder: () => { setCustomHero([]); setCustomBoard([]); setCustomHistory(''); }, analyzeCustom: () => triggerSolver({ hand: customHero.join(''), board: customBoard.join(''), pos: customPosition, history: customHistory, spotTitle: "Custom Board", stack: 100, villainPos: "BB" }), isCustomValid: customHero.length === 2 && [0, 3, 4, 5].includes(customBoard.length), loadNewRandomHand };

  return (
    <div className="flex h-screen w-screen bg-[#121212] text-slate-200 font-sans overflow-hidden relative">

      {/* LEWY PANEL (Sidebar) */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-zinc-800 flex flex-col shrink-0 z-30">
        <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-emerald-900/50">♠</div>
          <span className="font-black text-2xl tracking-tight text-white">GTO<span className="text-emerald-500">Duel</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest px-3 mb-2 block mt-2">Gra & Trening</span>
          <button onClick={() => setActiveTab('arena')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'arena' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
            <Swords className="w-5 h-5" /> Arena 1v1 / 1v7
          </button>
          <button onClick={() => { setActiveTab('train'); setTrainMode('random'); setShowCustomBuilder(false); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'train' && trainMode === 'random' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
            <Target className="w-5 h-5" /> Szybki Trening
          </button>
          <button onClick={() => { setActiveTab('train'); setTrainMode('custom'); setShowCustomBuilder(true); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'train' && trainMode === 'custom' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
            <Wrench className="w-5 h-5" /> Custom Board
          </button>
          <button onClick={() => setActiveTab('theory')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'theory' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
            <BookOpen className="w-5 h-5" /> Preflop Charts
          </button>

          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest px-3 mb-2 block mt-8">Społeczność</span>
          <button onClick={() => setActiveTab('leaderboard')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'leaderboard' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
            <Trophy className="w-5 h-5" /> Ranking (Top 10)
          </button>
          <button onClick={() => setActiveTab('friends')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'friends' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
            <Users className="w-5 h-5" /> Znajomi & Rywale
          </button>

          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest px-3 mb-2 block mt-8">Analityka</span>
          <button onClick={() => setActiveTab('stats')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'stats' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
            <BarChart2 className="w-5 h-5" /> Statystyki GTO
          </button>
          <button onClick={() => setActiveTab('account')} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'account' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'}`}>
            <User className="w-5 h-5" /> Moje Konto
          </button>
        </nav>

        <div className="p-4 border-t border-zinc-800/50 bg-[#0a0a0a]">
          {currentUser ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-400 font-bold">Zalogowano jako</span>
                  <span className="font-black text-white truncate max-w-[120px]">{currentUser.username}</span>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-black border ${currentRank.bg} ${currentRank.color} ${currentRank.border}`}>
                  {currentRank.icon} ELO {currentDisplayElo}
                </div>
              </div>
              <button onClick={() => { localStorage.removeItem('poker_user'); setCurrentUser(null); setActiveTab('home'); }} className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-xl font-bold transition-colors text-sm border border-zinc-800">
                <LogOut className="w-4 h-4" /> Wyloguj
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button onClick={() => { setAuthMode('register'); setShowAuthModal(true); }} className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black transition-colors shadow-lg shadow-emerald-900/20 text-sm">
                <UserPlus className="w-4 h-4" /> Zarejestruj się
              </button>
              <button onClick={() => { setAuthMode('login'); setShowAuthModal(true); }} className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-bold transition-colors border border-zinc-700 text-sm">
                <LogIn className="w-4 h-4" /> Zaloguj się
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* PRAWA STRONA (Główna zawartość) */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-[#121212]">
        {!currentUser ? (
          activeTab === 'train' ? (
            <Train {...trainProps} currentUser={currentUser} onLoginClick={() => { setAuthMode('register'); setShowAuthModal(true); }} />
          ) : (
            <Landing
              onLoginClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              onStartTraining={() => setActiveTab('train')}
            />
          )
        ) : (
          <>
            {activeTab === 'home' && <main className="flex-1 overflow-y-auto p-6 lg:p-10"><Home setActiveTab={setActiveTab} /></main>}
            {activeTab === 'theory' && <main className="flex-1 overflow-y-auto p-6 lg:p-10"><Theory activeTheoryPos={activeTheoryPos} setActiveTheoryPos={setActiveTheoryPos} preflopData={preflopData} selectedPreflop={selectedPreflop} setSelectedPreflop={setSelectedPreflop} /></main>}
            {activeTab === 'stats' && <main className="flex-1 overflow-y-auto p-6 lg:p-10"><Stats eloTrain={eloTrain} elo1v1={elo1v1} elo1v7={elo1v7} eloHistory={eloHistory} handHistory={handHistory} handsPlayed={handsPlayed} resetStats={resetStats} /></main>}
            {activeTab === 'account' && <main className="flex-1 overflow-y-auto p-6 lg:p-10"><Account currentUser={currentUser} setCurrentUser={setCurrentUser} elo1v1={elo1v1} friends={friends} handHistory={handHistory} setActiveTab={setActiveTab} /></main>}

            {activeTab === 'leaderboard' && (
              <main className="flex-1 overflow-y-auto bg-[#121212] p-6 lg:p-10 flex flex-col gap-8 items-center">
                <div className="flex flex-col items-center gap-2 mb-4">
                  <Trophy className="w-16 h-16 text-yellow-500 mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                  <h2 className="text-4xl font-black tracking-tight text-white uppercase">Ranking 1v1</h2>
                  <p className="text-zinc-400 text-sm">TOP 10 najlepszych graczy w bezpośrednich starciach GTO.</p>
                </div>

                <div className="w-full max-w-3xl flex flex-col gap-3">
                  {leaderboard.length === 0 ? (
                    <div className="text-center text-zinc-500 py-10">Wczytywanie rankingu...</div>
                  ) : (
                    leaderboard.map((entry) => {
                      let rankColor = "text-zinc-400 bg-zinc-900 border-zinc-800";
                      let badge = null;

                      if (entry.rank === 1) { rankColor = "text-yellow-400 bg-yellow-950/30 border-yellow-500/30 font-black"; badge = "👑"; }
                      else if (entry.rank === 2) { rankColor = "text-slate-300 bg-slate-900 border-slate-600/30 font-bold"; badge = "🥈"; }
                      else if (entry.rank === 3) { rankColor = "text-amber-600 bg-amber-950/20 border-amber-800/30 font-bold"; badge = "🥉"; }

                      const isMe = currentUser && currentUser.username === entry.username;
                      const r = getRank(entry.elo);

                      return (
                        <motion.div initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} transition={{delay: entry.rank * 0.05}} key={entry.rank} className={`flex items-center justify-between p-4 rounded-xl border ${rankColor} ${isMe ? 'ring-2 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''}`}>
                          <div className="flex items-center gap-6">
                            <span className="text-2xl w-8 text-center opacity-70">#{entry.rank}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xl tracking-wide">{entry.username}</span>
                              {badge && <span>{badge}</span>}
                              {isMe && <span className="text-[10px] uppercase font-black bg-emerald-600 text-white px-2 py-0.5 rounded ml-2">Ty</span>}

                              <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded border ${r.bg} ${r.color} ${r.border} ml-3 hidden md:inline-block`}>
                                 {r.icon} {r.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-2xl font-mono tracking-tighter">{entry.elo}</span>
                            <span className="text-[10px] uppercase opacity-50 font-bold">Punkty ELO</span>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                </div>
              </main>
            )}

            {activeTab === 'friends' && (
              <main className="flex-1 overflow-y-auto bg-[#121212] p-6 lg:p-10 flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-black tracking-tight text-white">Znajomi i Rywale</h2>
                  <p className="text-zinc-400 text-sm">Zaproś graczy do znajomych, aby wyzywać ich na bezpośrednie pojedynki GTO Duel.</p>
                </div>
                {!currentUser ? (
                  <div className="bg-zinc-900 border border-zinc-800 p-8 rounded text-center">
                    <p className="text-zinc-400 mb-4">Musisz być zalogowany, aby dodawać znajomych i grać mecze 1v1.</p>
                    <button onClick={() => setShowAuthModal(true)} className="bg-emerald-600 px-6 py-2 rounded font-bold text-white">Zaloguj się</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded flex flex-col gap-4 h-fit">
                      <h3 className="font-bold text-lg text-white">Dodaj znajomego</h3>
                      <form onSubmit={handleSendFriendRequest} className="flex gap-3">
                        <input type="text" placeholder="Wpisz nazwę gracza..." value={friendSearch} onChange={(e) => setFriendSearch(e.target.value)} className="flex-1 bg-[#121212] border border-zinc-700 rounded px-4 py-2 text-white outline-none focus:border-emerald-500" />
                        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded">Wyślij</button>
                      </form>
                      {friendMsg && <span className="text-sm font-bold text-emerald-400">{friendMsg}</span>}
                    </div>
                    <div className="flex flex-col gap-6">
                      {friends.filter(f => f.status === 'pending').length > 0 && (
                        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded flex flex-col gap-4">
                          <h3 className="font-bold text-lg text-amber-500">Oczekujące zaproszenia</h3>
                          <div className="flex flex-col gap-3">
                            {friends.filter(f => f.status === 'pending').map(f => (
                              <div key={f.id} className="bg-[#121212] border border-zinc-800 p-3 rounded flex justify-between items-center">
                                <span className="font-bold text-white">{f.username}</span>
                                <button onClick={() => handleAcceptFriend(f.id)} className="bg-blue-600 hover:bg-blue-500 px-4 py-1.5 rounded text-xs font-bold text-white">Akceptuj</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded flex flex-col gap-4">
                        <h3 className="font-bold text-lg text-white">Twoi znajomi</h3>
                        {friends.filter(f => f.status === 'accepted').length === 0 ? (
                          <p className="text-zinc-500 text-sm">Nie masz jeszcze żadnych znajomych. Poszukaj kogoś!</p>
                        ) : (
                          <div className="flex flex-col gap-3">
                            {friends.filter(f => f.status === 'accepted').map(f => (
                              <div key={f.id} className="bg-[#121212] border border-zinc-800 p-4 rounded flex justify-between items-center">
                                <div className="flex flex-col">
                                  <span className="font-bold text-white">{f.username}</span>
                                  <span className="text-xs font-mono text-zinc-500">ELO: {f.elo_1v1}</span>
                                </div>
                                <button onClick={() => handleChallengeFriend(f.id, f.username)} className="bg-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-600/50 px-4 py-2 rounded text-xs font-bold transition-colors">
                                  Wyzwij na 1v1
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </main>
            )}

            {/* CZYSTY HUD DLA DUEL 1v1 */}
            {activeTab === 'duel' && (
              <main className="flex-1 overflow-y-auto bg-[#121212] p-6 lg:p-10 flex flex-col items-center relative">

                <div className="w-full max-w-3xl flex justify-between items-end border-b border-zinc-800 pb-4 mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-zinc-100">Live Duel GTO</h2>
                    <span className="text-xs font-mono text-zinc-500">Sesja: {duelRoomId}</span>
                  </div>
                  <button onClick={() => { if(duelWsRef.current) duelWsRef.current.close(); setActiveTab('friends'); setDuelState('idle'); loadFriends(); }} className="text-xs font-bold text-zinc-500 hover:text-white transition-colors bg-zinc-900 px-3 py-1.5 rounded border border-zinc-800">
                    Zakończ sesję
                  </button>
                </div>

                {duelState === 'lobby' && (
                  <div className="w-full max-w-3xl flex flex-col items-center justify-center p-12 bg-zinc-900/50 border border-zinc-800 rounded">
                    <Loader2 className="w-6 h-6 animate-spin text-zinc-500 mb-4" />
                    <h3 className="text-zinc-300 font-bold mb-1">Oczekiwanie na połączenie</h3>
                    <p className="text-sm text-zinc-500">Mecz rozpocznie się, gdy {duelOpponent?.username} dołączy do pokoju.</p>
                  </div>
                )}

                {duelState === 'playing' && duelHand && (
                  <div className="w-full max-w-3xl flex flex-col gap-4">

                    <div className="flex justify-between items-center p-4 bg-zinc-900 border border-zinc-800 rounded">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-zinc-800 rounded-sm flex items-center justify-center text-zinc-500 font-bold text-sm">
                          {duelOpponent?.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-200 text-sm">{duelOpponent?.username}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">ELO: {oppElo}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-mono font-bold text-zinc-300 text-lg">{duelOpponentHp}</span>
                        <span className="text-[9px] uppercase font-bold text-zinc-600">HP Przeciwnika</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center min-h-[160px] bg-[#161616] border border-zinc-800 rounded p-6 relative">
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase text-zinc-600">Pozycja: {duelHand.pos}</span>

                      {duelFeedback.msg && (
                        <span className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${duelFeedback.type === 'success' ? 'bg-emerald-900/30 text-emerald-500 border border-emerald-900' : duelFeedback.type === 'error' ? 'bg-rose-900/30 text-rose-500 border border-rose-900' : 'bg-blue-900/30 text-blue-500 border border-blue-900'}`}>
                          {duelFeedback.msg}
                        </span>
                      )}

                      <div className="flex gap-2">
                        {duelHand.board ? duelHand.board.match(/.{1,2}/g)?.map((c:string, i:number) => (
                          <PokerCard key={i} card={c} size="large" />
                        )) : <span className="text-zinc-600 font-bold text-sm uppercase tracking-widest">Preflop</span>}
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-zinc-900 border border-zinc-800 rounded">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-zinc-600 mb-2">Twoja Ręka</span>
                        <div className="flex gap-2">
                          {duelHand.hand.match(/.{1,2}/g)?.map((c:string, i:number) => (
                            <PokerCard key={i} card={c} size="large" />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        <span className="font-mono font-bold text-zinc-300 text-2xl">{duelHeroHp}</span>
                        <span className="text-[10px] uppercase font-bold text-zinc-600">Twoje HP</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <button disabled={duelFeedback.msg.includes('Czekam') || duelFeedback.msg.includes('Wynik')} onClick={() => handleDuelAction(0)} className="flex-1 py-4 bg-[#4582c3] hover:bg-[#3b70a8] disabled:opacity-30 text-white text-xs font-bold tracking-wider rounded-sm transition-colors">
                        FOLD
                      </button>
                      <button disabled={duelFeedback.msg.includes('Czekam') || duelFeedback.msg.includes('Wynik')} onClick={() => handleDuelAction(1)} className="flex-1 py-4 bg-[#64b96b] hover:bg-[#539d59] disabled:opacity-30 text-white text-xs font-bold tracking-wider rounded-sm transition-colors">
                        {duelHand.board === '' ? 'CHECK / CALL' : 'CALL'}
                      </button>
                      <button disabled={duelFeedback.msg.includes('Czekam') || duelFeedback.msg.includes('Wynik')} onClick={() => handleDuelAction(2)} className="flex-1 py-4 bg-[#ef4c4a] hover:bg-[#d44140] disabled:opacity-30 text-white text-xs font-bold tracking-wider rounded-sm transition-colors">
                        RAISE 33%
                      </button>
                      <button disabled={duelFeedback.msg.includes('Czekam') || duelFeedback.msg.includes('Wynik')} onClick={() => handleDuelAction(3)} className="flex-1 py-4 bg-[#c22a28] hover:bg-[#a62221] disabled:opacity-30 text-white text-xs font-bold tracking-wider rounded-sm transition-colors">
                        RAISE 75%
                      </button>
                    </div>
                  </div>
                )}

                {duelState === 'gameover' && (
                  <div className="w-full max-w-3xl flex flex-col items-center justify-center p-12 bg-zinc-900 border border-zinc-800 rounded mt-4">
                    <h2 className="text-2xl font-bold text-white mb-2">{duelWinner === 'hero' ? 'Mecz Zakończony (Zwycięstwo)' : 'Mecz Zakończony (Porażka)'}</h2>
                    <p className="text-sm text-zinc-400 mb-8">
                      {duelWinner === 'hero' ? `Optymalna gra. Pokonałeś gracza ${duelOpponent?.username}. (+25 ELO)` : `Przeciwnik grał bliżej GTO. Przegrałeś z graczem ${duelOpponent?.username}. (-25 ELO)`}
                    </p>
                    <button onClick={() => { setActiveTab('friends'); setDuelState('idle'); loadFriends(); }} className="bg-white hover:bg-zinc-200 text-zinc-900 font-bold px-6 py-2 rounded text-sm transition-colors">
                      Wróć do społeczności
                    </button>
                  </div>
                )}
              </main>
            )}

            {activeTab === 'arena' && <Arena {...arenaProps} />}
            {activeTab === 'train' && <Train {...trainProps} currentUser={currentUser} />}
          </>
        )}
      </div>

      {/* NOWY MODAL AUTORYZACJI */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            initialMode={authMode}
            onClose={() => setShowAuthModal(false)}
            onSuccess={(user) => {
              setCurrentUser({ id: user.id, username: user.username });
              localStorage.setItem('poker_user', JSON.stringify({ id: user.id, username: user.username }));
              setEloTrain(user.elo_train);
              setElo1v1(user.elo_1v1);
              setElo1v7(user.elo_1v7);
              setEloHistory([user.elo_train]);
              setShowAuthModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
