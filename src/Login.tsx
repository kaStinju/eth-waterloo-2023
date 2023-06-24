import { Wallet } from 'ethers'
import { Client } from '@xmtp/xmtp-js';
import { AppStateProps, Account, LoginState, HomeState, LobbyState } from './app-types';

async function nextState(state: LoginState, wallet: Wallet): Promise<HomeState | LobbyState> {
  const account: Account = {
    accountId: await wallet.getAddress(),
    wallet,
    xmtp: await Client.create(wallet),
  }
  if (state.lobbyId) {
    return {
      stateName: "Lobby",
      account,
      lobbyMembers: [],
      ready: false,
      lobbyId: state.lobbyId,
    };
  }
  return {
    stateName: "Home",
    account,
  }
}

function guestWallet(): Wallet {
  return Wallet.createRandom() as unknown as Wallet;
}

export function Login({state, setState}: AppStateProps<LoginState>) {
  return <div>
    <h1>Login</h1>
    <ul>
      <li><button onClick={() => alert("Not implemented")}>Play</button></li>
      <li><button onClick={async () => setState(await nextState(state, guestWallet()))}>Play as guest</button></li>
    </ul>
  </div>
}
