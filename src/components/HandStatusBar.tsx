import { Team } from "@/types";

interface HandStatusBarProps {
  handNumber: number;
  phase: "Bidding" | "Meld" | "Tricks";
  bid: number;
  bidWinnerTeam: "team1" | "team2" | null;
  bidWinnerPlayerIndex: 0 | 1 | null;
  trump: "hearts" | "diamonds" | "clubs" | "spades" | null;
  team1: Team;
  team2: Team;
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
  bidWinnerTeam,
  bidWinnerPlayerIndex,
  trump,
  team1,
  team2,
}: HandStatusBarProps) => {
  const suit = trump ? suitSymbols[trump] : null;
  
  // Look up the winner name dynamically from current team data
  const getWinnerName = () => {
    if (bidWinnerTeam === null || bidWinnerPlayerIndex === null) return null;
    const team = bidWinnerTeam === "team1" ? team1 : team2;
    return team.players[bidWinnerPlayerIndex];
  };
  
  const winnerName = getWinnerName();
  
  return (
    <div className="flex items-center justify-center gap-4 py-2 px-3 bg-green-700 rounded-lg text-sm w-full h-10">
      <span className="text-white font-medium">
        Hand {handNumber} - {phase}
      </span>
      <span className="text-white/40">•</span>
      <span className="text-white/70">
        Bid <span className="text-white font-medium">{bid}</span>
      </span>
      {winnerName && (
        <>
          <span className="text-white/40">•</span>
          <span className="text-white/70">
            Winner <span className="text-white font-medium">{winnerName}</span>
          </span>
        </>
      )}
      {suit && (
        <>
          <span className="text-white/40">•</span>
          <span className="text-white/70">Trump</span>
          <span className={`text-lg ${suit.color} bg-white rounded w-6 inline-flex justify-center`}>
            {suit.symbol}
          </span>
        </>
      )}
    </div>
  );
};
