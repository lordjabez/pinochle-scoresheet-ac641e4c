import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Team } from "@/types";

interface BidControlsProps {
  currentBid: string;
  bidWinner: "team1" | "team2";
  trump: "hearts" | "diamonds" | "clubs" | "spades";
  team1: Team;
  team2: Team;
  onBidChange: (value: string) => void;
  onBidWinnerChange: (value: "team1" | "team2") => void;
  onTrumpChange: (value: "hearts" | "diamonds" | "clubs" | "spades") => void;
}

export const BidControls = ({
  currentBid,
  bidWinner,
  trump,
  team1,
  team2,
  onBidChange,
  onBidWinnerChange,
  onTrumpChange,
}: BidControlsProps) => {
  return (
    <div className="mt-2 sm:mt-4 grid grid-cols-3 gap-2">
      <Input
        type="number"
        value={currentBid}
        onChange={(e) => onBidChange(e.target.value)}
        placeholder="Bid"
        className="bg-green-700 border-green-600 text-white h-8 text-sm"
      />
      
      <Select value={bidWinner} onValueChange={onBidWinnerChange}>
        <SelectTrigger className="bg-green-700 border-green-600 text-white h-8 text-sm">
          <SelectValue placeholder="Winner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="team1">{team1.players[0]} & {team1.players[1]}</SelectItem>
          <SelectItem value="team2">{team2.players[0]} & {team2.players[1]}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={trump} onValueChange={onTrumpChange}>
        <SelectTrigger className="bg-green-700 border-green-600 text-white h-8 text-sm">
          <SelectValue placeholder="Trump" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="hearts"><span className="text-red-500">♥</span> Hearts</SelectItem>
          <SelectItem value="diamonds"><span className="text-red-500">♦</span> Diamonds</SelectItem>
          <SelectItem value="clubs">♣ Clubs</SelectItem>
          <SelectItem value="spades">♠ Spades</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
