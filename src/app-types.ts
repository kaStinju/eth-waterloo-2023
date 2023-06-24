import { Client } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";
import { GameState } from "./game-types";

export interface Account {
  accountId: string;
  wallet: Wallet;
  xmtp: Client,
}

export interface LoginState {
  stateName: "Login";
  lobbyId?: string;
};

export interface HomeState {
  stateName: "Home";
  account: Account;
};

export interface LobbyMember {
  accountId: string;
  ready: boolean;
}

export interface LobbyState {
  stateName: "Lobby";
  account: Account;
  lobbyId: string;
  ready: boolean;
  lobbyMembers: LobbyMember[];
};

export interface PlayState {
  stateName: "Play";
  account: Account;
  gameId: string;
  game: GameState;
};

export type SetAppState<S> = (x: ((s: S) => S | AppState) | S | AppState) => void;

export interface AppStateProps<S> {
  state: S;
  setState: SetAppState<S>;
}

export type AppState = LoginState | HomeState | LobbyState | PlayState;
