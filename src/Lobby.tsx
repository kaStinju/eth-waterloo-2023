import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { AppStateProps, LobbyState } from './app-types';
import { GameState } from './game-types';
import { broadcast, listen } from './xmtp-utils';
import { teamTigers } from './dummydata';
import Recommendations from './Components/Recommendations';


interface LobbyMemberStatus {
  accountId: string;
  ready: boolean;
}


const LOBBY_PREFIX = "noun-battler/"
const DEFAULT_TEAM = teamTigers;
const DEFAULT_HP = 5;

async function broadcastStatus(state: LobbyState) {
  const status = { accountId: state.account.accountId, ready: state.ready };
  await broadcast(
    state.account.xmtp,
    LOBBY_PREFIX + state.lobbyId,
    JSON.stringify(status),
  );
}

function listenStatus(state: LobbyState, onStatus: (status: LobbyMemberStatus) => void) {
  return listen(
    state.account.xmtp,
    LOBBY_PREFIX + state.lobbyId,
    (text) => onStatus(JSON.parse(text)),
  );
}

function gameId(state: LobbyState): string {
  const accountIds = [state.account.accountId, ...state.lobbyMembers.map((x) => x.accountId)]
  accountIds.sort()
  return ethers.id(accountIds.join())
}

function gameState(state: LobbyState): GameState {
  return {
    phase: "Shopping",
    turn: 1,
    hp: DEFAULT_HP,
    team: DEFAULT_TEAM,
    enemies: state.lobbyMembers.map((x) => ({ accountId: x.accountId, hp: DEFAULT_HP, team: DEFAULT_TEAM })),
  }
}


export function Lobby({ state, setState }: AppStateProps<LobbyState>) {
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const baseUrl = window.location.origin + window.location.pathname;
  const inviteUrl = `${baseUrl}?lobby=${state.lobbyId}`;


  useEffect(() => {
    broadcastStatus(state);
  }, [state.ready]);

  useEffect(() => {
    return listenStatus(state, (incomingStatus) => {
      if (incomingStatus.accountId === state.account.accountId) return;
      if (!state.lobbyMembers.map((m) => m.accountId).includes(incomingStatus.accountId)) { // New member
        setState((s) => ({ ...s, lobbyMembers: [...s.lobbyMembers, incomingStatus] }));
        broadcastStatus(state);
      } else {
        for (let i = 0; i < state.lobbyMembers.length; i++) {
          if (
            state.lobbyMembers[i].accountId == incomingStatus.accountId &&
            state.lobbyMembers[i].ready != incomingStatus.ready
          ) {
            setState((s) => {
              const newLobbyMembers = [...s.lobbyMembers];
              newLobbyMembers[i] = incomingStatus;
              return { ...s, lobbyMembers: newLobbyMembers };
            });
            break;
          }
        }
      }
      // incomingStatus.accountId
    });
  }, [state.lobbyMembers]);

  useEffect(() => {
    if (state.ready && state.lobbyMembers.every((x) => x.ready)) {
      if (!timeoutId) {
        setTimeoutId(setTimeout(() => setState((s) => (
          { stateName: "Play", account: s.account, game: gameState(s), gameId: gameId(s) }
        )), 2000));
      }
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [state.ready, state.lobbyMembers, timeoutId]);

  return <div>
    <h1>Lobby</h1>
    <h2>{state.lobbyId}</h2>
    <ul>
      <li><button onClick={() => setState({ ...state, ready: !state.ready })}>Ready</button></li>
      <li><b>{state.account.accountId}{state.ready ? " - Ready" : ""}</b></li>
      {state.lobbyMembers.map((x) => (<li key={x.accountId}>{x.accountId}{x.ready ? " - Ready" : ""}</li>))}
    </ul>
    {timeoutId && <p>Starting...</p>}
    <Recommendations account={state.account} inviteUrl={inviteUrl} />
  </div>
}
