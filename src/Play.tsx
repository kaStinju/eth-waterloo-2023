import { AppStateProps, PlayState } from './app-types';
import { Battle } from './Components/Battle';
import { teamLions } from './dummydata';
import { GameState } from './game-types';

export function Play({state, setState}: AppStateProps<PlayState>) {
  const mockGame: GameState = { ...state.game, enemies: [{ accountId: "bot", hp: 5, team: teamLions }] };
  return <div>
    <h1>This is the game</h1>
    <Battle state={mockGame} setState={(game: GameState) => setState((s) => ({ ...s, game }))}/>
  </div>
}
