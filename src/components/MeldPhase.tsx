import { NumberStepper } from "@/components/NumberStepper";
import { HandStatusBar } from "@/components/HandStatusBar";
import { Team } from "@/types";

interface MeldPhaseProps {
  team1Meld: number;
  team2Meld: number;
  team1: Team;
  team2: Team;
  handNumber: number;
  bid: number;
  bidWinner: string;
  trump: "hearts" | "diamonds" | "clubs" | "spades";
  onTeam1MeldChange: (value: number) => void;
  onTeam2MeldChange: (value: number) => void;
}

export const MeldPhase = ({
  team1Meld,
  team2Meld,
  team1,
  team2,
  handNumber,
  bid,
  bidWinner,
  trump,
  onTeam1MeldChange,
  onTeam2MeldChange,
}: MeldPhaseProps) => {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <HandStatusBar
        handNumber={handNumber}
        phase="Meld"
        bid={bid}
        bidWinner={bidWinner}
        trump={trump}
      />
      
      <div className="grid grid-cols-2 gap-8 w-full max-w-md">
        <NumberStepper
          value={team1Meld}
          onChange={onTeam1MeldChange}
          min={0}
          max={999}
          step={1}
          label={`${team1.players[0]} & ${team1.players[1]}`}
        />
        <NumberStepper
          value={team2Meld}
          onChange={onTeam2MeldChange}
          min={0}
          max={999}
          step={1}
          label={`${team2.players[0]} & ${team2.players[1]}`}
        />
      </div>
    </div>
  );
};
