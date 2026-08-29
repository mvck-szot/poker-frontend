import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Target, BarChart2, BookOpen, Wrench, XSquare, Users } from 'lucide-react';

import { generateRandomScenario, parseScenario } from './utils/poker';
import { Home } from './pages/Home';
import { Theory } from './pages/Theory';
import { Stats } from './pages/Stats';
import { Arena } from './pages/Arena';
import { Train } from './pages/Train';

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<'home' | 'train' | 'stats' | 'theory' | 'arena' | 'friends'>('home');
  const [trainMode, setTrainMode] = useState<'random' | 'custom'>('random');
  const [showCustomBuilder, setShowCustomBuilder] = useState(false);

  // ELO & STATS
  const [eloTrain, setEloTrain] = useState(1000);
  const [elo1v1, setElo1v1] = useState(1000);
  const [elo1v7, setElo1v7] = useState(1000);
  const [streak, setStreak] = useState(0);
  const [handsPlayed, setHandsPlayed] = useState(0);
  const [eloHistory, setEloHistory] = useState<number[]>([1000]);
  const [handHistory, setHandHistory] = useState<any[]>([]);

  // ZNAJOMI (NOWOŚĆ)
  const [friends, setFriends] = useState<any[]>([]);
  const [friendSearch, setFriendSearch] = useState('');
  const [friendMsg, setFriendMsg] = useState('');

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

  useEffect(() => {
    if (activeTab === 'friends' && currentUser) {
      loadFriends();
    }
  }, [activeTab, currentUser]);

  const handleSendFriendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !friendSearch) return;

    fetch('https://poker-api-fsle.onrender.com/api/friends/add', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: currentUser.id, friend_username: friendSearch })
    })
    .then(res => res.json())
    .then(data => {
      setFriendMsg(data.message);
      setFriendSearch('');
      loadFriends();
      setTimeout(() => setFriendMsg(''), 3000);
    });
  };

  const handleAcceptFriend = (friendId: number) => {
    if (!currentUser) return;
    fetch('https://poker-api-fsle.onrender.com/api/friends/accept', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: currentUser.id, friend_id: friendId })
    }).then(() => loadFriends());
  };

  const saveStatsToDb = (mode: string, newElo: number, newStreak: number, newHandsPlayed: number) => {
    fetch('https://poker-api-fsle.onrender.com/api/stats', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: currentUser?.id || null, mode, elo: newElo, streak: newStreak, hands_played: newHandsPlayed })
    }).catch(e => console.log(e));
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setAuthError('');
    fetch(`https://poker-api-fsle.onrender.com/api/${authMode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: authUsername, password: authPassword }) })
    .then(res => res.json()).then(data => {
      if (data.success) {
        setCurrentUser({ id: data.id, username: data.username });
        setEloTrain(data.elo_train); setElo1v1(data.elo_1v1); setElo1v7(data.elo_1v7); setEloHistory([data.elo_train]); setShowAuthModal(false);
      } else { setAuthError(data.message); }
    });
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
    const gd = parseScenario(trainHand);
    let strategyOnly = [...trainStrategy.slice(0, 4)];

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

    setHandHistory(p => [{
      id: handsPlayed + 1, street: gd?.street || 'Preflop',
      heroCards: trainHand.hand.match(/.{1,2}/g) || [], boardCards: trainHand.board.match(/.{1,2}/g) || [], action: actionName, optimal: optimalAction, evDiff, isCorrect
    }, ...p].slice(0, 50));

    setTimeout(() => { if (trainMode === 'random') loadNewRandomHand(); else setShowCustomBuilder(true); }, 2000);
  };

  const exportReport = () => {
    if (!trainHand || !trainStrategy) return;
    const gd = parseScenario(trainHand); if (!gd) return;
    const [f, c, s, b, eq] = trainStrategy;
    const reportText = `♠ PokerHub GTO Report ♠\nFaza: ${gd.street} | Pozycja: ${gd.position}\nKarty: ${gd.hand.join(' ')} | Stół: ${gd.board.length > 0 ? gd.board.join(' ') : 'Brak'}\nEquity: ${((eq||0)*100).toFixed(1)}%\n\nStrategia GTO:\n- Raise 75%: ${(b*100).toFixed(1)}%\n- Raise 33%: ${(s*100).toFixed(1)}%\n- Call: ${(c*100).toFixed(1)}%\n- Fold: ${(f*100).toFixed(1)}%`;
    navigator.clipboard.writeText(reportText); setIsCopied(true); setTimeout(() => setIsCopied(false), 2000);
  };

  const startArena1v1 = (selectedElo: number) => {
    setBotElo(selectedElo); setHeroHP(1000); setBotHP(1000);
    setArenaState('playing1v1'); setArenaWinner(null); setArenaRound(1);
    loadArena1v1Hand(selectedElo);
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
       setTimeout(() => {
           setArenaRound(r => r + 1);
           loadArena1v1Hand(botElo);
       }, 3500);
    }
  };

  const startArena1v7 = () => {
    const initialPlayers = [ { id: 0, name: currentUser ? currentUser.username : "Hero", isHero: true, hp: 1000, isDead: false, placement: null } ];
    for (let i = 0; i < 7; i++) initialPlayers.push({ id: i + 1, name: ["Nowicjusz", "Fish", "Reg", "Pros", "GTO Nerd", "Maszyna", "Terminator"][i], isHero: false, hp: 1000, isDead: false, placement: null });
    setPlayers8(initialPlayers); setAliveCount(8); setArenaState('playing1v7'); setArenaRound(1);
    loadArena1v7Hand();
  };

  const loadArena1v7Hand = () => {
    const s = generateRandomScenario();
    setArenaIsSolving(true); setArenaHand(null); setArenaStrategy(null); setArenaFeedback({msg: '', type: null});

    setPlayers8(prev => prev.map(p => ({ ...p, lastDamage: 0 })));

    if (wsRef.current) wsRef.current.close();
    const ws = new WebSocket("wss://poker-api-fsle.onrender.com/ws/arena8");
    wsRef.current = ws;

    ws.onopen = () => ws.send(JSON.stringify({ hand: s.hand, board: s.board, pos: s.pos }));

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "strategy") {
         setArenaStrategy([...data.strategy, []]);
         setArenaHand(s);
         setArenaIsSolving(false);
      } else if (data.type === "bot_action") {
         setPlayers8(prev => {
             let currentAlive = prev.filter(p => !p.isDead).length;
             return prev.map(p => {
                 if (p.id === data.bot_id && !p.isDead) {
                     const newHp = Math.max(0, p.hp - data.damage);
                     let placement = p.placement;
                     if (newHp === 0) { placement = currentAlive; }
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
                const newHp = Math.max(0, p.hp - evDiff);
                let placement = p.placement;
                if (newHp === 0) { placement = currentAlive; }
                return { ...p, hp: newHp, isDead: newHp === 0, placement, lastDamage: evDiff };
            }
            return p;
        }).sort((a, b) => { if (a.isDead && !b.isDead) return 1; if (!a.isDead && b.isDead) return -1; return b.hp - a.hp; });
    });

    setArenaFeedback({ msg: `Twój cios: -${evDiff} HP`, type: evDiff === 0 ? 'success' : 'error' });
    if (evDiff > 0) { setShake(true); setTimeout(() => setShake(false), 500); }

    setTimeout(() => {
        setPlayers8(currentPlayers => {
            const hero = currentPlayers.find(p => p.isHero);
            const alive = currentPlayers.filter(p => !p.isDead).length;
            if (hero?.isDead || alive <= 1) {
                const placement = hero?.placement || 1;
                const eloChange = ({ 1: 40, 2: 20, 3: 10, 4: 5, 5: -5, 6: -10, 7: -20, 8: -40 } as Record<number, number>)[placement] || 0;
                setArenaPlacement(placement); setArenaEloChange(eloChange); setElo1v7(Math.max(0, elo1v7 + eloChange)); saveStatsToDb('1v7', Math.max(0, elo1v7 + eloChange), streak, handsPlayed); setArenaState('gameover');
            } else {
                setArenaRound(r => r + 1);
                loadArena1v7Hand();
            }
            return currentPlayers;
        });
    }, 3000);
  };

  const currentDisplayElo = activeTab === 'arena' ? (arenaState === 'playing1v7' ? elo1v7 : elo1v1) : eloTrain;

  const arenaProps = { arenaState, setArenaState, shake, heroHP, botHP, botElo, feedback: arenaFeedback, isSolving: arenaIsSolving, currentHand: arenaHand, currentStrategy: arenaStrategy, handleArena1v1Action, handleArena1v7Action, startArena1v1, startArena1v7, aliveCount, players8, arenaPlacement, arenaWinner, arenaEloChange, arenaRound };
  const trainProps = { trainMode, showCustomBuilder, isSolving: trainIsSolving, currentHand: trainHand, feedback: trainFeedback, currentStrategy: trainStrategy, handleAction, exportReport, isCopied, actionLogs: trainActionLogs, customHero, customBoard, customPosition, setCustomPosition, customHistory, setCustomHistory, toggleCustomCard: (card: string) => { if (customHero.includes(card)) setCustomHero(p => p.filter(c => c !== card)); else if (customBoard.includes(card)) setCustomBoard(p => p.filter(c => c !== card)); else { if (customHero.length < 2) setCustomHero(p => [...p, card]); else if (customBoard.length < 5) setCustomBoard(p => [...p, card]); } }, clearCustomBuilder: () => { setCustomHero([]); setCustomBoard([]); setCustomHistory(''); }, analyzeCustom: () => triggerSolver({ hand: customHero.join(''), board: customBoard.join(''), pos: customPosition, history: customHistory, spotTitle: "Custom Board", stack: 100, villainPos: "BB" }), isCustomValid: customHero.length === 2 && [0, 3, 4, 5].includes(customBoard.length), loadNewRandomHand };

  return (
    <div className="h-screen w-screen bg-[#121212] text-slate-200 flex flex-col font-sans overflow-hidden relative">
      <header className="h-16 shrink-0 border-b border-zinc-800 bg-[#0a0a0a] flex items-center justify-between px-6 z-30">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center font-black text-white text-lg">♠</div><span className="font-bold text-lg tracking-wide text-white">PokerHub</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-bold text-zinc-400">
            <button className={`${activeTab === 'arena' ? 'text-white' : 'hover:text-zinc-200'}`} onClick={() => setActiveTab('arena')}>Arena</button>
            <button className={`${activeTab === 'theory' ? 'text-white' : 'hover:text-zinc-200'}`} onClick={() => setActiveTab('theory')}>Teoria</button>
            <button className={`${activeTab === 'train' ? 'text-white' : 'hover:text-zinc-200'}`} onClick={() => { setActiveTab('train'); setTrainMode('random'); setShowCustomBuilder(false); }}>Trening</button>
            <button className={`${activeTab === 'stats' ? 'text-white' : 'hover:text-zinc-200'}`} onClick={() => setActiveTab('stats')}>Profil</button>
          </nav>
        </div>
        <div className="flex items-center gap-5 text-zinc-400">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-zinc-300">Witaj, <span className="text-white">{currentUser.username}</span></span>
              <motion.span key={activeTab} className="text-xs bg-zinc-800 px-2 py-1 rounded border border-zinc-700 font-mono">ELO: <span className="text-white">{currentDisplayElo}</span></motion.span>
              <button onClick={() => setCurrentUser(null)} className="text-[10px] uppercase font-bold hover:text-white">Wyloguj</button>
            </div>
          ) : (<button onClick={() => setShowAuthModal(true)} className="bg-emerald-600 px-4 py-1.5 rounded font-bold text-sm text-white">Zaloguj</button>)}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-zinc-800 bg-[#0a0a0a] flex flex-col p-4 shrink-0 z-20">
          <span className="text-[10px] text-zinc-500 uppercase font-bold px-3 mb-2 block">Rywalizacja</span>
          <button onClick={() => setActiveTab('arena')} className={`flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm ${activeTab === 'arena' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900/50'}`}><Swords className="w-4 h-4" /> GTO Arena</button>
          <span className="text-[10px] text-zinc-500 uppercase font-bold px-3 mt-6 mb-2 block">Trening</span>
          <button onClick={() => { setActiveTab('train'); setTrainMode('random'); setShowCustomBuilder(false); }} className={`flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm ${activeTab === 'train' && trainMode === 'random' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900/50'}`}><Target className="w-4 h-4" /> Losowe Rozdania</button>
          <button onClick={() => { setActiveTab('train'); setTrainMode('custom'); setShowCustomBuilder(true); }} className={`flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm ${activeTab === 'train' && trainMode === 'custom' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900/50'}`}><Wrench className="w-4 h-4" /> Custom Board</button>
          <button onClick={() => setActiveTab('theory')} className={`flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm ${activeTab === 'theory' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900/50'}`}><BookOpen className="w-4 h-4" /> Preflop Charts</button>
          <span className="text-[10px] text-zinc-500 uppercase font-bold px-3 mt-6 mb-2 block">Społeczność & Profil</span>
          <button onClick={() => setActiveTab('friends')} className={`flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm ${activeTab === 'friends' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900/50'}`}><Users className="w-4 h-4" /> Znajomi</button>
          <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-3 px-3 py-2.5 rounded font-bold text-sm ${activeTab === 'stats' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-900/50'}`}><BarChart2 className="w-4 h-4" /> Profil GTO</button>
        </aside>

        {activeTab === 'home' && <main className="flex-1 overflow-y-auto bg-[#121212] p-6 lg:p-10"><Home setActiveTab={setActiveTab} /></main>}
        {activeTab === 'theory' && <main className="flex-1 overflow-y-auto bg-[#121212] p-6 lg:p-10"><Theory activeTheoryPos={activeTheoryPos} setActiveTheoryPos={setActiveTheoryPos} preflopData={preflopData} selectedPreflop={selectedPreflop} setSelectedPreflop={setSelectedPreflop} /></main>}
        {activeTab === 'stats' && <main className="flex-1 overflow-y-auto bg-[#121212] p-6 lg:p-10"><Stats eloTrain={eloTrain} elo1v1={elo1v1} elo1v7={elo1v7} eloHistory={eloHistory} handHistory={handHistory} handsPlayed={handsPlayed} resetStats={resetStats} /></main>}

        {/* NOWA ZAKŁADKA: ZNAJOMI */}
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
                {/* Wyszukiwarka */}
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded flex flex-col gap-4 h-fit">
                  <h3 className="font-bold text-lg text-white">Dodaj znajomego</h3>
                  <form onSubmit={handleSendFriendRequest} className="flex gap-3">
                    <input type="text" placeholder="Wpisz nazwę gracza..." value={friendSearch} onChange={(e) => setFriendSearch(e.target.value)} className="flex-1 bg-[#121212] border border-zinc-700 rounded px-4 py-2 text-white outline-none focus:border-emerald-500" />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2 rounded">Wyślij</button>
                  </form>
                  {friendMsg && <span className="text-sm font-bold text-emerald-400">{friendMsg}</span>}
                </div>

                {/* Lista */}
                <div className="flex flex-col gap-6">
                  {/* Oczekujące */}
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

                  {/* Zaakceptowani */}
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
                            <button onClick={() => alert('Już za chwilę zaczniemy budować pokoje WebSocket do bezpośrednich wyzwań!')} className="bg-rose-600/20 text-rose-500 hover:bg-rose-600 hover:text-white border border-rose-600/50 px-4 py-2 rounded text-xs font-bold transition-colors">
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

        {activeTab === 'arena' && <Arena {...arenaProps} />}
        {activeTab === 'train' && <Train {...trainProps} />}
      </div>

      <AnimatePresence>
        {showAuthModal && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#121212] border border-zinc-800 p-8 rounded w-full max-w-sm flex flex-col gap-6 shadow-2xl">
              <div className="flex justify-between items-center"><h3 className="text-xl font-bold text-white">{authMode === 'login' ? 'Logowanie' : 'Rejestracja'}</h3><button onClick={() => setShowAuthModal(false)} className="text-zinc-500 hover:text-white"><XSquare className="w-5 h-5"/></button></div>
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-zinc-500">Nazwa Użytkownika</label><input type="text" value={authUsername} onChange={e => setAuthUsername(e.target.value)} required className="bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white outline-none focus:border-blue-500" /></div>
                <div className="flex flex-col gap-1"><label className="text-[10px] font-bold uppercase text-zinc-500">Hasło</label><input type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required className="bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white outline-none focus:border-blue-500" /></div>
                {authError && <span className="text-xs text-rose-500 font-bold">{authError}</span>}
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded mt-2">{authMode === 'login' ? 'Zaloguj się' : 'Utwórz konto'}</button>
              </form>
              <div className="text-center text-xs text-zinc-500">{authMode === 'login' ? 'Nie masz konta? ' : 'Masz już konto? '}<button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-blue-500 font-bold hover:underline">{authMode === 'login' ? 'Zarejestruj się' : 'Zaloguj się'}</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
