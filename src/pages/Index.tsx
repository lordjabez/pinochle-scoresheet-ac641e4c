
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Team {
  name: string;
  score: number;
  rounds: number[];
}

interface Round {
  team1Meld: number;
  team1Tricks: number;
  team2Meld: number;
  team2Tricks: number;
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
  const [team1Meld, setTeam1Meld] = useState<string>("");
  const [team1Tricks, setTeam1Tricks] = useState<string>("");
  const [team2Meld, setTeam2Meld] = useState<string>("");
  const [team2Tricks, setTeam2Tricks] = useState<string>("");
  const [currentBid, setCurrentBid] = useState<string>("");
  const [bidWinner, setBidWinner] = useState<"team1" | "team2">("team1");
  const [trump, setTrump] = useState<"hearts" | "diamonds" | "clubs" | "spades">("hearts");
  const [rounds, setRounds] = useState<Round[]>([]);

  const { toast } = useToast();

  const addRound = () => {
    const tricks1 = parseInt(team1Tricks) || 0;
    const tricks2 = parseInt(team2Tricks) || 0;
    
    if (tricks1 + tricks2 !== 25) {
      toast({
        title: "Invalid trick points",
        description: "Trick points must add up to 25",
        variant: "destructive",
      });
      return;
    }

    const meld1 = parseInt(team1Meld) || 0;
    const meld2 = parseInt(team2Meld) || 0;
    const bid = parseInt(currentBid) || 0;

    const newRound: Round = {
      team1Meld: meld1,
      team1Tricks: tricks1,
      team2Meld: meld2,
      team2Tricks: tricks2,
      bid,
      bidWinner,
      trump,
    };

    // Calculate round score based on bid success/failure
    const biddingTeamPoints = bidWinner === "team1" ? (meld1 + tricks1) : (meld2 + tricks2);
    const team1RoundScore = bidWinner === "team1" 
      ? (biddingTeamPoints >= bid ? meld1 + tricks1 : -bid)
      : (meld1 + tricks1);
    const team2RoundScore = bidWinner === "team2"
      ? (biddingTeamPoints >= bid ? meld2 + tricks2 : -bid)
      : (meld2 + tricks2);

    setRounds([...rounds, newRound]);

    setTeam1({
      ...team1,
      score: team1.score + team1RoundScore,
      rounds: [...team1.rounds, team1RoundScore],
    });

    setTeam2({
      ...team2,
      score: team2.score + team2RoundScore,
      rounds: [...team2.rounds, team2RoundScore],
    });

    setTeam1Meld("");
    setTeam1Tricks("");
    setTeam2Meld("");
    setTeam2Tricks("");
    setCurrentBid("");
  };

  return (
    <div className="min-h-screen bg-green-900 p-2 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-yellow-300 mb-4 sm:mb-8">
          Pinochle Score Keeper
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Team 1 Score Card */}
          <Card className="p-4 sm:p-6 bg-green-800 border-yellow-300/20">
            <div className="space-y-3 sm:space-y-4">
              <Input
                type="text"
                value={team1.name}
                onChange={(e) => setTeam1({ ...team1, name: e.target.value })}
                className="text-base sm:text-lg font-semibold bg-green-700 border-green-600 text-white"
              />
              <div className="text-3xl sm:text-4xl font-bold text-center text-yellow-300">
                {team1.score}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  value={team1Meld}
                  onChange={(e) => setTeam1Meld(e.target.value)}
                  placeholder="Meld points"
                  className="bg-green-700 border-green-600 text-white"
                />
                <Input
                  type="number"
                  value={team1Tricks}
                  onChange={(e) => setTeam1Tricks(e.target.value)}
                  placeholder="Trick points"
                  className="bg-green-700 border-green-600 text-white"
                />
              </div>
            </div>
          </Card>

          {/* Team 2 Score Card */}
          <Card className="p-4 sm:p-6 bg-green-800 border-yellow-300/20">
            <div className="space-y-3 sm:space-y-4">
              <Input
                type="text"
                value={team2.name}
                onChange={(e) => setTeam2({ ...team2, name: e.target.value })}
                className="text-base sm:text-lg font-semibold bg-green-700 border-green-600 text-white"
              />
              <div className="text-3xl sm:text-4xl font-bold text-center text-yellow-300">
                {team2.score}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  value={team2Meld}
                  onChange={(e) => setTeam2Meld(e.target.value)}
                  placeholder="Meld points"
                  className="bg-green-700 border-green-600 text-white"
                />
                <Input
                  type="number"
                  value={team2Tricks}
                  onChange={(e) => setTeam2Tricks(e.target.value)}
                  placeholder="Trick points"
                  className="bg-green-700 border-green-600 text-white"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Bid Controls */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
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
        <div className="mt-4 sm:mt-6 flex justify-center">
          <Button
            onClick={addRound}
            className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white gap-2"
          >
            <Plus size={20} />
            Add Round
          </Button>
        </div>

        {/* Round History */}
        <div className="mt-6 sm:mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-yellow-300 mb-3 sm:mb-4">
            Round History
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
      </div>
    </div>
  );
};

export default Index;
