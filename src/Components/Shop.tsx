import Sketch from "react-p5";
import p5Types from "p5";

import { createHitboxHandler, drawNoun, HitboxTrigger, loadImages, Resources } from '../p5-utils';
import { Team, GameWindowProps } from '../game-types';

interface ShopLiveState {
  team: Team;
  hitboxes: HitboxTrigger[];
  target: string | null;
}

export function Shop({state, setState}: GameWindowProps) {
  const spacing = 70
  let resources: Resources | null = null;
  let liveState: ShopLiveState | null = null;

  function preload(p5: p5Types) {
    resources = { imageMap: loadImages(p5, state.team.nouns.map((x) => x.imageURL)) };
  }

  function swap(id1: string, id2: string) {
    if (!liveState) throw Error("State missing");
    const ids = liveState.team.nouns.map((noun) => noun.id);
    const idx1 = ids.indexOf(id1);
    const idx2 = ids.indexOf(id2);
    const tmp = liveState.team.nouns[idx2]
    liveState.team.nouns[idx2] = liveState.team.nouns[idx1]
    liveState.team.nouns[idx1] = tmp
  }

  function setup(p5: p5Types, canvasParentRef: Element) {
    liveState = {
      team: state.team,
      hitboxes: [],
      target: null,
    }
    p5.createCanvas(900, 600).parent(canvasParentRef);
    for (let i = 0; i < liveState.team.nouns.length; i++) {
      const x = 100 + spacing * i;
      const y = 225;
      const size = 64;
      liveState.hitboxes.push({ x, y, width: size, height: size, onClick: () => {
        if (!liveState) throw Error("State missing");
        const id = liveState.team.nouns[i].id;
        if (liveState.target) {
          swap(id, liveState.target);
          liveState.target = null
        } else {
          liveState.target = id;
        }
      }});
    }
  };

  function draw(p5: p5Types) {
    if (!liveState) throw Error("State missing");
    if (!resources) throw Error("Resources missing");
    const { team } = liveState;
    p5.background(200);
    p5.rect(0, 250, p5.width, 64)
    p5.rect(0, 450, p5.width, 64)
    for (let i = 0; i < team.nouns.length; i++) {
      const x = 100 + spacing * i;
      const y = 225;
      drawNoun(p5, resources, team.nouns[i], x, y, false)
    }
  }

  const mouseClicked = createHitboxHandler(() => {
    if (!liveState) throw Error("State missing");
    return liveState.hitboxes;
  })

  return (<Sketch setup={setup} draw={draw} preload={preload} mouseClicked={mouseClicked} />)
}
