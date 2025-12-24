
export interface Team {
  name: string;
  score: number;
  hands: number[];
}

export interface Hand {
  team1Meld: number;
  team1Tricks: number;
  team2Meld: number;
  team2Tricks: number;
  bid: number;
  bidWinner: "team1" | "team2";
  trump: "hearts" | "diamonds" | "clubs" | "spades";
}
