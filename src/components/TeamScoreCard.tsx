
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
    <Card className="p-4 sm:p-6 bg-green-800 border-yellow-300/20">
      <div className="space-y-3 sm:space-y-4">
        <Input
          type="text"
          value={team.name}
          onChange={(e) => onTeamChange({ ...team, name: e.target.value })}
          className="text-base sm:text-lg font-semibold bg-green-700 border-green-600 text-white"
        />
        <div className="text-3xl sm:text-4xl font-bold text-center text-yellow-300">
          {team.score}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={meldPoints}
            onChange={(e) => onMeldChange(e.target.value)}
            placeholder="Meld points"
            className="bg-green-700 border-green-600 text-white"
          />
          <Input
            type="number"
            value={tricksPoints}
            onChange={(e) => onTricksChange(e.target.value)}
            placeholder="Trick points"
            className="bg-green-700 border-green-600 text-white"
          />
        </div>
      </div>
    </Card>
  );
};
