
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Team {
  name: string;
  score: number;
  rounds: number[];
}

const Index = () => {
  const [team1, setTeam1] = useState<Team>({
    name: "Team 1",
    score: 0,
    rounds: [],
  });
  const [team2, setTeam2] = useState<Team>({
    name: "Team 2",
    score: 0,
    rounds: [],
  });
  const [roundScore1, setRoundScore1] = useState<string>("");
  const [roundScore2, setRoundScore2] = useState<string>("");

  const addRound = () => {
    const score1 = parseInt(roundScore1) || 0;
    const score2 = parseInt(roundScore2) || 0;

    setTeam1({
      ...team1,
      score: team1.score + score1,
      rounds: [...team1.rounds, score1],
    });

    setTeam2({
      ...team2,
      score: team2.score + score2,
      rounds: [...team2.rounds, score2],
    });

    setRoundScore1("");
    setRoundScore2("");
  };

  return (
    <div className="min-h-screen bg-green-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-yellow-300 mb-8">
          Pinochle Score Keeper
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team 1 Score Card */}
          <Card className="p-6 bg-green-800 border-yellow-300/20">
            <div className="space-y-4">
              <Input
                type="text"
                value={team1.name}
                onChange={(e) => setTeam1({ ...team1, name: e.target.value })}
                className="text-lg font-semibold bg-green-700 border-green-600 text-white"
              />
              <div className="text-4xl font-bold text-center text-yellow-300">
                {team1.score}
              </div>
              <Input
                type="number"
                value={roundScore1}
                onChange={(e) => setRoundScore1(e.target.value)}
                placeholder="Enter round score"
                className="bg-green-700 border-green-600 text-white"
              />
            </div>
          </Card>

          {/* Team 2 Score Card */}
          <Card className="p-6 bg-green-800 border-yellow-300/20">
            <div className="space-y-4">
              <Input
                type="text"
                value={team2.name}
                onChange={(e) => setTeam2({ ...team2, name: e.target.value })}
                className="text-lg font-semibold bg-green-700 border-green-600 text-white"
              />
              <div className="text-4xl font-bold text-center text-yellow-300">
                {team2.score}
              </div>
              <Input
                type="number"
                value={roundScore2}
                onChange={(e) => setRoundScore2(e.target.value)}
                placeholder="Enter round score"
                className="bg-green-700 border-green-600 text-white"
              />
            </div>
          </Card>
        </div>

        {/* Add Round Button */}
        <div className="mt-6 flex justify-center">
          <Button
            onClick={addRound}
            className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2"
          >
            <Plus size={20} />
            Add Round
          </Button>
        </div>

        {/* Round History */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-yellow-300 mb-4">
            Round History
          </h2>
          <Card className="p-4 bg-green-800 border-yellow-300/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                  {team1.name}
                </h3>
                <div className="space-y-2">
                  {team1.rounds.map((score, index) => (
                    <div
                      key={index}
                      className="bg-green-700 p-2 rounded text-white"
                    >
                      Round {index + 1}: {score}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                  {team2.name}
                </h3>
                <div className="space-y-2">
                  {team2.rounds.map((score, index) => (
                    <div
                      key={index}
                      className="bg-green-700 p-2 rounded text-white"
                    >
                      Round {index + 1}: {score}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
