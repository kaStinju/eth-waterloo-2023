import Sketch from "react-p5";
import p5Types from "p5";

import { C_RED, C_WHITE, drawNoun, flippedImage, isIn, loadImages, Resources } from '../p5-utils';
import { GameState, GameWindowProps, Noun, Team } from '../game-types';
import { battle, BattleStep } from "../fight-utils";
import { easeInOutSine, easeInQuad, easeOutElastic } from "../animation-utils";

interface BattleLiveState {
  a: Team;
  b: Team;
  sequence: BattleStep[];
  attacking: boolean;
  t0: number;
}

const STEP_MILLIS = 1000;

function largeImage(p5: p5Types, resources: Resources, noun: Noun, x: number, y: number, flipped: boolean) {
  const rectSize = 32
  const image = resources.imageMap.get(noun.imageURL);
  if (!image) {
    throw Error("No image");
  }
  if (flipped) {
    flippedImage(p5, image, x, y, 128)
  } else {
    p5.image(image, x, y, rectSize * 4, rectSize * 4)
  }
  //attack
  p5.fill(C_WHITE)
  p5.rect(x, y + rectSize * 4, rectSize, rectSize)
  p5.fill(0)
  p5.text(noun.attack, x + 2, y + rectSize * 4, rectSize, rectSize)

  p5.fill(C_RED)
  p5.rect(x + rectSize * 3, y + rectSize * 4, rectSize, rectSize)
  p5.fill(0)
  p5.text(noun.hp, x + rectSize * 3 + 2, y + rectSize * 4, rectSize, rectSize)
}

export function Battle({state, setState}: GameWindowProps) {
  const enemy = state.enemies[0];
  // See annotations in JS for more information
  let resources: Resources | null = null;
  let liveState: BattleLiveState | null = null;

  function preload(p5: p5Types) {
    const imageUrls: string[] = [
      ...state.team.nouns.map((x) => x.imageURL),
      ...enemy.team.nouns.map((x) => x.imageURL),
    ];
    resources = { imageMap: loadImages(p5, imageUrls) };
  }

  function setup(p5: p5Types, canvasParentRef: Element) {
    liveState = {
      a: state.team,
      b: state.enemies[0].team,
      sequence: battle(state.team, state.enemies[0].team),
      t0: p5.millis(),
      attacking: false,
    };
    liveState.attacking = liveState.sequence[0].attacking;

    const interval = setInterval(() => {
      if (!liveState) throw Error("State missing");
      const step = liveState.sequence.shift();
      if (!step) {
        clearInterval(interval);
        let enemyHp = enemy.hp;
        let hp = state.hp;
        if (liveState.a.nouns.length > 0) {
          enemyHp --;
        }
        if (liveState.b.nouns.length > 0) {
          hp --;
        }
        const newState = {...state, hp, enemies: state.enemies.map((x, i) => (i == 0 ? { ...enemy, hp: enemyHp } : x))};
        if (hp == 0) {
          setState({...newState, phase: "Defeat"});
        } else if (enemyHp == 0) {
          setState({...newState, phase: "Victory"});
        } else {
          setState({...newState, turn: newState.turn + 1, phase: "Shopping" });
        }
        return;
      }
      liveState.a = step.a;
      liveState.b = step.b;
      liveState.t0 = p5.millis();
      if (liveState.sequence.length > 0) {
        liveState.attacking = liveState.sequence[0].attacking;
      } else {
        liveState.attacking = false;
      }

    }, STEP_MILLIS);

    p5.createCanvas(900, 600).parent(canvasParentRef);
  };

  function drawFight(p5: p5Types) {
    if (!liveState) throw Error("State missing");
    if (!resources) throw Error("Resources missing");
    p5.background(230);
    const spacing = 70
    const rectSize = 32
    const teamsY = 400
    const canvasHalf = 450
    const spacingFromMiddle = 96
    const leftPosition = canvasHalf - spacingFromMiddle
    const rightPosition = canvasHalf + 32
    const mainSpacingLeft = canvasHalf - (spacingFromMiddle * 2)
    const mainSpacingRight = canvasHalf + (rectSize * 2)

    p5.stroke(C_WHITE)
    p5.line(canvasHalf, 0, canvasHalf, 900)

    const t = p5.millis() - liveState.t0;
    const atk_t = STEP_MILLIS * (3/4);
    const x = liveState.attacking ?
      (t < atk_t ? easeOutElastic(t / atk_t) : easeInOutSine(1 - (t - atk_t) / (STEP_MILLIS - atk_t))) * 50 
      : 0;
    const deadY = easeInQuad(t / STEP_MILLIS) * (-800);

    const {a, b} = liveState;
    for (let k = 0; k < a.nouns.length; k++) {
      drawNoun(p5, resources, a.nouns[k], leftPosition - (spacing * k), teamsY, false)
    }
    if (a.nouns.length > 0) {
      const dead = a.nouns[0].hp <= 0;
      const y = 180 + (dead ? deadY : 0);
      largeImage(p5, resources, a.nouns[0], mainSpacingLeft + x, y, false)
    }
    for (let k = 0; k < b.nouns.length; k++) {
      drawNoun(p5, resources, b.nouns[k], rightPosition + (spacing * k), teamsY, true)
    }
    if (b.nouns.length > 0) {
      const dead = b.nouns[0].hp <= 0;
      const y = 180 + (dead ? deadY : 0);
      largeImage(p5, resources, b.nouns[0], mainSpacingRight - x, y, true)
    }
  }

  return (<Sketch setup={setup} draw={drawFight} preload={preload} />)
}
