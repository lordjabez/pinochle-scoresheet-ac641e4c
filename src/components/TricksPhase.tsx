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
}: TricksPhaseProps) => {
  // Auto-balance: team2Tricks = 25 - team1Tricks
  const handleTeam1Change = (value: number) => {
    onTeam1TricksChange(value);
  };

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
          onChange={handleTeam1Change}
          min={0}
          max={25}
          step={1}
          label={`${team1.players[0]} & ${team1.players[1]}`}
        />
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm text-amber-400 font-medium">{team2.players[0]} & {team2.players[1]}</span>
          <div className="flex items-center justify-center h-10">
            <div className="text-3xl font-bold text-white min-w-[60px] text-center tabular-nums">
              {team2Tricks}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
