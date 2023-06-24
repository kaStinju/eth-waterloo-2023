import './App.css';
import { useState } from 'react';
import { AppState, HomeState, LobbyState, LoginState, PlayState, SetAppState } from './app-types';
import { Login } from './Login';
import { Home } from './Home';
import { Lobby } from './Lobby';
import { Play } from './Play';

function App() {
  const [state, setState] = useState<AppState>({ stateName: "Login" })
  switch(state.stateName) {
    case "Login":
      return <Login state={state} setState={setState as SetAppState<LoginState>}/>
    case "Home":
      return <Home state={state} setState={setState as SetAppState<HomeState>}/>
    case "Lobby":
      return <Lobby state={state} setState={setState as SetAppState<LobbyState>}/>
    case "Play":
      return <Play state={state} setState={setState as SetAppState<PlayState>}/>
    default:
      return <div>Invalid app state.</div>
  }
}

export default App;
