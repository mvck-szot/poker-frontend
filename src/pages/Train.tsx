import { Loader2, Terminal, Copy, Check, RotateCcw, Wrench, Trash2, Sparkles, XSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PokerCard, EmptyCardSlot } from '../components/PokerCard';
import { parseScenario } from '../utils/poker';

const suits = ['s', 'h', 'd', 'c'];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

export const Train = (props: any) => {
  const {
    trainMode, showCustomBuilder, isSolving, currentHand, feedback, currentStrategy,
    handleAction, exportReport, isCopied, actionLogs, customHero, customBoard,
    customPosition, setCustomPosition, customHistory, setCustomHistory, toggleCustomCard,
    clearCustomBuilder, analyzeCustom, isCustomValid, loadNewRandomHand
  } = props;

  const gameData = currentHand ? parseScenario(currentHand) : null;

  // Stół do trybu Custom Board (wybór pozycji)
  const renderCustomTable = () => {
    const seats = [
      { id: 'UTG', style: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2' },
      { id: 'HJ', style: 'top-[20%] right-0 translate-x-1/2' },
      { id: 'CO', style: 'bottom-[20%] right-0 translate-x-1/2' },
      { id: 'BTN', style: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2' },
      { id: 'SB', style: 'bottom-[20%] left-0 -translate-x-1/2' },
      { id: 'BB', style: 'top-[20%] left-0 -translate-x-1/2' },
    ];
    return (
      <div className="relative w-full max-w-lg mx-auto h-40 sm:h-56 mt-10 mb-8">
        <div className="absolute inset-0 bg-zinc-900 border-2 border-zinc-800 rounded-full flex items-center justify-center">
             <span className="text-zinc-700 font-bold text-xl tracking-widest uppercase">6-MAX</span>
        </div>
        {seats.map(seat => (
          <button key={seat.id} onClick={() => setCustomPosition(seat.id)} className={`absolute ${seat.style} w-12 h-12 sm:w-14 sm:h-14 rounded-full flex flex-col items-center justify-center font-bold text-xs transition-all ${customPosition === seat.id ? 'bg-white text-zinc-950 shadow-md scale-110 z-10' : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:bg-zinc-700 z-0'}`}>
            {seat.id}
          </button>
        ))}
      </div>
    );
  };

  // Stół GTO Wizard (Losowe rozdania)
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
      <div className="relative w-full max-w-4xl mx-auto aspect-[2.3/1] border-[3px] border-[#2a2a2a] rounded-[100%] flex flex-col items-center justify-center my-16 bg-[#161616] shadow-2xl">

        {/* CENTER INFO */}
        {gameData && !isSolving && (
          <div className="flex flex-col items-center justify-center relative z-20">
            <span className="text-[#888] font-bold text-sm mb-1 tracking-wide">
              {gameData.spotTitle || "Custom Board"} <span className="font-normal opacity-50 ml-1">{gameData.stack}bb</span>
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
          const hasFolded = gameData && !isActive && gameData.spotTitle !== "Custom Board";

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
    <>
      <main className="flex-1 overflow-y-auto bg-[#121212] p-6 lg:p-10 relative flex flex-col">
        {/* WIDOK CUSTOM BUILDERA */}
        {trainMode === 'custom' && showCustomBuilder && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto flex flex-col gap-8 w-full">
            <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">Kreator Scenariuszy</h2>
                <p className="text-zinc-500 text-sm">Wprowadź parametry rozdania do silnika GTO.</p>
              </div>
            </div>

            {renderCustomTable()}

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase text-zinc-500">Sekwencja akcji</span>
              <div className="flex gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded flex-wrap">
                  <button onClick={() => setCustomHistory((p:any) => p + 'F')} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded font-bold text-xs transition-colors">Fold (F)</button>
                  <button onClick={() => setCustomHistory((p:any) => p + 'C')} className="px-4 py-2 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 rounded font-bold text-xs transition-colors">Call (C)</button>
                  <button onClick={() => setCustomHistory((p:any) => p + 'R')} className="px-4 py-2 bg-rose-900/30 hover:bg-rose-900/50 text-rose-400 rounded font-bold text-xs transition-colors">Raise (R)</button>
                  <div className="flex-1 px-4 py-2 font-mono text-zinc-300 tracking-widest text-lg bg-[#0a0a0a] rounded flex items-center border border-zinc-800/50">
                      {customHistory || <span className="text-zinc-700 text-sm">Brak akcji...</span>}
                  </div>
                  <button onClick={() => setCustomHistory((p:any) => p.slice(0, -1))} className="p-3 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded transition-colors"><RotateCcw className="w-4 h-4"/></button>
              </div>
            </div>

            <div className="flex gap-6 mt-2">
              <div className="flex-1 bg-zinc-900 border border-zinc-800 p-5 rounded flex flex-col gap-4">
                <div className="flex justify-between items-center"><span className="text-xs font-bold uppercase text-zinc-400">Hero</span><span className="text-xs font-mono text-zinc-600">{customHero.length}/2</span></div>
                <div className="flex gap-2">
                  {customHero.length >= 1 ? <PokerCard card={customHero[0]} size="mini" onClick={() => toggleCustomCard(customHero[0])} isSelected labelHighlight="hero"/> : <EmptyCardSlot label="" size="mini" />}
                  {customHero.length >= 2 ? <PokerCard card={customHero[1]} size="mini" onClick={() => toggleCustomCard(customHero[1])} isSelected labelHighlight="hero"/> : <EmptyCardSlot label="" size="mini" />}
                </div>
              </div>
              <div className="flex-[2] bg-zinc-900 border border-zinc-800 p-5 rounded flex flex-col gap-4">
                <div className="flex justify-between items-center"><span className="text-xs font-bold uppercase text-zinc-400">Board</span><span className="text-xs font-mono text-zinc-600">{customBoard.length}/5</span></div>
                <div className="flex gap-2">
                  {customBoard.length >= 1 ? <PokerCard card={customBoard[0]} size="mini" onClick={() => toggleCustomCard(customBoard[0])} isSelected labelHighlight="board"/> : <EmptyCardSlot label="" size="mini" />}
                  {customBoard.length >= 2 ? <PokerCard card={customBoard[1]} size="mini" onClick={() => toggleCustomCard(customBoard[1])} isSelected labelHighlight="board"/> : <EmptyCardSlot label="" size="mini" />}
                  {customBoard.length >= 3 ? <PokerCard card={customBoard[2]} size="mini" onClick={() => toggleCustomCard(customBoard[2])} isSelected labelHighlight="board"/> : <EmptyCardSlot label="" size="mini" />}
                  <div className="w-px h-full bg-zinc-800 mx-1"></div>
                  {customBoard.length >= 4 ? <PokerCard card={customBoard[3]} size="mini" onClick={() => toggleCustomCard(customBoard[3])} isSelected labelHighlight="board"/> : <EmptyCardSlot label="" size="mini" />}
                  {customBoard.length >= 5 ? <PokerCard card={customBoard[4]} size="mini" onClick={() => toggleCustomCard(customBoard[4])} isSelected labelHighlight="board"/> : <EmptyCardSlot label="" size="mini" />}
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-zinc-400">Matrix Kart</span>
                <button onClick={clearCustomBuilder} className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"><Trash2 className="w-3 h-3" /> Zresetuj</button>
              </div>
              <div className="flex flex-col gap-2">
                {suits.map(suit => {
                  const suitInfo: Record<string, {sym: string, color: string}> = { 's': {sym: '♠', color: 'text-zinc-600'}, 'h': {sym: '♥', color: 'text-rose-600'}, 'd': {sym: '♦', color: 'text-blue-500'}, 'c': {sym: '♣', color: 'text-emerald-600'} };
                  return (
                    <div key={suit} className="flex gap-4 items-center bg-[#0f0f0f] p-2 rounded border border-zinc-800/50">
                      <div className={`w-8 text-center text-2xl ${suitInfo[suit].color}`}>{suitInfo[suit].sym}</div>
                      <div className="flex gap-1.5 flex-wrap">
                        {ranks.map(rank => {
                          const card = `${rank}${suit}`; const isHero = customHero.includes(card); const isBoard = customBoard.includes(card);
                          return <PokerCard key={card} card={card} size="mini" onClick={() => toggleCustomCard(card)} isSelected={isHero || isBoard} labelHighlight={isHero ? "hero" : "board"} />
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <button disabled={!isCustomValid} onClick={analyzeCustom} className="w-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold py-4 rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mb-20">
              {isCustomValid ? 'Rozpocznij Analizę GTO' : 'Skompletuj Karty'}
            </button>
          </motion.div>
        )}

        {/* WIDOK GŁÓWNY TRENINGU (Z owalnym stołem i dynamicznymi przyciskami) */}
        {!showCustomBuilder && (
           <div className="flex-1 flex flex-col items-center justify-between w-full max-w-5xl mx-auto pb-4">

              <div className="w-full flex-1 flex flex-col justify-center">
                {renderOvalTable()}
              </div>

              {/* DYNAMICZNE PRZYCISKI GTO WIZARD */}
              <div className="w-full flex gap-3 mb-6">
                <button disabled={!currentStrategy || feedback.type !== null} onClick={() => handleAction(0, 'FOLD')} className="flex-1 py-5 bg-[#4582c3] hover:bg-[#3b70a8] text-white rounded-sm font-bold tracking-wider transition-colors disabled:opacity-30">
                  FOLD
                </button>
                <button disabled={!currentStrategy || feedback.type !== null} onClick={() => handleAction(1, gameData?.toCall === "0.0" ? 'CHECK' : 'CALL')} className="flex-1 py-5 bg-[#64b96b] hover:bg-[#539d59] text-white rounded-sm font-bold tracking-wider transition-colors disabled:opacity-30">
                  {gameData?.toCall === "0.0" ? 'CHECK' : 'CALL'}
                </button>
                <button disabled={!currentStrategy || feedback.type !== null} onClick={() => handleAction(2, gameData?.toCall === "0.0" ? 'BET 33%' : 'RAISE 33%')} className="flex-1 py-5 bg-[#ef4c4a] hover:bg-[#d44140] text-white rounded-sm font-bold tracking-wider transition-colors disabled:opacity-30">
                  {gameData?.toCall === "0.0" ? 'BET 33%' : 'RAISE 33%'}
                </button>
                <button disabled={!currentStrategy || feedback.type !== null} onClick={() => handleAction(3, gameData?.toCall === "0.0" ? 'BET 75%' : 'RAISE 75%')} className="flex-1 py-5 bg-[#c22a28] hover:bg-[#a62221] text-white rounded-sm font-bold tracking-wider transition-colors disabled:opacity-30">
                  {gameData?.toCall === "0.0" ? 'BET 75%' : 'RAISE 75%'}
                </button>
              </div>

              {/* FEEDBACK I LOGI */}
              <div className="w-full flex gap-4">
                {feedback.msg ? (
                  <div className={`flex-1 flex items-center justify-center rounded-sm border font-bold text-sm ${feedback.type === 'success' ? 'bg-[#1a2b29] text-emerald-400 border-[#028b7e]' : 'bg-[#2b1a1a] text-rose-400 border-rose-800'}`}>
                    {feedback.msg}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900/50 text-zinc-500 text-sm font-bold">
                    Oczekuję na Twój ruch...
                  </div>
                )}

                <div className="w-1/3 bg-[#161616] border border-zinc-800 p-3 rounded-sm font-mono text-xs flex flex-col h-24">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2 shrink-0">
                    <span className="font-bold text-zinc-500 uppercase">Log zdarzeń</span>
                    <button onClick={exportReport} disabled={!currentStrategy || isSolving} className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors disabled:opacity-30">
                      {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3"/>}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 overflow-y-auto text-zinc-400">
                      {actionLogs.slice(-2).map((log: string, i: number) => (
                        <div key={i} className="truncate">{log}</div>
                      ))}
                  </div>
                </div>
              </div>
           </div>
        )}
      </main>
    </>
  );
};
