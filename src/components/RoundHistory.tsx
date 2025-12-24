
import { Card } from "@/components/ui/card";
import { Round, Team } from "@/types";

interface RoundHistoryProps {
  rounds: Round[];
  team1: Team;
  team2: Team;
}

export const RoundHistory = ({ rounds, team1, team2 }: RoundHistoryProps) => {
  return (
    <div className="mt-6 sm:mt-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-yellow-300 mb-3 sm:mb-4">
        Hand History
      </h2>
      <Card className="p-3 sm:p-4 bg-green-800 border-yellow-300/20">
        <div className="space-y-3 sm:space-y-4">
          {rounds.map((round, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-green-700 rounded text-sm sm:text-base">
              <div>
                <p className="text-yellow-300 font-semibold mb-1">
                  {team1.name}
                </p>
                <p className="text-white">
                  Meld: {round.team1Meld} • Tricks: {round.team1Tricks}
                </p>
              </div>
              <div>
                <p className="text-yellow-300 font-semibold mb-1">
                  {team2.name}
                </p>
                <p className="text-white">
                  Meld: {round.team2Meld} • Tricks: {round.team2Tricks}
                </p>
              </div>
              <div className="col-span-1 sm:col-span-2 text-white">
                Bid: {round.bid} by {round.bidWinner === "team1" ? team1.name : team2.name} • Trump: {round.trump}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
