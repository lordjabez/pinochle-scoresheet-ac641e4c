import { NumberStepper } from "@/components/NumberStepper";
import { Team } from "@/types";

interface MeldPhaseProps {
  team1Meld: number;
  team2Meld: number;
  team1: Team;
  team2: Team;
  onTeam1MeldChange: (value: number) => void;
  onTeam2MeldChange: (value: number) => void;
}

export const MeldPhase = ({
  team1Meld,
  team2Meld,
  team1,
  team2,
  onTeam1MeldChange,
  onTeam2MeldChange,
}: MeldPhaseProps) => {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <h2 className="text-xl font-bold text-amber-400">Meld</h2>
      
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
