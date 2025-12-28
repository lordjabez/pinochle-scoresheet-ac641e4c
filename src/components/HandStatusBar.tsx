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
    <div className="flex items-center h-10 px-3 bg-green-700 rounded-lg text-sm w-full">
      <div className="flex items-center justify-center w-[20%]">
        <span className="text-white/70">Hand:</span>
        <span className="text-white font-medium ml-1">{handNumber}</span>
      </div>
      <div className="flex items-center justify-center w-[20%]">
        <span className="text-white/70">Bid:</span>
        <span className="text-white font-medium ml-1">{bid}</span>
      </div>
      <div className="flex items-center justify-center w-[30%]">
        <span className="text-white/70">Winner:</span>
        <span className="text-white font-medium ml-1">{winnerName ?? "—"}</span>
      </div>
      <div className="flex items-center justify-center w-[30%]">
        <span className="text-white/70">Trump:</span>
        {suit ? (
          <span className={`text-lg ${suit.color} bg-white rounded w-6 inline-flex justify-center ml-1`}>
            {suit.symbol}
          </span>
        ) : (
          <span className="text-white font-medium ml-1">—</span>
        )}
      </div>
    </div>
  );
};
