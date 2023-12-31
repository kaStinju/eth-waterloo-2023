export type GamePhase = "Shopping"
  | "Communication"
  | "Fighting"
  | "End"
  | "Victory"
  | "Defeat";

export interface Team {
  nouns: Noun[];
}

export interface Noun {
  imageURL: string;
  hp: number;
  attack: number;
  id: string;
}

export interface Enemy {
  accountId: string;
  hp: number;
  team: Team;
}

export interface GameState {
  phase: GamePhase;
  turn: number;
  hp: number;
  team: Team;
  enemies: Enemy[];
}

export interface GameWindowProps {
  state: GameState;
  setState: (gs: GameState) => void
}
