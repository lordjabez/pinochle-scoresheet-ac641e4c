import { useState, useEffect } from "react";
import { Team, Hand } from "@/types";

const STORAGE_KEY = "pinochle-game-state";

interface GameState {
  team1: Team;
  team2: Team;
  hands: Hand[];
}

const defaultState: GameState = {
  team1: { name: "Team 1", score: 0, hands: [] },
  team2: { name: "Team 2", score: 0, hands: [] },
  hands: [],
};

export const useGameState = () => {
  const [team1, setTeam1] = useState<Team>(defaultState.team1);
  const [team2, setTeam2] = useState<Team>(defaultState.team2);
  const [hands, setHands] = useState<Hand[]>(defaultState.hands);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: GameState = JSON.parse(saved);
        setTeam1(parsed.team1);
        setTeam2(parsed.team2);
        setHands(parsed.hands);
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

  const resetGame = () => {
    setTeam1(defaultState.team1);
    setTeam2(defaultState.team2);
    setHands(defaultState.hands);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    team1,
    setTeam1,
    team2,
    setTeam2,
    hands,
    setHands,
    resetGame,
    isLoaded,
  };
};
