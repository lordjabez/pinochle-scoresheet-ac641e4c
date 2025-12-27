
export interface Team {
  players: [string, string]; // Two player names per team
  score: number;
  hands: number[];
}

export interface Hand {
  team1Meld: number;
  team1Tricks: number;
  team2Meld: number;
  team2Tricks: number;
  bid: number;
  bidWinnerPlayerIndex: 0 | 1; // Index of player within the team who won the bid
  bidWinnerTeam: "team1" | "team2"; // Which team the bid winner is on
  trump: "hearts" | "diamonds" | "clubs" | "spades";
}
