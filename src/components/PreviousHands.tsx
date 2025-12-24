import { Card } from "@/components/ui/card";
import { Hand, Team } from "@/types";

interface PreviousHandsProps {
  hands: Hand[];
  team1: Team;
  team2: Team;
}

export const PreviousHands = ({ hands, team1, team2 }: PreviousHandsProps) => {
  if (hands.length === 0) return null;
  
  return (
    <div className="mt-3 sm:mt-4">
      <h2 className="text-sm sm:text-base font-semibold text-yellow-300 mb-2">
        Previous Hands
      </h2>
      <Card className="p-2 sm:p-3 bg-green-800 border-yellow-300/20">
        <div className="space-y-2">
          {hands.map((hand, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 p-2 bg-green-700 rounded text-xs sm:text-sm">
              <div className="text-white">
                <span className="text-yellow-300 font-medium">{team1.name}:</span> {hand.team1Meld}m + {hand.team1Tricks}t
              </div>
              <div className="text-white">
                <span className="text-yellow-300 font-medium">{team2.name}:</span> {hand.team2Meld}m + {hand.team2Tricks}t
              </div>
              <div className="col-span-2 text-white/70 text-xs">
                Bid {hand.bid} by {hand.bidWinner === "team1" ? team1.name : team2.name} • {hand.trump}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
