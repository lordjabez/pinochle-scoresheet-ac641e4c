
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Team {
  name: string;
  score: number;
  rounds: number[];
}

interface Round {
  team1Score: number;
  team2Score: number;
  bid: number;
  bidWinner: "team1" | "team2";
  trump: "hearts" | "diamonds" | "clubs" | "spades";
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
  const [currentBid, setCurrentBid] = useState<string>("");
  const [bidWinner, setBidWinner] = useState<"team1" | "team2">("team1");
  const [trump, setTrump] = useState<"hearts" | "diamonds" | "clubs" | "spades">("hearts");
  const [rounds, setRounds] = useState<Round[]>([]);

  const addRound = () => {
    const score1 = parseInt(roundScore1) || 0;
    const score2 = parseInt(roundScore2) || 0;
    const bid = parseInt(currentBid) || 0;

    const newRound: Round = {
      team1Score: score1,
      team2Score: score2,
      bid,
      bidWinner,
      trump,
    };

    setRounds([...rounds, newRound]);

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
    setCurrentBid("");
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

        {/* Bid Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="number"
            value={currentBid}
            onChange={(e) => setCurrentBid(e.target.value)}
            placeholder="Bid amount"
            className="bg-green-700 border-green-600 text-white"
          />
          
          <Select value={bidWinner} onValueChange={(value: "team1" | "team2") => setBidWinner(value)}>
            <SelectTrigger className="bg-green-700 border-green-600 text-white">
              <SelectValue placeholder="Bid winner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team1">{team1.name}</SelectItem>
              <SelectItem value="team2">{team2.name}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={trump} onValueChange={(value: "hearts" | "diamonds" | "clubs" | "spades") => setTrump(value)}>
            <SelectTrigger className="bg-green-700 border-green-600 text-white">
              <SelectValue placeholder="Trump suit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hearts">Hearts ♥</SelectItem>
              <SelectItem value="diamonds">Diamonds ♦</SelectItem>
              <SelectItem value="clubs">Clubs ♣</SelectItem>
              <SelectItem value="spades">Spades ♠</SelectItem>
            </SelectContent>
          </Select>
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
            <div className="space-y-4">
              {rounds.map((round, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 p-3 bg-green-700 rounded">
                  <div>
                    <p className="text-yellow-300 font-semibold mb-1">
                      {team1.name}: {round.team1Score}
                    </p>
                  </div>
                  <div>
                    <p className="text-yellow-300 font-semibold mb-1">
                      {team2.name}: {round.team2Score}
                    </p>
                  </div>
                  <div className="col-span-2 text-white text-sm">
                    Bid: {round.bid} by {round[`${round.bidWinner}Name`]} • Trump: {round.trump}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
