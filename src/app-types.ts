import { GameState } from "./game-types";

export interface Account {
  accountId: string;
}

export interface LoginScreen {
  screen: "Login";
  lobbyId?: string;
};

export interface HomeScreen {
  screen: "Home";
  account: Account;
};

export interface LobbyMember {
  accountId: string;
  ready: boolean;
}

export interface LobbyScreen {
  screen: "Lobby";
  account: Account;
  lobbyId: string;
  ready: boolean;
  lobbyMembers: LobbyMember[];
};

export interface PlayScreen {
  screen: "Play";
  gameId: string;
  game: GameState;
};

export type AppScreen = LoginScreen | HomeScreen | LobbyScreen | PlayScreen;
