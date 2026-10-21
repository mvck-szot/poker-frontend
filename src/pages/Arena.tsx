import { motion, AnimatePresence } from 'framer-motion';
import { Swords, User, Users, Trophy, Skull, Loader2, Play, Shield, Zap, Cpu } from 'lucide-react';
import { PokerCard, EmptyCardSlot } from '../components/PokerCard';
import { parseScenario } from '../utils/poker';

export const Arena = (props: any) => {
  const {
    arenaState, setArenaState, shake, heroHP, botHP, botElo, feedback, isSolving,
    currentHand, currentStrategy, handleArena1v1Action, handleArena1v7Action,
    startArena1v1, startArena1v7, aliveCount, players8, arenaPlacement,
    arenaWinner, arenaEloChange, arenaRound // Odbieramy numer tury
  } = props;

  const gameData = currentHand ? parseScenario(currentHand) : null;

  const renderOvalTable = () => {
    const seats = [
      { id: 'UTG', style: 'top-[5%] left-[25%] -translate-x-1/2 -translate-y-1/2', cardsPos: 'left-[120%]' },
      { id: 'HJ', style: 'top-[5%] right-[25%] translate-x-1/2 -translate-y-1/2', cardsPos: 'right-[120%]' },
      { id: 'CO', style: 'top-[50%] right-[-2%] translate-x-1/2 -translate-y-1/2', cardsPos: 'right-[120%]' },
      { id: 'BTN', style: 'bottom-[5%] right-[25%] translate-x-1/2 translate-y-1/2', cardsPos: 'right-[120%]' },
      { id: 'SB', style: 'bottom-[5%] left-[25%] -translate-x-1/2 translate-y-1/2', cardsPos: 'left-[120%]' },
      { id: 'BB', style: 'top-[50%] left-[-2%] -translate-x-1/2 -translate-y-1/2', cardsPos: 'left-[120%]' },
    ];

    return (
      <div className="relative w-full max-w-4xl mx-auto aspect-[2.3/1] border-[3px] border-[#2a2a2a] rounded-[100%] flex flex-col items-center justify-center my-8 bg-[#161616] shadow-2xl">

        {/* CENTER INFO */}
        {gameData && !isSolving && (
          <div className="flex flex-col items-center justify-center relative z-20">
            <span className="text-[#888] font-bold text-sm mb-1 tracking-wide">
              {gameData.spotTitle || "Arena Board"} <span className="font-normal opacity-50 ml-1">{gameData.stack}bb</span>
            </span>
            <span className="text-white font-bold text-2xl mb-3 flex items-center gap-2">
               {gameData.pot} bb <span className="text-zinc-500 text-sm font-normal">Pot</span>
            </span>
            <div className="flex gap-2">
              {gameData.board.length >= 3 ? (
                <><PokerCard card={gameData.board[0]} size="large" index={0}/><PokerCard card={gameData.board[1]} size="large" index={1}/><PokerCard card={gameData.board[2]} size="large" index={2}/></>
              ) : <EmptyCardSlot label="FLOP" />}
              {gameData.board.length >= 4 ? <PokerCard card={gameData.board[3]} size="large" index={3}/> : (gameData.board.length >= 3 ? <EmptyCardSlot label="T" /> : null)}
              {gameData.board.length >= 5 ? <PokerCard card={gameData.board[4]} size="large" index={4}/> : (gameData.board.length >= 4 ? <EmptyCardSlot label="R" /> : null)}
            </div>
          </div>
        )}

        {isSolving && (
          <div className="flex flex-col items-center z-20">
            <Loader2 className="w-8 h-8 text-zinc-500 animate-spin mb-2"/>
            <span className="text-zinc-500 font-mono text-xs">CFR Kalkulacja...</span>
          </div>
        )}

        {/* POZYCJE GRACZY */}
        {seats.map(seat => {
          const isHero = gameData && gameData.position === seat.id;
          const isVillain = gameData && gameData.villainPos === seat.id;
          const isActive = isHero || isVillain;
          const hasFolded = gameData && !isActive;

          let ringClass = 'border-[2px] border-[#333] bg-[#1d1d1d]';
          if (isHero) ringClass = 'border-[3px] border-[#d88c22] bg-[#1a1410] z-40 shadow-[0_0_15px_rgba(216,140,34,0.2)]';
          else if (isVillain) ringClass = 'border-[2px] border-[#444] bg-[#222] z-30';
          if (hasFolded) ringClass = 'border-[2px] border-[#222] bg-[#111] opacity-30';

          const stackValue = isActive ? (gameData.stack - gameData.pot / 2).toFixed(1) : gameData?.stack || 100;

          return (
            <div key={seat.id} className={`absolute ${seat.style} flex items-center justify-center`}>
              {seat.id === 'BTN' && <div className="absolute -left-3 -top-1 w-4 h-4 bg-white text-black text-[9px] font-black rounded-full flex items-center justify-center border border-zinc-400 z-50">D</div>}

              <div className={`w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-full flex flex-col items-center justify-center transition-all ${ringClass}`}>
                <span className={isHero ? 'text-white font-bold text-sm' : hasFolded ? 'text-zinc-600 font-bold text-xs' : 'text-zinc-400 font-bold text-xs'}>{seat.id}</span>
                <span className={isHero ? 'text-white text-xs' : hasFolded ? 'hidden' : 'text-zinc-500 text-[10px]'}>{stackValue}</span>
              </div>

              {isHero && gameData.hand.length === 2 && !isSolving && (
                <div className={`absolute top-1/2 -translate-y-1/2 ${seat.cardsPos} flex -space-x-2 z-50`}>
                  <PokerCard card={gameData.hand[0]} size="large" index={0} />
                  <PokerCard card={gameData.hand[1]} size="large" index={1} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <main className="flex-1 overflow-y-auto bg-[#121212] p-6 lg:p-10 relative flex flex-col">
      {/* LOBBY ARENY */}
      {arenaState === 'setup' && (
        <div className="max-w-5xl mx-auto flex flex-col gap-10 mt-4 w-full">

          <div className="flex flex-col gap-2 border-b border-zinc-800 pb-6 mb-2">
            <h2 className="text-4xl font-black text-white flex items-center gap-3">
              <Swords className="text-rose-500 w-10 h-10" /> GTO Arena
            </h2>
            <p className="text-zinc-400 text-lg">Wybierz tryb rywalizacji i walcz o punkty ELO z botami symulującymi graczy.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* 1V1 CARD - Mroczny i agresywny styl */}
            <div className="bg-zinc-900 border-t-4 border-t-rose-500 border-x border-b border-zinc-800 p-8 rounded-2xl flex flex-col gap-6 shadow-[0_0_40px_rgba(225,29,72,0.1)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent pointer-events-none"></div>

              <div className="flex items-center gap-4 z-10">
                <div className="p-3 bg-rose-500/10 rounded-xl"><User className="w-8 h-8 text-rose-500" /></div>
                <div>
                  <h3 className="text-2xl font-black text-white">Pojedynek <span className="text-rose-500">1v1</span></h3>
                  <p className="text-zinc-500 text-sm font-bold">Klasyczny heads-up GTO</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2 z-10">
                {/* Bot 1: Nowicjusz */}
                <button onClick={() => startArena1v1(800)} className="group relative w-full bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/50 p-4 rounded-xl transition-all flex items-center justify-between overflow-hidden cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Shield className="text-emerald-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-zinc-300 group-hover:text-white transition-colors">Nowicjusz</span>
                  </div>
                  <span className="font-mono text-emerald-500/50 font-bold text-xs group-hover:text-emerald-400 transition-colors">800 ELO</span>
                </button>

                {/* Bot 2: Regular */}
                <button onClick={() => startArena1v1(1500)} className="group relative w-full bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/50 p-4 rounded-xl transition-all flex items-center justify-between overflow-hidden cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Zap className="text-blue-500 w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-zinc-300 group-hover:text-white transition-colors">Regular</span>
                  </div>
                  <span className="font-mono text-blue-500/50 font-bold text-xs group-hover:text-blue-400 transition-colors">1500 ELO</span>
                </button>

                {/* Bot 3: Maszyna GTO */}
                <button onClick={() => startArena1v1(2500)} className="group relative w-full bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/30 hover:border-rose-500 p-5 rounded-xl transition-all flex items-center justify-between overflow-hidden shadow-[0_0_15px_rgba(225,29,72,0.1)] cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Cpu className="text-rose-500 w-6 h-6 group-hover:scale-110 transition-transform animate-pulse" />
                    <span className="font-black text-rose-100 transition-colors text-lg">Maszyna GTO</span>
                  </div>
                  <span className="font-mono text-rose-500 font-bold text-sm bg-rose-500/10 px-3 py-1 rounded">2500 ELO</span>
                </button>
              </div>
            </div>

            {/* 1V7 CARD - Złoty, turniejowy styl */}
            <div className="bg-zinc-900 border-t-4 border-t-amber-500 border-x border-b border-zinc-800 p-8 rounded-2xl flex flex-col justify-between gap-6 shadow-[0_0_40px_rgba(245,158,11,0.05)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none"></div>

              <div className="flex flex-col gap-6 z-10 h-full">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl"><Users className="w-8 h-8 text-amber-500" /></div>
                  <div>
                    <h3 className="text-2xl font-black text-white">Battle Royale <span className="text-amber-500">1v7</span></h3>
                    <p className="text-zinc-500 text-sm font-bold">Przetrwanie na pełnym stole (TFT Style)</p>
                  </div>
                </div>

                <p className="text-zinc-400 text-lg leading-relaxed flex-1 mt-4">
                  Zasiądź do stołu pełnego botów o losowym poziomie trudności. Każdy najmniejszy błąd odlicza Twoje cenne punkty życia.
                  Graj czystym GTO, wyeliminuj przeciwników i przetrwaj jako ostatni na stole.
                </p>

                <button onClick={() => startArena1v7()} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 text-lg mt-auto">
                  <Trophy className="w-6 h-6"/> Rozpocznij Turniej
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EKRAN GRY (Arena) */}
      {(arenaState === 'playing1v1' || arenaState === 'playing1v7') && (
        <div className="flex gap-6 h-full w-full max-w-6xl mx-auto flex-col lg:flex-row">

          <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} className="flex-1 flex flex-col gap-6 justify-between pb-4">

            {/* PASKI ZDROWIA 1V1 (Dodano licznik rundy na środku) */}
            {arenaState === 'playing1v1' && (
              <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-4 rounded shrink-0 relative">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-widest">Runda {arenaRound}</div>
                <div className="w-1/3">
                  <span className="text-zinc-100 font-bold text-sm">Hero</span>
                  <div className="h-2 bg-zinc-800 mt-2 rounded-sm overflow-hidden">
                    <motion.div animate={{width: `${heroHP/10}%`}} className="h-full bg-blue-500"/>
                  </div>
                </div>
                <div className="flex flex-col items-center mt-2">
                  <span className="font-mono font-bold text-xl text-zinc-300">{heroHP} : {botHP}</span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Punkty Życia</span>
                </div>
                <div className="w-1/3 text-right">
                  <span className="text-zinc-400 font-bold text-sm">Bot ({botElo})</span>
                  <div className="h-2 bg-zinc-800 mt-2 rounded-sm overflow-hidden flex justify-end">
                    <motion.div animate={{width: `${botHP/10}%`}} className="h-full bg-rose-600"/>
                  </div>
                </div>
              </div>
            )}

            {/* STÓŁ GRY */}
            <div className="w-full flex-1 flex flex-col justify-center">
              {renderOvalTable()}
            </div>

            {/* DYNAMICZNE PRZYCISKI GTO WIZARD */}
            <div className="w-full flex gap-3 mb-2 shrink-0">
              <button disabled={!currentStrategy || feedback.type !== null} onClick={() => arenaState === 'playing1v1' ? handleArena1v1Action(0) : handleArena1v7Action(0)} className="flex-1 py-5 bg-[#4582c3] hover:bg-[#3b70a8] text-white rounded-sm font-bold tracking-wider transition-colors disabled:opacity-30">
                FOLD
              </button>
              <button disabled={!currentStrategy || feedback.type !== null} onClick={() => arenaState === 'playing1v1' ? handleArena1v1Action(1) : handleArena1v7Action(1)} className="flex-1 py-5 bg-[#64b96b] hover:bg-[#539d59] text-white rounded-sm font-bold tracking-wider transition-colors disabled:opacity-30">
                {gameData?.toCall === "0.0" ? 'CHECK' : 'CALL'}
              </button>
              <button disabled={!currentStrategy || feedback.type !== null} onClick={() => arenaState === 'playing1v1' ? handleArena1v1Action(2) : handleArena1v7Action(2)} className="flex-1 py-5 bg-[#ef4c4a] hover:bg-[#d44140] text-white rounded-sm font-bold tracking-wider transition-colors disabled:opacity-30">
                {gameData?.toCall === "0.0" ? 'BET 33%' : 'RAISE 33%'}
              </button>
              <button disabled={!currentStrategy || feedback.type !== null} onClick={() => arenaState === 'playing1v1' ? handleArena1v1Action(3) : handleArena1v7Action(3)} className="flex-1 py-5 bg-[#c22a28] hover:bg-[#a62221] text-white rounded-sm font-bold tracking-wider transition-colors disabled:opacity-30">
                {gameData?.toCall === "0.0" ? 'BET 75%' : 'RAISE 75%'}
              </button>
            </div>

            {/* FEEDBACK */}
            {feedback.msg && (
              <div className={`px-4 py-3 rounded border text-sm font-bold text-center shrink-0 ${feedback.type === 'success' ? 'bg-[#1a2b29] text-emerald-400 border-[#028b7e]' : 'bg-[#2b1a1a] text-rose-400 border-rose-800'}`}>
                {feedback.msg}
              </div>
            )}
          </motion.div>

          {/* LEADERBOARD 1V7 */}
          {arenaState === 'playing1v7' && (
            <div className="w-full lg:w-72 bg-zinc-900 border border-zinc-800 rounded p-4 flex flex-col shrink-0">
              <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                <span className="font-bold text-zinc-300 text-sm flex items-center gap-2">Tabela Liderów <span className="text-zinc-500 font-mono text-xs">(Runda {arenaRound})</span></span>
                <span className="text-xs text-zinc-500 font-mono">Żywi: {aliveCount}/8</span>
              </div>
              <div className="flex flex-col gap-2 relative">
                <AnimatePresence>
                  {players8.map((p: any, i: number) => (
                    <motion.div layout key={p.id} initial={{ opacity: 0 }} animate={{ opacity: p.isDead ? 0.3 : 1 }} className={`p-3 border rounded flex flex-col gap-1.5 ${p.isHero ? 'bg-zinc-800 border-zinc-600' : 'bg-[#18181b] border-zinc-800'}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-zinc-500 w-4 text-xs">{p.isDead ? p.placement : i + 1}.</span>
                          <span className={`font-bold text-xs ${p.isHero ? 'text-white' : 'text-zinc-400'}`}>{p.name}</span>
                        </div>
                        <span className={`font-mono text-xs font-bold ${p.hp < 300 && !p.isDead ? 'text-rose-500' : 'text-zinc-500'}`}>{Math.round(p.hp)} HP</span>
                      </div>
                      <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${p.hp/10}%` }} className={`h-full ${p.isHero ? 'bg-blue-500' : 'bg-zinc-500'}`}/>
                      </div>
                      {p.lastDamage > 0 && !p.isDead && <span className="absolute right-4 text-[10px] text-rose-500 font-bold">-{Math.round(p.lastDamage)}</span>}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}

      {/* EKRAN KOŃCOWY */}
      {arenaState === 'gameover' && (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xl mx-auto flex flex-col items-center gap-4 bg-zinc-900 border border-zinc-800 p-10 rounded mt-10 text-center w-full">
          {arenaPlacement === 1 || arenaWinner === 'hero' ? <Trophy className="w-16 h-16 text-yellow-500" /> : <Skull className="w-16 h-16 text-zinc-600" />}
          <h2 className="text-3xl font-black uppercase text-white">
            {arenaWinner ? (arenaWinner === 'hero' ? 'Zwycięstwo' : 'Porażka') : `Miejsce ${arenaPlacement}`}
          </h2>
          <p className="text-zinc-400 text-sm">
            {arenaEloChange > 0 || arenaWinner === 'hero' ? `Znakomita optymalna gra. Twój ranking ELO rośnie o +${arenaEloChange || 25} pkt.` : `Przeciwnicy popełnili mniej błędów w długim okresie. ELO: ${arenaEloChange || -25} pkt.`}
          </p>
          <button onClick={() => setArenaState('setup')} className="bg-white hover:bg-zinc-200 text-zinc-900 font-bold px-8 py-3 rounded mt-4 transition-colors text-sm">
            Wróć do Lobby
          </button>
        </motion.div>
      )}
    </main>
  );
};
