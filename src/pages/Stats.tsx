import { Activity, Trash2, Lightbulb, Trophy, Swords, Users, Crosshair } from 'lucide-react';
import { PokerCard } from '../components/PokerCard';

export const Stats = ({ eloTrain, elo1v1, elo1v7, eloHistory, handHistory, handsPlayed, resetStats }: any) => {
  const minElo = Math.min(...eloHistory) - 50;
  const maxElo = Math.max(...eloHistory) + 50;
  const eloRange = maxElo - minElo;
  const correctHands = handHistory.filter((h: any) => h.isCorrect).length;
  const accuracy = handsPlayed === 0 ? 0 : Math.round((correctHands / handsPlayed) * 100);

  const generateChartPath = () => {
    if (eloHistory.length <= 1) return `M 0,50 L 100,50`;
    return eloHistory.map((val: number, index: number) => {
      const x = (index / (eloHistory.length - 1)) * 100;
      const y = 100 - (((val - minElo) / eloRange) * 100);
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    }).join(' ');
  };

  const getCoachInsights = () => {
    if (handHistory.length < 5) return [{ text: "Rozegraj minimum 5 rąk do pełnej analizy.", type: "neutral" }];
    let passive = 0, nitty = 0, aggro = 0;

    handHistory.forEach((h: any) => {
       if (!h.isCorrect) {
         if (h.action === 'CALL' && h.optimal.includes('RAISE')) passive++;
         if (h.action === 'FOLD' && (h.optimal === 'CALL' || h.optimal.includes('RAISE'))) nitty++;
         if (h.action.includes('RAISE') && (h.optimal === 'FOLD' || h.optimal === 'CALL')) aggro++;
       }
    });

    const insights = [];
    const total = handHistory.length;
    const acc = correctHands / total;

    if (acc > 0.8) insights.push({ text: "Grasz solidnie, bardzo niskie odchylenie od strategii optymalnej.", type: "good" });
    if (passive / total > 0.15) insights.push({ text: "Wykryto pasywność. Zbyt często sprawdzasz zamiast podbijać (utrata fold equity).", type: "warning" });
    if (nitty / total > 0.15) insights.push({ text: "Zjawisko over-folding. Zbyt często pasujesz układy o dodatnim EV.", type: "warning" });
    if (aggro / total > 0.15) insights.push({ text: "Nadmierna agresja. Wykonujesz raise z układami marginalnymi.", type: "warning" });
    if (insights.length === 0) insights.push({ text: "Trzymasz stabilny poziom, brak rażących błędów systemowych.", type: "good" });

    return insights;
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">Profil Analityczny</h2>
          <p className="text-zinc-500 text-sm">Śledź swój rozwój ELO i eliminuj błędy systematyczne.</p>
        </div>
        <button onClick={resetStats} className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded text-xs font-bold transition-colors">
          <Trash2 className="w-3 h-3"/> Reset Danych
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded p-5 flex flex-col gap-1">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1.5"><Trophy className="w-3 h-3"/> Trening</span>
          <span className="text-2xl font-bold font-mono text-zinc-100">{eloTrain}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-5 flex flex-col gap-1">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1.5"><Swords className="w-3 h-3"/> Arena 1v1</span>
          <span className="text-2xl font-bold font-mono text-zinc-100">{elo1v1}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-5 flex flex-col gap-1">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1.5"><Users className="w-3 h-3"/> Arena 1v7</span>
          <span className="text-2xl font-bold font-mono text-zinc-100">{elo1v7}</span>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded p-5 flex flex-col gap-1">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1.5"><Crosshair className="w-3 h-3"/> GTO Accuracy</span>
          <span className="text-2xl font-bold font-mono text-blue-500">{accuracy}%</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-[2] bg-zinc-900 border border-zinc-800 rounded p-6 flex flex-col gap-4">
          <span className="font-bold text-zinc-400 text-sm">Wykres Progresu (Trening)</span>
          <div className="w-full h-48 relative border-b border-l border-zinc-800 mt-2">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <path d={generateChartPath()} fill="none" stroke="#3b82f6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              <line x1="0" y1={100 - (((1000 - minElo) / eloRange) * 100)} x2="100" y2={100 - (((1000 - minElo) / eloRange) * 100)} stroke="#3f3f46" strokeWidth="1" strokeDasharray="2" vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="absolute top-0 left-[-35px] text-[9px] font-mono text-zinc-500">{maxElo}</div>
            <div className="absolute bottom-0 left-[-35px] text-[9px] font-mono text-zinc-500">{minElo}</div>
          </div>
        </div>

        <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded p-6 flex flex-col gap-4">
          <span className="font-bold text-zinc-400 text-sm flex items-center gap-2"><Lightbulb className="w-4 h-4"/> AI Coach</span>
          <div className="flex flex-col gap-2">
            {getCoachInsights().map((insight, idx) => (
              <div key={idx} className={`p-3 border-l-2 rounded-r text-xs leading-relaxed ${insight.type === 'good' ? 'bg-emerald-900/10 border-emerald-500/50 text-emerald-200' : insight.type === 'warning' ? 'bg-rose-900/10 border-rose-500/50 text-rose-200' : 'bg-zinc-800/50 border-zinc-600 text-zinc-400'}`}>
                {insight.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded overflow-hidden flex flex-col">
        <div className="p-4 border-b border-zinc-800 bg-[#18181b]">
          <span className="font-bold text-zinc-400 text-sm">Historia Rozdań</span>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-[10px] uppercase bg-[#18181b] border-b border-zinc-800 text-zinc-500 tracking-widest font-bold">
              <tr>
                <th className="px-5 py-3">Faza</th>
                <th className="px-5 py-3">Ręka</th>
                <th className="px-5 py-3">Stół</th>
                <th className="px-5 py-3 text-center">Ruch</th>
                <th className="px-5 py-3 text-center">GTO</th>
                <th className="px-5 py-3 text-right">EV Loss</th>
              </tr>
            </thead>
            <tbody>
              {handHistory.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-zinc-600 italic text-xs">Brak zapisanych rozdań.</td></tr>
              ) : (
                handHistory.map((hand: any) => (
                  <tr key={hand.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs">{hand.street}</td>
                    <td className="px-5 py-3"><div className="flex gap-1">{hand.heroCards.map((c: string, i: number) => <PokerCard card={c} key={i} size="normal"/>)}</div></td>
                    <td className="px-5 py-3"><div className="flex gap-1">{hand.boardCards.length > 0 ? hand.boardCards.map((c: string, i: number) => <PokerCard card={c} key={i} size="normal"/>) : <span className="text-zinc-700">-</span>}</div></td>
                    <td className="px-5 py-3 text-center font-bold text-xs"><span className={hand.action === 'FOLD' ? 'text-zinc-500' : hand.action === 'CALL' ? 'text-blue-400' : 'text-emerald-400'}>{hand.action}</span></td>
                    <td className="px-5 py-3 text-center font-bold text-xs text-zinc-600">{hand.optimal}</td>
                    <td className="px-5 py-3 text-right font-mono text-xs font-bold">{hand.isCorrect ? <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">0.00</span> : <span className="text-rose-500 bg-rose-500/10 px-2 py-1 rounded">-{hand.evDiff}</span>}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
