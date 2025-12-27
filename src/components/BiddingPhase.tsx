import { NumberStepper } from "@/components/NumberStepper";
import { Button } from "@/components/ui/button";
import { Team } from "@/types";

interface BiddingPhaseProps {
  bid: number;
  bidWinner: "team1" | "team2" | null;
  trump: "hearts" | "diamonds" | "clubs" | "spades" | null;
  team1: Team;
  team2: Team;
  onBidChange: (value: number) => void;
  onBidWinnerChange: (value: "team1" | "team2") => void;
  onTrumpChange: (value: "hearts" | "diamonds" | "clubs" | "spades") => void;
}

const suits = [
  { value: "spades" as const, symbol: "♠", color: "text-black" },
  { value: "hearts" as const, symbol: "♥", color: "text-red-500" },
  { value: "diamonds" as const, symbol: "♦", color: "text-red-500" },
  { value: "clubs" as const, symbol: "♣", color: "text-black" },
];

export const BiddingPhase = ({
  bid,
  bidWinner,
  trump,
  team1,
  team2,
  onBidChange,
  onBidWinnerChange,
  onTrumpChange,
}: BiddingPhaseProps) => {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-xl font-bold text-amber-400">Bidding</h2>
      
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
        <span className="text-sm text-amber-400 font-medium">Bid Winner</span>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => onBidWinnerChange("team1")}
            className={`px-4 py-2 h-10 font-semibold transition-colors ${
              bidWinner === "team1"
                ? "bg-amber-400 text-green-900 [@media(hover:hover)]:hover:bg-amber-500"
                : "bg-green-700 text-white border border-green-600 [@media(hover:hover)]:hover:bg-green-600"
            }`}
          >
            {team1.name}
          </Button>
          <Button
            type="button"
            onClick={() => onBidWinnerChange("team2")}
            className={`px-4 py-2 h-10 font-semibold transition-colors ${
              bidWinner === "team2"
                ? "bg-amber-400 text-green-900 [@media(hover:hover)]:hover:bg-amber-500"
                : "bg-green-700 text-white border border-green-600 [@media(hover:hover)]:hover:bg-green-600"
            }`}
          >
            {team2.name}
          </Button>
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
              className={`h-12 w-12 text-2xl font-bold transition-colors ${
                trump === suit.value
                  ? "bg-amber-400 [@media(hover:hover)]:hover:bg-amber-500"
                  : "bg-green-700 border border-green-600 [@media(hover:hover)]:hover:bg-green-600"
              }`}
            >
              <span className={trump === suit.value ? "text-green-900" : suit.color}>
                {suit.symbol}
              </span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
