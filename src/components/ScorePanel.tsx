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
  onTeam1NameChange: (name: string) => void;
  onTeam2NameChange: (name: string) => void;
}

export const ScorePanel = ({
  team1,
  team2,
  hands,
  onTeam1NameChange,
  onTeam2NameChange,
}: ScorePanelProps) => {
  return (
    <div className="bg-green-800 border border-amber-400/20 rounded-lg p-3">
      {/* Team scores - two column layout: names left, scores right */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <Input
            type="text"
            value={team1.name}
            onChange={(e) => onTeam1NameChange(e.target.value)}
            className="text-sm font-semibold bg-green-700 border-green-600 text-white h-8 flex-1"
          />
          <div className="text-3xl font-bold text-amber-400">
            {team1.score}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Input
            type="text"
            value={team2.name}
            onChange={(e) => onTeam2NameChange(e.target.value)}
            className="text-sm font-semibold bg-green-700 border-green-600 text-white h-8 flex-1"
          />
          <div className="text-3xl font-bold text-amber-400">
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
                        {team1.name}:
                      </span>{" "}
                      {hand.team1Meld}m + {hand.team1Tricks}t
                    </div>
                    <div className="text-white">
                      <span className="text-amber-400 font-medium">
                        {team2.name}:
                      </span>{" "}
                      {hand.team2Meld}m + {hand.team2Tricks}t
                    </div>
                    <div className="col-span-2 text-white/70 text-xs">
                      Bid {hand.bid} by{" "}
                      {hand.bidWinner === "team1" ? team1.name : team2.name} •{" "}
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
