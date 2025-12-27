import { useState, useEffect } from "react";
import { Team, Hand } from "@/types";

const STORAGE_KEY = "pinochle-game-state";

interface GameState {
  team1: Team;
  team2: Team;
  hands: Hand[];
}

const defaultState: GameState = {
  team1: { players: ["Player 1", "Player 2"], score: 0, hands: [] },
  team2: { players: ["Player 3", "Player 4"], score: 0, hands: [] },
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
        const parsed = JSON.parse(saved);
        
        // Migrate from old 'name' format to new 'players' format
        const migrateTeam = (team: any, defaultPlayers: [string, string]): Team => {
          const players: [string, string] = team.players 
            ? team.players 
            : team.name 
              ? [team.name, "Partner"] 
              : defaultPlayers;
          return {
            players,
            score: team.score || 0,
            hands: team.hands || team.rounds || [],
          };
        };
        
        const migratedTeam1 = migrateTeam(parsed.team1, ["Player 1", "Player 2"]);
        const migratedTeam2 = migrateTeam(parsed.team2, ["Player 3", "Player 4"]);
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
