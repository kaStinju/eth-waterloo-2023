import { useEffect, useState } from 'react';
import { PlayState } from '../app-types';
import { GameWindowProps, Team } from '../game-types';
import { broadcast, listen } from '../xmtp-utils';

const LOBBY_PREFIX = "noun-battler/play/"

interface TeamUpdate {
  accountId: string,
  team: Team,
}

export function Communication({state, setState, app}: GameWindowProps & { app: PlayState }) {
  const myUpdate = { accountId: app.account.accountId, team: state.team };
  const [teams, setTeams] = useState<TeamUpdate[]>([myUpdate]);
  const channel = `${LOBBY_PREFIX}${app.gameId}`;
  useEffect(() => {
    broadcast(app.account.xmtp, channel, JSON.stringify(myUpdate));
  }, []);

  useEffect(() => {
    return listen(app.account.xmtp, channel, (text) => {
      const incoming: TeamUpdate = JSON.parse(text);
      if (!teams.map((x) => x.accountId).includes(incoming.accountId)) {
        setTeams([...teams, incoming]);
        broadcast(app.account.xmtp, channel, JSON.stringify(myUpdate));
      }
    })
  }, [teams]);

  useEffect(() => {
    if (teams.length === state.enemies.length + 1) {
      setState({
        ...state,
        phase: "Fighting",
        enemies: state.enemies.map((e) => ({
          ...e, team: teams.filter((t) => t.accountId === e.accountId)[0].team
      }))})
    }
  }, [teams]);
  
  return <h1>{teams.length}/{state.enemies.length + 1}</h1>
}
