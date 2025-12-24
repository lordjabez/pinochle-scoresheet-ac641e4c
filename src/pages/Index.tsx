import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Undo2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TeamScoreCard } from "@/components/TeamScoreCard";
import { BidControls } from "@/components/BidControls";
import { RoundHistory } from "@/components/RoundHistory";
import { Round } from "@/types";
import { useGameState } from "@/hooks/useGameState";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Index = () => {
  const { team1, setTeam1, team2, setTeam2, rounds, setRounds, resetGame, isLoaded } = useGameState();
  
  const [team1Meld, setTeam1Meld] = useState<string>("");
  const [team1Tricks, setTeam1Tricks] = useState<string>("");
  const [team2Meld, setTeam2Meld] = useState<string>("");
  const [team2Tricks, setTeam2Tricks] = useState<string>("");
  const [currentBid, setCurrentBid] = useState<string>("");
  const [bidWinner, setBidWinner] = useState<"team1" | "team2">("team1");
  const [trump, setTrump] = useState<"hearts" | "diamonds" | "clubs" | "spades">("hearts");

  const { toast } = useToast();

  const addRound = () => {
    const bid = parseInt(currentBid) || 0;

    if (bid < 15) {
      toast({
        title: "Invalid bid",
        description: "Bid must be at least 15",
        variant: "destructive",
      });
      return;
    }

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

  const undoLastRound = () => {
    if (rounds.length === 0) return;

    const lastRound = rounds[rounds.length - 1];
    const lastTeam1Score = team1.rounds[team1.rounds.length - 1];
    const lastTeam2Score = team2.rounds[team2.rounds.length - 1];

    // Populate form fields with the undone round's values
    setTeam1Meld(lastRound.team1Meld.toString());
    setTeam1Tricks(lastRound.team1Tricks.toString());
    setTeam2Meld(lastRound.team2Meld.toString());
    setTeam2Tricks(lastRound.team2Tricks.toString());
    setCurrentBid(lastRound.bid.toString());
    setBidWinner(lastRound.bidWinner);
    setTrump(lastRound.trump);

    setRounds(rounds.slice(0, -1));
    setTeam1({
      ...team1,
      score: team1.score - lastTeam1Score,
      rounds: team1.rounds.slice(0, -1),
    });
    setTeam2({
      ...team2,
      score: team2.score - lastTeam2Score,
      rounds: team2.rounds.slice(0, -1),
    });

    toast({
      title: "Round undone",
      description: "The last round values have been restored for editing.",
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <div className="text-yellow-300 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-900 p-2 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-yellow-300">
            Pinochle Scoresheet
          </h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2">
                <RotateCcw size={18} />
                New Game
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Start New Game?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all scores and round history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetGame}>Start New Game</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <TeamScoreCard
            team={team1}
            meldPoints={team1Meld}
            tricksPoints={team1Tricks}
            onTeamChange={setTeam1}
            onMeldChange={setTeam1Meld}
            onTricksChange={setTeam1Tricks}
          />
          <TeamScoreCard
            team={team2}
            meldPoints={team2Meld}
            tricksPoints={team2Tricks}
            onTeamChange={setTeam2}
            onMeldChange={setTeam2Meld}
            onTricksChange={setTeam2Tricks}
          />
        </div>

        <BidControls
          currentBid={currentBid}
          bidWinner={bidWinner}
          trump={trump}
          team1={team1}
          team2={team2}
          onBidChange={setCurrentBid}
          onBidWinnerChange={setBidWinner}
          onTrumpChange={setTrump}
        />

        <div className="mt-4 sm:mt-6 flex justify-center gap-3">
          <Button
            onClick={undoLastRound}
            disabled={rounds.length === 0}
            className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo2 size={20} />
            Undo Round
          </Button>
          <Button
            onClick={addRound}
            className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white gap-2"
          >
            <Plus size={20} />
            Add Round
          </Button>
        </div>

        <RoundHistory rounds={rounds} team1={team1} team2={team2} />
      </div>
    </div>
  );
};

export default Index;
