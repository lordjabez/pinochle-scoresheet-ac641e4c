import { useState, useEffect, useCallback } from "react";
import { Team, Hand } from "@/types";

const STORAGE_KEY = "pinochle-game-state";

export type GamePhase = "bidding" | "meld" | "tricks";

interface HandInProgress {
  bid: number;
  bidWinner: "team1" | "team2" | null;
  trump: "hearts" | "diamonds" | "clubs" | "spades" | null;
  team1Meld: number;
  team2Meld: number;
  team1Tricks: number;
  team2Tricks: number;
}

interface GameState {
  team1: Team;
  team2: Team;
  hands: Hand[];
}

const defaultTeam1: Team = { name: "Team 1", score: 0, hands: [] };
const defaultTeam2: Team = { name: "Team 2", score: 0, hands: [] };

const defaultHandInProgress: HandInProgress = {
  bid: 15,
  bidWinner: null,
  trump: null,
  team1Meld: 0,
  team2Meld: 0,
  team1Tricks: 0,
  team2Tricks: 0,
};

export const useGameStatePhased = () => {
  const [team1, setTeam1] = useState<Team>(defaultTeam1);
  const [team2, setTeam2] = useState<Team>(defaultTeam2);
  const [hands, setHands] = useState<Hand[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Current hand being entered/edited
  const [currentHand, setCurrentHand] = useState<HandInProgress>(defaultHandInProgress);

  // Current phase
  const [phase, setPhase] = useState<GamePhase>("bidding");

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const migratedTeam1 = {
          ...parsed.team1,
          hands: parsed.team1.hands || parsed.team1.rounds || [],
        };
        const migratedTeam2 = {
          ...parsed.team2,
          hands: parsed.team2.hands || parsed.team2.rounds || [],
        };
        const migratedHands = parsed.hands || parsed.rounds || [];

        setTeam1(migratedTeam1);
        setTeam2(migratedTeam2);
        setHands(migratedHands);
      } catch (e) {
        console.error("Failed to parse saved game state:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const state: GameState = { team1, team2, hands };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [team1, team2, hands, isLoaded]);

  const resetGame = useCallback(() => {
    setTeam1(defaultTeam1);
    setTeam2(defaultTeam2);
    setHands([]);
    setCurrentHand(defaultHandInProgress);
    setPhase("bidding");
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Check if bid is impossible (meld can't reach bid even with max tricks)
  const isBidImpossible = useCallback(() => {
    if (currentHand.bidWinner === null) return false;
    const bidderMeld =
      currentHand.bidWinner === "team1"
        ? currentHand.team1Meld
        : currentHand.team2Meld;
    return currentHand.bid - bidderMeld > 25;
  }, [currentHand]);

  // Validation for each phase
  const isBiddingValid = useCallback(() => {
    return (
      currentHand.bid >= 15 &&
      currentHand.bidWinner !== null &&
      currentHand.trump !== null
    );
  }, [currentHand]);

  const isTricksValid = useCallback(() => {
    return currentHand.team1Tricks + currentHand.team2Tricks === 25;
  }, [currentHand]);

  // Calculate hand score and commit
  const commitHand = useCallback(() => {
    const hand: Hand = {
      team1Meld: currentHand.team1Meld,
      team1Tricks: currentHand.team1Tricks,
      team2Meld: currentHand.team2Meld,
      team2Tricks: currentHand.team2Tricks,
      bid: currentHand.bid,
      bidWinner: currentHand.bidWinner!,
      trump: currentHand.trump!,
    };

    // If bid was impossible, set tricks to 0
    const bidImpossible = isBidImpossible();
    if (bidImpossible) {
      hand.team1Tricks = 0;
      hand.team2Tricks = 0;
    }

    // Calculate scores
    const team1Effective =
      hand.team1Tricks === 0 ? 0 : hand.team1Meld + hand.team1Tricks;
    const team2Effective =
      hand.team2Tricks === 0 ? 0 : hand.team2Meld + hand.team2Tricks;

    const biddingTeamPoints =
      hand.bidWinner === "team1" ? team1Effective : team2Effective;
    const team1HandScore =
      hand.bidWinner === "team1"
        ? biddingTeamPoints >= hand.bid
          ? team1Effective
          : -hand.bid
        : team1Effective;
    const team2HandScore =
      hand.bidWinner === "team2"
        ? biddingTeamPoints >= hand.bid
          ? team2Effective
          : -hand.bid
        : team2Effective;

    setHands((prev) => [...prev, hand]);
    setTeam1((prev) => ({
      ...prev,
      score: prev.score + team1HandScore,
      hands: [...prev.hands, team1HandScore],
    }));
    setTeam2((prev) => ({
      ...prev,
      score: prev.score + team2HandScore,
      hands: [...prev.hands, team2HandScore],
    }));

    // Reset for next hand
    setCurrentHand(defaultHandInProgress);
    setPhase("bidding");
  }, [currentHand, isBidImpossible]);

  // Undo the last completed hand and load it for editing at a specific phase
  const undoLastHand = useCallback(
    (targetPhase: GamePhase) => {
      if (hands.length === 0) return;

      const lastHand = hands[hands.length - 1];
      const lastTeam1Score = team1.hands[team1.hands.length - 1];
      const lastTeam2Score = team2.hands[team2.hands.length - 1];

      // Load the hand data for editing
      setCurrentHand({
        bid: lastHand.bid,
        bidWinner: lastHand.bidWinner,
        trump: lastHand.trump,
        team1Meld: lastHand.team1Meld,
        team2Meld: lastHand.team2Meld,
        team1Tricks: lastHand.team1Tricks,
        team2Tricks: lastHand.team2Tricks,
      });

      // Remove the hand from history and adjust scores
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

      setPhase(targetPhase);
    },
    [hands, team1, team2]
  );

  // Navigate to next phase
  const goNext = useCallback(() => {
    if (phase === "bidding" && isBiddingValid()) {
      setPhase("meld");
    } else if (phase === "meld") {
      // Check if bid is impossible - skip tricks phase
      if (isBidImpossible()) {
        commitHand();
      } else {
        setPhase("tricks");
      }
    } else if (phase === "tricks" && isTricksValid()) {
      commitHand();
    }
  }, [phase, isBiddingValid, isTricksValid, isBidImpossible, commitHand]);

  // Navigate to previous phase (with editing capability)
  const goBack = useCallback(() => {
    if (phase === "tricks") {
      setPhase("meld");
    } else if (phase === "meld") {
      setPhase("bidding");
    } else if (phase === "bidding" && hands.length > 0) {
      // Undo the last hand and go to its last phase for editing
      const lastHand = hands[hands.length - 1];
      const bidderMeld =
        lastHand.bidWinner === "team1"
          ? lastHand.team1Meld
          : lastHand.team2Meld;
      const wasImpossible = lastHand.bid - bidderMeld > 25;

      undoLastHand(wasImpossible ? "meld" : "tricks");
    }
  }, [phase, hands, undoLastHand]);

  // Can we go back?
  const canGoBack = phase !== "bidding" || hands.length > 0;

  // Can we go next?
  const canGoNext =
    (phase === "bidding" && isBiddingValid()) ||
    phase === "meld" || // Meld is always valid (can be 0)
    (phase === "tricks" && isTricksValid());

  // Update current hand values
  const updateCurrentHand = useCallback(
    (updates: Partial<HandInProgress>) => {
      setCurrentHand((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  // Update team1 tricks with auto-balance
  const updateTeam1Tricks = useCallback((value: number) => {
    setCurrentHand((prev) => ({
      ...prev,
      team1Tricks: value,
      team2Tricks: 25 - value,
    }));
  }, []);

  // Get next button label
  const getNextLabel = useCallback(() => {
    if (phase === "meld" && isBidImpossible()) return "Finish Hand";
    if (phase === "tricks") return "Finish Hand";
    return "Next";
  }, [phase, isBidImpossible]);

  // Get current hand number for display
  const getCurrentHandNumber = () => {
    return hands.length + 1;
  };

  return {
    team1,
    team2,
    hands,
    setTeam1,
    setTeam2,
    resetGame,
    isLoaded,

    // Phase navigation
    phase,
    goNext,
    goBack,
    canGoNext,
    canGoBack,
    getNextLabel,

    // Current hand data
    displayHand: currentHand,
    updateCurrentHand,
    updateTeam1Tricks,
    getCurrentHandNumber,
    isBidImpossible,
  };
};
