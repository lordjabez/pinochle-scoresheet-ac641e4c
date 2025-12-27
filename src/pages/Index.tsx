import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { ScorePanel } from "@/components/ScorePanel";
import { BiddingPhase } from "@/components/BiddingPhase";
import { MeldPhase } from "@/components/MeldPhase";
import { TricksPhase } from "@/components/TricksPhase";
import { PhaseNavigation } from "@/components/PhaseNavigation";
import { useGameStatePhased } from "@/hooks/useGameStatePhased";
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
  const {
    team1,
    team2,
    hands,
    setTeam1,
    setTeam2,
    resetGame,
    isLoaded,
    phase,
    goNext,
    goBack,
    canGoNext,
    canGoBack,
    getNextLabel,
    displayHand,
    updateCurrentHand,
    updateTeam1Tricks,
    getCurrentHandNumber,
    isBidImpossible,
  } = useGameStatePhased();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-green-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-900 flex flex-col">
      {/* Header */}
      <header className="p-3 flex items-center justify-between border-b border-amber-400/20">
        <h1 className="text-xl font-bold text-amber-400">Pinochle</h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              className="bg-amber-400 [@media(hover:hover)]:hover:bg-amber-500 focus:bg-amber-400 active:bg-amber-400 text-green-900 font-semibold gap-1 h-8 text-sm"
            >
              <RotateCcw size={14} />
              New Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start New Game?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all scores and hand history. This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={resetGame}>
                Start New Game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </header>

      {/* Score Panel */}
      <div className="p-3">
        <ScorePanel
          team1={team1}
          team2={team2}
          hands={hands}
          onTeam1PlayersChange={(players) => setTeam1({ ...team1, players })}
          onTeam2PlayersChange={(players) => setTeam2({ ...team2, players })}
        />
      </div>

      {/* Main Phase Content */}
      <div className="flex-1 px-3 pb-20">
        {/* Phase Content */}
        {phase === "bidding" && (
          <BiddingPhase
            bid={displayHand.bid}
            bidWinnerTeam={displayHand.bidWinnerTeam}
            bidWinnerPlayerIndex={displayHand.bidWinnerPlayerIndex}
            trump={displayHand.trump}
            team1={team1}
            team2={team2}
            handNumber={getCurrentHandNumber()}
            onBidChange={(value) => updateCurrentHand({ bid: value })}
            onBidWinnerChange={(playerIndex, team) =>
              updateCurrentHand({ bidWinnerPlayerIndex: playerIndex, bidWinnerTeam: team })
            }
            onTrumpChange={(value) => updateCurrentHand({ trump: value })}
          />
        )}

        {phase === "meld" && displayHand.bidWinnerTeam && displayHand.bidWinnerPlayerIndex !== null && displayHand.trump && (
          <MeldPhase
            team1Meld={displayHand.team1Meld}
            team2Meld={displayHand.team2Meld}
            team1={team1}
            team2={team2}
            handNumber={getCurrentHandNumber()}
            bid={displayHand.bid}
            bidWinnerTeam={displayHand.bidWinnerTeam}
            bidWinnerPlayerIndex={displayHand.bidWinnerPlayerIndex}
            trump={displayHand.trump}
            onTeam1MeldChange={(value) =>
              updateCurrentHand({ team1Meld: value })
            }
            onTeam2MeldChange={(value) =>
              updateCurrentHand({ team2Meld: value })
            }
          />
        )}

        {phase === "tricks" && displayHand.bidWinnerTeam && displayHand.bidWinnerPlayerIndex !== null && displayHand.trump && (
          <TricksPhase
            team1Tricks={displayHand.team1Tricks}
            team2Tricks={displayHand.team2Tricks}
            team1={team1}
            team2={team2}
            handNumber={getCurrentHandNumber()}
            bid={displayHand.bid}
            bidWinnerTeam={displayHand.bidWinnerTeam}
            bidWinnerPlayerIndex={displayHand.bidWinnerPlayerIndex}
            trump={displayHand.trump}
            onTeam1TricksChange={updateTeam1Tricks}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <PhaseNavigation
        onBack={goBack}
        onNext={goNext}
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        nextLabel={getNextLabel()}
      />
    </div>
  );
};

export default Index;
