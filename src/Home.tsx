import { useState } from "react";
import { AppStateProps, HomeState, LobbyState } from "./app-types";


const LOBBY_ID_LENGTH = 4;

function validateLobbyId(lobbyId: string, partial: boolean) {
  if (lobbyId.length > LOBBY_ID_LENGTH) {
    return false;
  }
  if (!partial && lobbyId.length < LOBBY_ID_LENGTH) {
    return false;
  }
  for (const c of lobbyId) {
    if (!['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(c)) {
      return false;
    }
  }
  return true;
}

function randomLobbyId(): string {
  const chars = [];
  for (let i = 0; i < 4; i ++) {
    chars.push((Math.floor(Math.random() * 10)).toString())
  }
  return chars.join("")
}

export function Home({state, setState}: AppStateProps<HomeState>) {
  const [lobbyId, setLobbyId] = useState("");
  const lobbyState: LobbyState = { ...state, stateName: "Lobby", lobbyMembers: [], ready: false, lobbyId };
  return <div>
    <h1>Home</h1>
    <ul>
      <li><button onClick={
        () => setState({ ...lobbyState, lobbyId: randomLobbyId() })
      }>Play</button></li>
      <li>
        <form onSubmit={
          (e) => {
            if (validateLobbyId(lobbyId, false)) setState(lobbyState);
            e.preventDefault();
          }
        }>
        <input type="text" value={lobbyId} onChange={(e) => {
          if (validateLobbyId(e.target.value, true)) setLobbyId(e.target.value)
        }}/>
        <input type="submit" value="Join" />
        </form>
      </li>
    </ul>
  </div>
}
