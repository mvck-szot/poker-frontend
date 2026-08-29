import { motion } from 'framer-motion';

export const PokerCard = ({ card, size = "normal", onClick, isSelected, labelHighlight, index = 0 }: any) => {
  if (!card || card.length < 2) return <EmptyCardSlot label="" size={size} />;

  const r = card.slice(0, -1);
  const s = card.slice(-1);

  // Klasyczna talia GTO Wizard (Pełne tło, biały tekst)
  const suitsMap: Record<string, { sym: string; bg: string }> = {
    'h': { sym: '♥', bg: 'bg-[#cf3532]' },
    'd': { sym: '♦', bg: 'bg-[#2956b2]' },
    'c': { sym: '♣', bg: 'bg-[#2d7d45]' },
    's': { sym: '♠', bg: 'bg-[#3b3b3b]' }
  };

  const { sym, bg } = suitsMap[s.toLowerCase()];

  const Content = () => {
    if (size === "mini") {
      let hc = "bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-400";
      if (isSelected) hc = `border-2 border-white ${bg} text-white opacity-100`;

      return (
        <div onClick={onClick} className={`w-10 h-14 rounded border flex flex-col items-center justify-center cursor-pointer select-none transition-colors ${hc}`}>
          <span className={`font-bold text-sm leading-none ${isSelected ? 'text-white' : ''}`}>{r}</span>
          <span className={`text-base leading-none ${isSelected ? 'text-white' : ''}`}>{sym}</span>
        </div>
      );
    }

    if (size === "normal") {
      return (
        <div className={`w-8 h-12 ${bg} text-white rounded border border-black/20 flex flex-col items-center justify-center p-1 shadow-sm select-none`}>
          <span className="font-bold text-sm leading-none">{r}</span>
          <span className="text-base leading-none">{sym}</span>
        </div>
      );
    }

    // GTO Wizard Style Card (Duża na stół) - USUNIĘTO -ml-2
    return (
      <div className={`w-14 h-20 lg:w-16 lg:h-[90px] ${bg} text-white rounded-md border border-black/30 flex flex-col p-2 shadow-lg select-none relative`}>
        <span className="font-black text-xl lg:text-2xl leading-none">{r}</span>
        <span className="text-2xl lg:text-3xl leading-none opacity-90 absolute bottom-2 right-2">{sym}</span>
      </div>
    );
  };

  if (size === "large") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="hover:-translate-y-2 transition-transform duration-200 cursor-pointer"
      >
        <Content />
      </motion.div>
    );
  }

  return <Content />;
};

export const EmptyCardSlot = ({ label, size = "large" }: any) => {
  if (size === "mini") return <div className="w-10 h-14 rounded border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 font-bold text-[9px] tracking-widest uppercase bg-zinc-900/50">{label}</div>;
  return <div className="w-14 h-20 lg:w-16 lg:h-[90px] rounded-md border border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 font-bold text-[10px] tracking-widest uppercase bg-[#141414]">{label}</div>;
};
