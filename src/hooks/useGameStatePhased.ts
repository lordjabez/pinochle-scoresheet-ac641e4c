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

interface NavigationPosition {
  handIndex: number; // -1 = new hand, 0+ = viewing historical hand
  phase: GamePhase;
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
  
  // Current hand being entered
  const [currentHand, setCurrentHand] = useState<HandInProgress>(defaultHandInProgress);
  
  // Navigation position
  const [position, setPosition] = useState<NavigationPosition>({
    handIndex: -1, // -1 means we're entering a new hand
    phase: "bidding",
  });

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
    setPosition({ handIndex: -1, phase: "bidding" });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Check if bid is impossible (meld can't reach bid even with max tricks)
  const isBidImpossible = useCallback(() => {
    if (currentHand.bidWinner === null) return false;
    const bidderMeld = currentHand.bidWinner === "team1" 
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

  const isMeldValid = useCallback(() => {
    // Meld can be 0 for both teams, that's valid
    return true;
  }, []);

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
    const team1Effective = hand.team1Tricks === 0 ? 0 : hand.team1Meld + hand.team1Tricks;
    const team2Effective = hand.team2Tricks === 0 ? 0 : hand.team2Meld + hand.team2Tricks;

    const biddingTeamPoints = hand.bidWinner === "team1" ? team1Effective : team2Effective;
    const team1HandScore = hand.bidWinner === "team1"
      ? (biddingTeamPoints >= hand.bid ? team1Effective : -hand.bid)
      : team1Effective;
    const team2HandScore = hand.bidWinner === "team2"
      ? (biddingTeamPoints >= hand.bid ? team2Effective : -hand.bid)
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
    setPosition({ handIndex: -1, phase: "bidding" });
  }, [currentHand, isBidImpossible]);

  // Navigate to next phase
  const goNext = useCallback(() => {
    const { handIndex, phase } = position;

    if (handIndex === -1) {
      // We're entering a new hand
      if (phase === "bidding" && isBiddingValid()) {
        setPosition({ handIndex: -1, phase: "meld" });
      } else if (phase === "meld") {
        // Check if bid is impossible - skip tricks phase
        if (isBidImpossible()) {
          commitHand();
        } else {
          setPosition({ handIndex: -1, phase: "tricks" });
        }
      } else if (phase === "tricks" && isTricksValid()) {
        commitHand();
      }
    } else {
      // We're viewing history - move forward
      if (phase === "bidding") {
        setPosition({ handIndex, phase: "meld" });
      } else if (phase === "meld") {
        // Check if this historical hand had impossible bid
        const historicalHand = hands[handIndex];
        const bidderMeld = historicalHand.bidWinner === "team1" 
          ? historicalHand.team1Meld 
          : historicalHand.team2Meld;
        const wasImpossible = historicalHand.bid - bidderMeld > 25;
        
        if (wasImpossible) {
          // Skip to next hand or current entry
          if (handIndex < hands.length - 1) {
            setPosition({ handIndex: handIndex + 1, phase: "bidding" });
          } else {
            setPosition({ handIndex: -1, phase: "bidding" });
          }
        } else {
          setPosition({ handIndex, phase: "tricks" });
        }
      } else if (phase === "tricks") {
        // Move to next hand or current entry
        if (handIndex < hands.length - 1) {
          setPosition({ handIndex: handIndex + 1, phase: "bidding" });
        } else {
          setPosition({ handIndex: -1, phase: "bidding" });
        }
      }
    }
  }, [position, hands, isBiddingValid, isMeldValid, isTricksValid, isBidImpossible, commitHand]);

  // Navigate to previous phase
  const goBack = useCallback(() => {
    const { handIndex, phase } = position;

    if (handIndex === -1) {
      // We're entering a new hand
      if (phase === "tricks") {
        setPosition({ handIndex: -1, phase: "meld" });
      } else if (phase === "meld") {
        setPosition({ handIndex: -1, phase: "bidding" });
      } else if (phase === "bidding" && hands.length > 0) {
        // Go back to last completed hand's last phase
        const lastHandIndex = hands.length - 1;
        const lastHand = hands[lastHandIndex];
        const bidderMeld = lastHand.bidWinner === "team1" 
          ? lastHand.team1Meld 
          : lastHand.team2Meld;
        const wasImpossible = lastHand.bid - bidderMeld > 25;
        
        setPosition({ 
          handIndex: lastHandIndex, 
          phase: wasImpossible ? "meld" : "tricks" 
        });
      }
    } else {
      // We're viewing history
      if (phase === "tricks") {
        setPosition({ handIndex, phase: "meld" });
      } else if (phase === "meld") {
        setPosition({ handIndex, phase: "bidding" });
      } else if (phase === "bidding") {
        if (handIndex > 0) {
          // Go to previous hand's last phase
          const prevHand = hands[handIndex - 1];
          const bidderMeld = prevHand.bidWinner === "team1" 
            ? prevHand.team1Meld 
            : prevHand.team2Meld;
          const wasImpossible = prevHand.bid - bidderMeld > 25;
          
          setPosition({ 
            handIndex: handIndex - 1, 
            phase: wasImpossible ? "meld" : "tricks" 
          });
        }
        // If handIndex === 0 and phase === bidding, can't go back further
      }
    }
  }, [position, hands]);

  // Can we go back?
  const canGoBack = position.handIndex > 0 || 
    (position.handIndex === 0 && position.phase !== "bidding") ||
    (position.handIndex === -1 && (position.phase !== "bidding" || hands.length > 0));

  // Can we go next?
  const canGoNext = position.handIndex === -1
    ? (position.phase === "bidding" && isBiddingValid()) ||
      (position.phase === "meld" && isMeldValid()) ||
      (position.phase === "tricks" && isTricksValid())
    : true; // Can always navigate forward through history

  // Get display data for current position
  const getDisplayHand = useCallback((): HandInProgress => {
    if (position.handIndex === -1) {
      return currentHand;
    }
    const historicalHand = hands[position.handIndex];
    return {
      bid: historicalHand.bid,
      bidWinner: historicalHand.bidWinner,
      trump: historicalHand.trump,
      team1Meld: historicalHand.team1Meld,
      team2Meld: historicalHand.team2Meld,
      team1Tricks: historicalHand.team1Tricks,
      team2Tricks: historicalHand.team2Tricks,
    };
  }, [position, currentHand, hands]);

  // Update current hand values (only works when entering new hand)
  const updateCurrentHand = useCallback((updates: Partial<HandInProgress>) => {
    if (position.handIndex === -1) {
      setCurrentHand((prev) => ({ ...prev, ...updates }));
    }
  }, [position]);

  // Update team1 tricks with auto-balance
  const updateTeam1Tricks = useCallback((value: number) => {
    if (position.handIndex === -1) {
      setCurrentHand((prev) => ({
        ...prev,
        team1Tricks: value,
        team2Tricks: 25 - value,
      }));
    }
  }, [position]);

  // Get next button label
  const getNextLabel = useCallback(() => {
    if (position.handIndex !== -1) return "Next";
    if (position.phase === "meld" && isBidImpossible()) return "Finish Hand";
    if (position.phase === "tricks") return "Finish Hand";
    return "Next";
  }, [position, isBidImpossible]);

  // Check if we're viewing history (read-only mode)
  const isViewingHistory = position.handIndex !== -1;

  // Get current hand number for display
  const getCurrentHandNumber = () => {
    if (position.handIndex === -1) {
      return hands.length + 1;
    }
    return position.handIndex + 1;
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
    phase: position.phase,
    goNext,
    goBack,
    canGoNext,
    canGoBack,
    getNextLabel,
    
    // Current hand data
    displayHand: getDisplayHand(),
    updateCurrentHand,
    updateTeam1Tricks,
    isViewingHistory,
    getCurrentHandNumber,
    isBidImpossible,
  };
};
