interface HandStatusBarProps {
  handNumber: number;
  phase: "Bidding" | "Meld" | "Tricks";
  bid: number;
  bidWinner: string | null;
  trump: "hearts" | "diamonds" | "clubs" | "spades" | null;
}

const suitSymbols = {
  spades: { symbol: "♠", color: "text-black" },
  diamonds: { symbol: "♦", color: "text-red-500" },
  clubs: { symbol: "♣", color: "text-black" },
  hearts: { symbol: "♥", color: "text-red-500" },
};

export const HandStatusBar = ({
  handNumber,
  phase,
  bid,
  bidWinner,
  trump,
}: HandStatusBarProps) => {
  const suit = trump ? suitSymbols[trump] : null;
  
  return (
    <div className="flex items-center justify-center gap-4 py-2 px-3 bg-green-700 rounded-lg text-sm">
      <span className="text-white font-medium">
        Hand {handNumber} - {phase}
      </span>
      <span className="text-white/40">•</span>
      <span className="text-white/70">
        Bid <span className="text-white font-medium">{bid}</span>
      </span>
      {bidWinner && (
        <>
          <span className="text-white/40">•</span>
          <span className="text-white/70">
            Winner <span className="text-white font-medium">{bidWinner}</span>
          </span>
        </>
      )}
      {suit && (
        <>
          <span className="text-white/40">•</span>
          <span className="text-white/70">Trump</span>
          <span className={`text-lg ${suit.color} bg-white rounded px-1`}>
            {suit.symbol}
          </span>
        </>
      )}
    </div>
  );
};
