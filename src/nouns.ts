import { v4 as uuidv4 } from 'uuid'
import { Noun } from './game-types';

function randomInt(max: number) {
  return Math.floor(Math.random() * max)
}

export function makeNoun(nounIndex: number, hp: number, attack: number): Noun {
  return {
    imageURL: `https://noun.pics/${nounIndex}`,
    hp,
    attack,
    id: uuidv4(),
  }
}

export function randomNoun(powerLevel: number) {
  const sum = powerLevel * 2 + randomInt(4);
  const atk = 1 + randomInt(sum - 2);
  const hp = sum - atk;
  const idx = randomInt(500);
  return makeNoun(idx, hp, atk);
}
