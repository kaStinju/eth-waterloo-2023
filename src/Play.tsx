import { AppStateProps, PlayState } from './app-types';
import { Battle } from './Components/Battle';
import { Communication } from './Components/Communication';
import { Shop } from './Components/Shop';
import { GameState } from './game-types';

export function Play({state, setState}: AppStateProps<PlayState>) {
  switch (state.game.phase) {
    case "Shopping":
      return <Shop state={state.game} setState={(game: GameState) => setState((s) => ({ ...s, game }))}/>
    case "Communication":
      return <Communication app={state} state={state.game} setState={(game: GameState) => setState((s) => ({ ...s, game }))}/>
    case "Fighting":
      return <Battle state={state.game} setState={(game: GameState) => setState((s) => ({ ...s, game }))}/>
    default:
      return <p>Invalid phase: {state.game.phase}</p>
  }
}
