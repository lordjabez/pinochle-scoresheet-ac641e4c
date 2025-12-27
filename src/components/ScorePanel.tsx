import { Team, Hand } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ScorePanelProps {
  team1: Team;
  team2: Team;
  hands: Hand[];
  onTeam1PlayersChange: (players: [string, string]) => void;
  onTeam2PlayersChange: (players: [string, string]) => void;
}

export const ScorePanel = ({
  team1,
  team2,
  hands,
  onTeam1PlayersChange,
  onTeam2PlayersChange,
}: ScorePanelProps) => {
  return (
    <div className="bg-green-800 border border-amber-400/20 rounded-lg p-3">
      {/* Team scores - two column layout: names left, scores right */}
      <div className="flex flex-col gap-3">
        {/* Team 1 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 flex-1">
            <Input
              type="text"
              value={team1.players[0]}
              onChange={(e) => onTeam1PlayersChange([e.target.value, team1.players[1]])}
              className="text-sm font-semibold bg-green-700 border-green-600 text-white h-7 flex-1"
              placeholder="Player 1"
            />
            <Input
              type="text"
              value={team1.players[1]}
              onChange={(e) => onTeam1PlayersChange([team1.players[0], e.target.value])}
              className="text-sm font-semibold bg-green-700 border-green-600 text-white h-7 flex-1"
              placeholder="Player 2"
            />
          </div>
          <div className="text-3xl font-bold text-amber-400 min-w-[60px] text-right">
            {team1.score}
          </div>
        </div>

        {/* Team 2 */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-2 flex-1">
            <Input
              type="text"
              value={team2.players[0]}
              onChange={(e) => onTeam2PlayersChange([e.target.value, team2.players[1]])}
              className="text-sm font-semibold bg-green-700 border-green-600 text-white h-7 flex-1"
              placeholder="Player 3"
            />
            <Input
              type="text"
              value={team2.players[1]}
              onChange={(e) => onTeam2PlayersChange([team2.players[0], e.target.value])}
              className="text-sm font-semibold bg-green-700 border-green-600 text-white h-7 flex-1"
              placeholder="Player 4"
            />
          </div>
          <div className="text-3xl font-bold text-amber-400 min-w-[60px] text-right">
            {team2.score}
          </div>
        </div>
      </div>

      {/* Expandable game log */}
      {hands.length > 0 && (
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem value="game-log" className="border-amber-400/20">
            <AccordionTrigger className="text-amber-400 text-sm py-2 hover:no-underline">
              Game Log ({hands.length} hands)
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {hands.map((hand, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 gap-2 p-2 bg-green-700 rounded text-xs"
                  >
                    <div className="text-white">
                      <span className="text-amber-400 font-medium">
                        Team 1:
                      </span>{" "}
                      {hand.team1Meld}m + {hand.team1Tricks}t
                    </div>
                    <div className="text-white">
                      <span className="text-amber-400 font-medium">
                        Team 2:
                      </span>{" "}
                      {hand.team2Meld}m + {hand.team2Tricks}t
                    </div>
                    <div className="col-span-2 text-white/70 text-xs">
                      Bid {hand.bid} by {hand.bidWinnerTeam === "team1" ? team1.players[hand.bidWinnerPlayerIndex] : team2.players[hand.bidWinnerPlayerIndex]} •{" "}
                      {hand.trump}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};
