import { Wallet, ethers } from 'ethers'
import { Client } from '@xmtp/xmtp-js';
import { AppStateProps, Account, LoginState, HomeState, LobbyState } from './app-types';
import { useEffect } from 'react';
import crow from '../src/assets/noun732.svg'

async function nextState(state: LoginState, wallet: Wallet): Promise<HomeState | LobbyState> {
  const account: Account = {
    accountId: await wallet.getAddress(),
    wallet,
    xmtp: await Client.create(wallet), // XMTP dev
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

function getLobbyId(): string | null {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get("lobby");
}


async function browserWallet(): Promise<Wallet> {
  const provider = new ethers.BrowserProvider(
    (window as any).ethereum
  );
  await provider.send("eth_requestAccounts", []);
  return await provider.getSigner() as unknown as Wallet;
}

export function Login({ state, setState }: AppStateProps<LoginState>) {
  useEffect(() => {
    const lobbyId = getLobbyId();
    if (lobbyId) {
      setState((s) => ({ ...s, lobbyId }));
    }
  }, []);
  return (<div className='login'>
    <h1>The Noun Knockout Card Game</h1>
    <table>
      <tbody>
        <tr>
          <td><button onClick={async () => setState(await nextState(state, await browserWallet()))}>Login with ETH</button></td>
        </tr>
        <tr>
          <td><button onClick={async () => setState(await nextState(state, guestWallet()))}>Login as guest</button></td>
        </tr>
      </tbody>
    </table>
    <img src={crow} style={{ "height": "100%", "width": "500px" }} />
  </div >)
}
