import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Undo2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TeamScoreCard } from "@/components/TeamScoreCard";
import { BidControls } from "@/components/BidControls";
import { PreviousHands } from "@/components/PreviousHands";
import { Hand } from "@/types";
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
  const { team1, setTeam1, team2, setTeam2, hands, setHands, resetGame, isLoaded } = useGameState();
  
  const [team1Meld, setTeam1Meld] = useState<string>("");
  const [team1Tricks, setTeam1Tricks] = useState<string>("");
  const [team2Meld, setTeam2Meld] = useState<string>("");
  const [team2Tricks, setTeam2Tricks] = useState<string>("");
  const [currentBid, setCurrentBid] = useState<string>("");
  const [bidWinner, setBidWinner] = useState<"team1" | "team2">("team1");
  const [trump, setTrump] = useState<"hearts" | "diamonds" | "clubs" | "spades">("hearts");

  const { toast } = useToast();

  const finishHand = () => {
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
    const meld1 = parseInt(team1Meld) || 0;
    const meld2 = parseInt(team2Meld) || 0;
    
    // Check if bid is impossible to make (gap between bid and meld > 25)
    const bidderMeld = bidWinner === "team1" ? meld1 : meld2;
    const bidImpossible = bid - bidderMeld > 25;
    
    // Allow 0-0 tricks if bid is impossible, otherwise must sum to 25
    const validTricks = bidImpossible 
      ? (tricks1 === 0 && tricks2 === 0) || (tricks1 + tricks2 === 25)
      : tricks1 + tricks2 === 25;
    
    if (!validTricks) {
      toast({
        title: "Invalid trick points",
        description: bidImpossible 
          ? "Trick points must add up to 25, or both be 0 if bid is impossible" 
          : "Trick points must add up to 25",
        variant: "destructive",
      });
      return;
    }

    const newHand: Hand = {
      team1Meld: meld1,
      team1Tricks: tricks1,
      team2Meld: meld2,
      team2Tricks: tricks2,
      bid,
      bidWinner,
      trump,
    };

    // Calculate hand score based on bid success/failure
    // If a team gets 0 tricks, they lose their meld too
    const team1Effective = tricks1 === 0 ? 0 : meld1 + tricks1;
    const team2Effective = tricks2 === 0 ? 0 : meld2 + tricks2;
    
    const biddingTeamPoints = bidWinner === "team1" ? team1Effective : team2Effective;
    const team1HandScore = bidWinner === "team1" 
      ? (biddingTeamPoints >= bid ? team1Effective : -bid)
      : team1Effective;
    const team2HandScore = bidWinner === "team2"
      ? (biddingTeamPoints >= bid ? team2Effective : -bid)
      : team2Effective;

    setHands([...hands, newHand]);

    setTeam1({
      ...team1,
      score: team1.score + team1HandScore,
      hands: [...team1.hands, team1HandScore],
    });

    setTeam2({
      ...team2,
      score: team2.score + team2HandScore,
      hands: [...team2.hands, team2HandScore],
    });

    setTeam1Meld("");
    setTeam1Tricks("");
    setTeam2Meld("");
    setTeam2Tricks("");
    setCurrentBid("");
  };

  const undoLastHand = () => {
    if (hands.length === 0) return;

    const lastHand = hands[hands.length - 1];
    const lastTeam1Score = team1.hands[team1.hands.length - 1];
    const lastTeam2Score = team2.hands[team2.hands.length - 1];

    // Populate form fields with the undone hand's values
    setTeam1Meld(lastHand.team1Meld.toString());
    setTeam1Tricks(lastHand.team1Tricks.toString());
    setTeam2Meld(lastHand.team2Meld.toString());
    setTeam2Tricks(lastHand.team2Tricks.toString());
    setCurrentBid(lastHand.bid.toString());
    setBidWinner(lastHand.bidWinner);
    setTrump(lastHand.trump);

    setHands(hands.slice(0, -1));
    setTeam1({
      ...team1,
      score: team1.score - lastTeam1Score,
      hands: team1.hands.slice(0, -1),
    });
    setTeam2({
      ...team2,
      score: team2.score - lastTeam2Score,
      hands: team2.hands.slice(0, -1),
    });

    toast({
      title: "Hand undone",
      description: "The last hand values have been restored for editing.",
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-900 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2 sm:mb-4">
          <h1 className="text-xl sm:text-3xl font-bold text-amber-400">
            Pinochle
          </h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" className="bg-amber-400 [@media(hover:hover)]:hover:bg-amber-500 focus:bg-amber-400 active:bg-amber-400 text-green-900 font-semibold gap-1 h-8 text-sm">
                <RotateCcw size={14} />
                New Game
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Start New Game?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all scores and hand history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={resetGame}>Start New Game</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4">
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

        <div className="mt-2 sm:mt-4 flex justify-center gap-2">
          <Button
            size="sm"
            onClick={undoLastHand}
            disabled={hands.length === 0}
            className="bg-amber-400 [@media(hover:hover)]:hover:bg-amber-500 focus:bg-amber-400 active:bg-amber-400 text-green-900 font-semibold gap-1 h-8 text-sm disabled:bg-amber-400/50 disabled:text-green-900/50 disabled:cursor-not-allowed disabled:opacity-100"
          >
            <Undo2 size={14} />
            Undo
          </Button>
          <Button
            size="sm"
            onClick={finishHand}
            className="flex-1 sm:flex-none bg-amber-400 [@media(hover:hover)]:hover:bg-amber-500 focus:bg-amber-400 active:bg-amber-400 text-green-900 font-semibold gap-1 h-8 text-sm focus-visible:ring-amber-500"
          >
            <Plus size={14} />
            Finish Hand
          </Button>
        </div>

        <PreviousHands hands={hands} team1={team1} team2={team2} />
      </div>
    </div>
  );
};

export default Index;
