import { NumberStepper } from "@/components/NumberStepper";
import { Button } from "@/components/ui/button";
import { Team } from "@/types";

interface BiddingPhaseProps {
  bid: number;
  bidWinnerTeam: "team1" | "team2" | null;
  bidWinnerPlayerIndex: 0 | 1 | null;
  trump: "hearts" | "diamonds" | "clubs" | "spades" | null;
  team1: Team;
  team2: Team;
  handNumber: number;
  onBidChange: (value: number) => void;
  onBidWinnerChange: (playerIndex: 0 | 1, team: "team1" | "team2") => void;
  onTrumpChange: (value: "hearts" | "diamonds" | "clubs" | "spades") => void;
}

const suits = [
  { value: "spades" as const, symbol: "♠", color: "text-black" },
  { value: "diamonds" as const, symbol: "♦", color: "text-red-500" },
  { value: "clubs" as const, symbol: "♣", color: "text-black" },
  { value: "hearts" as const, symbol: "♥", color: "text-red-500" },
];

export const BiddingPhase = ({
  bid,
  bidWinnerTeam,
  bidWinnerPlayerIndex,
  trump,
  team1,
  team2,
  onBidChange,
  onBidWinnerChange,
  onTrumpChange,
}: BiddingPhaseProps) => {
  // All 4 players for bid winner selection
  const players = [
    { name: team1.players[0], team: "team1" as const, playerIndex: 0 as const },
    { name: team1.players[1], team: "team1" as const, playerIndex: 1 as const },
    { name: team2.players[0], team: "team2" as const, playerIndex: 0 as const },
    { name: team2.players[1], team: "team2" as const, playerIndex: 1 as const },
  ];

  const isSelected = (team: "team1" | "team2", playerIndex: 0 | 1) => {
    return bidWinnerTeam === team && bidWinnerPlayerIndex === playerIndex;
  };

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      {/* Bid Value */}
      <NumberStepper
        value={bid}
        onChange={onBidChange}
        min={15}
        max={100}
        step={1}
        label="Bid"
      />

      {/* Bid Winner Selection */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-amber-400 font-medium">Winner</span>
        <div className="grid grid-cols-2 gap-2">
          {players.map((player) => (
            <Button
              key={`${player.team}-${player.playerIndex}`}
              type="button"
              onClick={() => onBidWinnerChange(player.playerIndex, player.team)}
              className={`w-[8rem] h-10 font-semibold transition-colors ${
                isSelected(player.team, player.playerIndex)
                  ? "bg-amber-400 text-green-900 [@media(hover:hover)]:hover:bg-amber-500"
                  : "bg-green-700 text-white border border-green-600 [@media(hover:hover)]:hover:bg-green-600"
              }`}
            >
              {player.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Trump Selection */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-amber-400 font-medium">Trump</span>
        <div className="flex gap-2">
          {suits.map((suit) => (
            <Button
              key={suit.value}
              type="button"
              onClick={() => onTrumpChange(suit.value)}
              className={`h-12 w-14 font-bold transition-colors ${
                trump === suit.value
                  ? "bg-amber-400 [@media(hover:hover)]:hover:bg-amber-500"
                  : "bg-green-700 border border-green-600 [@media(hover:hover)]:hover:bg-green-600"
              }`}
            >
              <span className={`text-lg ${suit.color} bg-white rounded w-6 inline-flex justify-center`}>
                {suit.symbol}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
