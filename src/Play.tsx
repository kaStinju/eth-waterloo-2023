import { AppStateProps, PlayState } from './app-types';

export function Play({state, setState}: AppStateProps<PlayState>) {
  return <div>
    <h1>This is the game</h1>
  </div>
}
