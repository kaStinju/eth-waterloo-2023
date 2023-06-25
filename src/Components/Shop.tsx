import Sketch from "react-p5";
import p5Types from "p5";

import { createHitboxHandler, C_BLUE, C_WHITE, drawNoun, HitboxTrigger, loadImages, Resources } from '../p5-utils';
import { Team, GameWindowProps, Noun } from '../game-types';
import { teamTigers } from "../dummydata";
import { NounIndex } from "../nouns";

const SIZE = 64;
const SPACING = 70;

const MAX_TEAM_SIZE = 5;
const TEAM_Y = 225;
const TEAM_RIGHT = 450;
const TEAM_ROAD_TOP = TEAM_Y + 25;

const MAX_SHOP_SIZE = 5;
const SHOP_Y = 425;
const SHOP_ROAD_TOP = SHOP_Y + 25;
const SHOP_LEFT = 170;

const BUTTONS_LEFT = 725;
const BUTTONS_W = 125;
const BT = 16;

const UNIT_COST = 3;
const SELL_GOLD = 1;

interface ShopLiveState {
  team: Team;
  shop: Noun[];
  hitboxes: HitboxTrigger[];
  target: string | null;
  gold: number;
}

function drawStats(p5: p5Types, gold: number, hp: number) {
  p5.fill(0)
  p5.textAlign(p5.LEFT, p5.TOP);
  p5.textSize(48)
  p5.text(`$${gold}  ♥ ${hp}`, 16, 16)
}

function drawInfo(p5: p5Types, go: boolean, sell: boolean) {
  p5.fill(C_WHITE)
  p5.textAlign(p5.LEFT, p5.CENTER);
  p5.textSize(48)
  p5.text("Team", 16, TEAM_ROAD_TOP + SIZE/2)
  p5.text("Store", 16, SHOP_ROAD_TOP + SIZE/2)
  p5.textAlign(p5.CENTER, p5.CENTER);
  if (go) {
    p5.fill(C_BLUE)
    p5.rect(BUTTONS_LEFT - BT, TEAM_ROAD_TOP - BT, BUTTONS_W + BT*2, SIZE + BT*2)
    p5.fill(0)
    p5.text("Go", BUTTONS_LEFT + BUTTONS_W/2, TEAM_ROAD_TOP + SIZE/2)
  }
  if (sell) {
    p5.fill(C_BLUE)
    p5.rect(BUTTONS_LEFT - BT, SHOP_ROAD_TOP - BT, BUTTONS_W + BT*2, SIZE + BT*2)
    p5.fill(0)
    p5.text("Sell", BUTTONS_LEFT + BUTTONS_W/2, SHOP_ROAD_TOP + SIZE/2)
  }
  p5.fill(0)
}

export function Shop({state, setState}: GameWindowProps) {
  let resources: Resources | null = null;
  let liveState: ShopLiveState | null = null;

  function preload(p5: p5Types) {
    resources = { imageMap: loadImages(p5, NounIndex.map((x) => x.imageURL)) };
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
      shop: [teamTigers.nouns[0], teamTigers.nouns[1], teamTigers.nouns[2]],
      target: null,
      gold: 10,
    }
    p5.createCanvas(900, 600).parent(canvasParentRef);
    // Team
    for (let i = 0; i < MAX_TEAM_SIZE; i++) {
      const x = TEAM_RIGHT - SPACING * i;
      liveState.hitboxes.push({ x, y: TEAM_Y, width: SIZE, height: SIZE, onClick: () => {
        if (!liveState) throw Error("State missing");
        if (i >= liveState.team.nouns.length) return;
        const id = liveState.team.nouns[i].id;
        if (liveState.target) {
          swap(id, liveState.target);
          liveState.target = null
        } else {
          liveState.target = id;
        }
      }});
    }
    // Shop
    for (let i = 0; i < MAX_SHOP_SIZE; i++) {
      const x = SHOP_LEFT + SPACING * i;
      liveState.hitboxes.push({ x, y: SHOP_Y, width: SIZE, height: SIZE, onClick: () => {
        if (!liveState) throw Error("State missing");
        if (i >= liveState.shop.length) return;
        if (liveState.gold >= UNIT_COST && liveState.team.nouns.length < MAX_TEAM_SIZE) {
          liveState.gold -= UNIT_COST;
          liveState.team.nouns.push(liveState.shop.splice(i, 1)[0])
        }
      }});
    }
    // Go
    liveState.hitboxes.push({ x: BUTTONS_LEFT - BT, y: TEAM_ROAD_TOP - BT, width: BUTTONS_W + BT*2, height: SIZE + BT*2, onClick: () => {
      if (!liveState) throw Error("State missing");
      if (!(liveState.team.nouns.length > 0)) return;
      setState({...state, team: liveState.team, phase: "Communication" });
    }});
    // Sell
    liveState.hitboxes.push({ x: BUTTONS_LEFT - BT, y: SHOP_ROAD_TOP - BT, width: BUTTONS_W + BT*2, height: SIZE + BT*2, onClick: () => {
      if (!liveState) throw Error("State missing");
      if (!(liveState.team.nouns.length > 1 && liveState.target !== null)) return;
      const target = liveState.target;
      liveState.gold += SELL_GOLD;
      liveState.team.nouns = liveState.team.nouns.filter((x) => x.id !== target);
      liveState.target = null;
    }});
  };

  function draw(p5: p5Types) {
    if (!liveState) throw Error("State missing");
    if (!resources) throw Error("Resources missing");
    const { team, shop } = liveState;
    // Background
    p5.background(200);
    p5.rect(0, TEAM_ROAD_TOP, p5.width, SIZE)
    p5.rect(0, SHOP_ROAD_TOP, p5.width, SIZE)
    // Team
    for (let i = 0; i < team.nouns.length; i++) {
      const x = TEAM_RIGHT - SPACING * i;
      drawNoun(p5, resources, team.nouns[i], x, TEAM_Y, false, liveState.target == team.nouns[i].id)
    }
    // Shop
    for (let i = 0; i < shop.length; i++) {
      const x = SHOP_LEFT + SPACING * i;
      drawNoun(p5, resources, shop[i], x, SHOP_Y, false)
    }
    drawStats(p5, liveState.gold, state.hp)
    drawInfo(p5, liveState.team.nouns.length > 0, liveState.team.nouns.length > 1 && liveState.target !== null)
  }

  const mouseClicked = createHitboxHandler(() => {
    if (!liveState) throw Error("State missing");
    return liveState.hitboxes;
  })

  return (<Sketch setup={setup} draw={draw} preload={preload} mouseClicked={mouseClicked} />)
}
