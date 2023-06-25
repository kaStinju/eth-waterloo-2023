import { Team } from './game-types';

export interface BattleStep {
  attacking: boolean;
  a: Team;
  b: Team;
}

function copy(t: Team): Team {
  return JSON.parse(JSON.stringify(t));
}

export function battle(a: Team, b: Team): BattleStep[] {
  const steps: BattleStep[] = [];
  a = copy(a);
  b = copy(b);
  while (a.nouns.length > 0 && b.nouns.length > 0) {
    if (a.nouns[0].hp > 0 && b.nouns[0].hp > 0) {
      b.nouns[0].hp -= a.nouns[0].attack;
      a.nouns[0].hp -= b.nouns[0].attack;
      steps.push({ attacking: true, a: copy(a), b: copy(b) });
    } else {
      if (a.nouns[0].hp <= 0) {
        a.nouns.shift();
      }
      if (b.nouns[0].hp <= 0) {
        b.nouns.shift();
      }
      steps.push({ attacking: false, a: copy(a), b: copy(b) });
    }
  }
  return steps;
}
