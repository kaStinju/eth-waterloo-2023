export type GamePhase = "Shopping"
  | "Communication"
  | "Fighting"
  | "End"
  | "Victory"
  | "Defeat";

export interface Team {
  dummy: string;
}

export interface Enemy {
  accountId: string;
  hp: number;
  team: Team;
}

export interface GameState {
  phase: GamePhase;
  turn: number;
  accountId: string;
  hp: number;
  team: Team;
  enemies: Enemy[];
}
