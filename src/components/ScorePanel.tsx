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
  handNumber: number;
  bid: number;
  bidWinnerTeam: "team1" | "team2" | null;
  bidWinnerPlayerIndex: 0 | 1 | null;
  trump: "hearts" | "diamonds" | "clubs" | "spades" | null;
  onTeam1PlayersChange: (players: [string, string]) => void;
  onTeam2PlayersChange: (players: [string, string]) => void;
}

const suitSymbols = {
  spades: { symbol: "♠", color: "text-black" },
  diamonds: { symbol: "♦", color: "text-red-500" },
  clubs: { symbol: "♣", color: "text-black" },
  hearts: { symbol: "♥", color: "text-red-500" },
};

export const ScorePanel = ({
  team1,
  team2,
  hands,
  handNumber,
  bid,
  bidWinnerTeam,
  bidWinnerPlayerIndex,
  trump,
  onTeam1PlayersChange,
  onTeam2PlayersChange,
}: ScorePanelProps) => {
  const suit = trump ? suitSymbols[trump] : null;
  const winnerName = bidWinnerTeam !== null && bidWinnerPlayerIndex !== null
    ? (bidWinnerTeam === "team1" ? team1 : team2).players[bidWinnerPlayerIndex]
    : null;

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
          <div className="text-3xl font-bold text-amber-400 min-w-[48px] text-right">
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
          <div className="text-3xl font-bold text-amber-400 min-w-[48px] text-right">
            {team2.score}
          </div>
        </div>
      </div>

      {/* Expandable game log - paper scoresheet style */}
      {hands.length > 0 && (
        <Accordion type="single" collapsible className="mt-3">
          <AccordionItem value="game-log" className="border-amber-400/20">
            <AccordionTrigger className="text-amber-400 text-sm py-2 hover:no-underline">
              Full Score ({hands.length} hands)
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 overflow-x-auto">
                <table className="w-full text-xs text-white border-collapse">
                  <thead>
                    <tr className="border-b border-amber-400/30">
                      <th className="text-left text-amber-400 font-medium py-1 px-1 w-12">Hand</th>
                      <th className="text-left text-amber-400 font-medium py-1 px-1 w-12"></th>
                      <th className="text-center text-amber-400 font-medium py-1 px-1">
                        <div className="flex flex-col leading-tight">{team1.players[0]}<span>{team1.players[1]}</span></div>
                      </th>
                      <th className="text-center text-amber-400 font-medium py-1 px-1">
                        <div className="flex flex-col leading-tight">{team2.players[0]}<span>{team2.players[1]}</span></div>
                      </th>
                      <th className="text-left text-amber-400 font-medium py-1 px-1">Bid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hands.map((hand, index) => {
                      const trumpIcon = hand.trump === "hearts" ? "♥" : hand.trump === "diamonds" ? "♦" : hand.trump === "clubs" ? "♣" : "♠";
                      const bidWinner = hand.bidWinnerTeam === "team1" 
                        ? team1.players[hand.bidWinnerPlayerIndex] 
                        : team2.players[hand.bidWinnerPlayerIndex];
                      
                      // Calculate running totals using actual scored points from team.hands
                      const team1Total = team1.hands.slice(0, index + 1).reduce((sum, score) => sum + score, 0);
                      const team2Total = team2.hands.slice(0, index + 1).reduce((sum, score) => sum + score, 0);
                      
                      return (
                        <>
                          {/* Meld row */}
                          <tr key={`${index}-meld`} className="border-b border-green-600/50">
                            <td className="py-1 px-1 text-white/70" rowSpan={3}>{index + 1}</td>
                            <td className="py-1 px-1 text-white/50 text-right">Meld</td>
                            <td className="text-center py-1 px-1">{hand.team1Meld}</td>
                            <td className="text-center py-1 px-1">{hand.team2Meld}</td>
                            <td className="py-1 px-1 text-white/70">{hand.bid} {bidWinner} {trumpIcon}</td>
                          </tr>
                          {/* Tricks row */}
                          <tr key={`${index}-tricks`} className="border-b border-green-600/50">
                            <td className="py-1 px-1 text-white/50 text-right">Tricks</td>
                            <td className="text-center py-1 px-1">{hand.team1Tricks}</td>
                            <td className="text-center py-1 px-1">{hand.team2Tricks}</td>
                            <td className="py-1 px-1"></td>
                          </tr>
                          {/* Sum row */}
                          <tr key={`${index}-sum`} className="border-b border-amber-400/30">
                            <td className="py-1 px-1 text-white/50 text-right">Total</td>
                            <td className="text-center py-1 px-1 font-bold text-amber-400">{team1Total}</td>
                            <td className="text-center py-1 px-1 font-bold text-amber-400">{team2Total}</td>
                            <td className="py-1 px-1"></td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Hand status row */}
      <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-amber-400/20">
        <div className="flex items-center gap-1">
          <span className="text-white/70">Hand</span>
          <span className="text-white font-medium">{handNumber}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/70">Bid:</span>
          <span className="text-white font-medium">{bid}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/70">Winner:</span>
          <span className="text-white font-medium">{winnerName ?? "—"}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/70">Trump:</span>
          {suit ? (
            <span className={`text-sm ${suit.color} bg-white rounded w-5 inline-flex justify-center`}>
              {suit.symbol}
            </span>
          ) : (
            <span className="text-white font-medium">—</span>
          )}
        </div>
      </div>
    </div>
  );
};
