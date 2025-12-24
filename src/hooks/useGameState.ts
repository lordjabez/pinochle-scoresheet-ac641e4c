import { useState, useEffect } from "react";
import { Team, Round } from "@/types";

const STORAGE_KEY = "pinochle-game-state";

interface GameState {
  team1: Team;
  team2: Team;
  rounds: Round[];
}

const defaultState: GameState = {
  team1: { name: "Team 1", score: 0, rounds: [] },
  team2: { name: "Team 2", score: 0, rounds: [] },
  rounds: [],
};

export const useGameState = () => {
  const [team1, setTeam1] = useState<Team>(defaultState.team1);
  const [team2, setTeam2] = useState<Team>(defaultState.team2);
  const [rounds, setRounds] = useState<Round[]>(defaultState.rounds);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed: GameState = JSON.parse(saved);
        setTeam1(parsed.team1);
        setTeam2(parsed.team2);
        setRounds(parsed.rounds);
      } catch (e) {
        console.error("Failed to parse saved game state:", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      const state: GameState = { team1, team2, rounds };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [team1, team2, rounds, isLoaded]);

  const resetGame = () => {
    setTeam1(defaultState.team1);
    setTeam2(defaultState.team2);
    setRounds(defaultState.rounds);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    team1,
    setTeam1,
    team2,
    setTeam2,
    rounds,
    setRounds,
    resetGame,
    isLoaded,
  };
};
