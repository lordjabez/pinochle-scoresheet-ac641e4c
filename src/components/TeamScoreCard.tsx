import { Team } from "@/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface TeamScoreCardProps {
  team: Team;
  meldPoints: string;
  tricksPoints: string;
  onTeamChange: (team: Team) => void;
  onMeldChange: (value: string) => void;
  onTricksChange: (value: string) => void;
}

export const TeamScoreCard = ({
  team,
  meldPoints,
  tricksPoints,
  onTeamChange,
  onMeldChange,
  onTricksChange,
}: TeamScoreCardProps) => {
  return (
    <Card className="p-2 sm:p-4 bg-green-800 border-amber-400/20">
      <div className="flex items-center gap-2 mb-2">
        <Input
          type="text"
          value={`${team.players[0]} & ${team.players[1]}`}
          onChange={() => {}} // Read-only display
          className="text-sm sm:text-base font-semibold bg-green-700 border-green-600 text-white h-8 flex-1"
          readOnly
        />
        <div className="text-2xl sm:text-3xl font-bold text-amber-400 min-w-[60px] text-center">
          {team.score}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          value={meldPoints}
          onChange={(e) => onMeldChange(e.target.value)}
          placeholder="Meld"
          className="bg-green-700 border-green-600 text-white h-8 text-sm"
        />
        <Input
          type="number"
          value={tricksPoints}
          onChange={(e) => onTricksChange(e.target.value)}
          placeholder="Tricks"
          className="bg-green-700 border-green-600 text-white h-8 text-sm"
        />
      </div>
    </Card>
  );
};
