import { NumberStepper } from "@/components/NumberStepper";
import { HandStatusBar } from "@/components/HandStatusBar";
import { Team } from "@/types";

interface TricksPhaseProps {
  team1Tricks: number;
  team2Tricks: number;
  team1: Team;
  team2: Team;
  handNumber: number;
  bid: number;
  bidWinnerTeam: "team1" | "team2";
  bidWinnerPlayerIndex: 0 | 1;
  trump: "hearts" | "diamonds" | "clubs" | "spades";
  onTeam1TricksChange: (value: number) => void;
  onTeam2TricksChange: (value: number) => void;
}

export const TricksPhase = ({
  team1Tricks,
  team2Tricks,
  team1,
  team2,
  handNumber,
  bid,
  bidWinnerTeam,
  bidWinnerPlayerIndex,
  trump,
  onTeam1TricksChange,
  onTeam2TricksChange,
}: TricksPhaseProps) => {
  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <HandStatusBar
        handNumber={handNumber}
        phase="Tricks"
        bid={bid}
        bidWinnerTeam={bidWinnerTeam}
        bidWinnerPlayerIndex={bidWinnerPlayerIndex}
        trump={trump}
        team1={team1}
        team2={team2}
      />
      
      <div className="grid grid-cols-2 gap-8 w-full max-w-md">
        <NumberStepper
          value={team1Tricks}
          onChange={onTeam1TricksChange}
          min={0}
          max={25}
          step={1}
          label={`${team1.players[0]} & ${team1.players[1]}`}
        />
        <NumberStepper
          value={team2Tricks}
          onChange={onTeam2TricksChange}
          min={0}
          max={25}
          step={1}
          label={`${team2.players[0]} & ${team2.players[1]}`}
        />
      </div>
    </div>
  );
};
