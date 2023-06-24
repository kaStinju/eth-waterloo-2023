import Sketch from "react-p5";
import p5Types from "p5";

import { Team, Noun } from '../game-types';
import { teamTigers, teamLions } from '../dummydata';

const teams = [teamTigers, teamLions]
const red = '#FFAAAA'
const white = '#FFFFFF'
const hitbox: Map<string, any> = new Map();
let target: string | null = null;

function flippedImage(p5: p5Types, image: p5Types.Image, x: number, y: number, size: number) {
  p5.push();
  p5.translate(x + size, y);
  p5.scale(-1, 1);
  p5.image(image, 0, 0, size, size)
  p5.pop();
}


function isIn(p5: p5Types, x: number, y: number, w: number, h: number) {
  if (p5.mouseX > x && p5.mouseX < x + w && p5.mouseY > y && p5.mouseY < y + h) {
    return true
  }
}

function drawNoun(p5: p5Types,
  images: Map<string, p5Types.Image>,
  noun: Noun,
  x: number,
  y: number,
  flipped: boolean,
  onClick: () => void = () => { }) {
  const size = 64;
  const spacing = 4;
  const rectSize = 32
  const image = images.get(noun.imageURL);
  if (!image) {
    throw Error("No image");
  }
  //draws image
  if (flipped) {
    p5.push();
    p5.translate(x + size, y);
    p5.scale(-1, 1);
    p5.image(image, 0, 0, size, size)
    p5.pop();
  } else {
    p5.image(image, x, y, size, size)
  }

  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.textSize(16)
  //draws health
  p5.fill(red)
  p5.rect(x, y + size + spacing, rectSize, rectSize)
  p5.fill(0)
  p5.text(noun.hp, x + 16, y + 16 + spacing + size)
  //draws power
  p5.fill(white)
  p5.rect(x + rectSize, y + size + spacing, rectSize, rectSize)
  p5.fill(0)
  p5.text(noun.attack, x + 48, y + 16 + spacing + size)


  function hover() {
    if (isIn(p5, x, y, size, size)) {
      p5.rect(x, y, size, size)
    }
    return true
  }
}


function largeImage(p5: p5Types, images: Map<string, p5Types.Image>, noun: Noun, x: number, y: number, flipped: boolean) {
  const rectSize = 32
  const canvasHalf = 450
  const image = images.get(noun.imageURL);
  if (!image) {
    throw Error("No image");
  }
  if (flipped) {
    flippedImage(p5, image, x, 180, 128)
  } else {
    p5.image(image, x, 180, rectSize * 4, rectSize * 4)
  }
  p5.fill(red)
  p5.rect(x, 180 + rectSize * 4, rectSize, rectSize)
  p5.fill(0)
  p5.text(noun.hp, x + 2, 180 + rectSize * 4, rectSize, rectSize)

  //attack
  p5.fill(white)
  p5.rect(x + rectSize * 3, 180 + rectSize * 4, rectSize, rectSize)
  p5.fill(0)
  p5.text(noun.attack, x + rectSize * 3 + 2, 180 + rectSize * 4, rectSize, rectSize)
}

function GameWindow() {
  const spacing = 70
  // See annotations in JS for more information
  const images: Map<string, p5Types.Image> = new Map();
  const preload = (p5: p5Types) => {
    for (let i = 0; i < teams.length; i++) {
      for (let k = 0; k < teams[i].nouns.length; k++) {
        const imageURL = teams[i].nouns[k].imageURL;
        if (!images.has(imageURL)) {
          images.set(imageURL, p5.loadImage(imageURL));
        }
      }
    }
  }

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(900, 600).parent(canvasParentRef);
  };

  let x1 = 0
  let x2 = 0

  function fight(p5: p5Types) {
    p5.background(200);
    const size = 64
    const spacing = 70
    const rectSize = 32
    const teamsY = 400
    const canvasHalf = 450
    const spacingFromMiddle = 96
    const leftPosition = canvasHalf - spacingFromMiddle
    const rightPosition = canvasHalf + 32
    const mainSpacingLeft = canvasHalf - (spacingFromMiddle * 2)
    const mainSpacingRight = canvasHalf + (rectSize * 2)

    p5.stroke(white)
    p5.line(canvasHalf, 0, canvasHalf, 900)

    for (let i = 0; i < teams.length; i++) {
      p5.stroke(0, 0)
      for (let k = 0; k < teams[i].nouns.length; k++) {
        if (i == 0) {
          drawNoun(p5, images, teams[i].nouns[k], leftPosition - (spacing * k), teamsY, false)
          largeImage(p5, images, teams[i].nouns[0], mainSpacingLeft + x1, 180, false)
        }
        if (i == 1) {
          drawNoun(p5, images, teams[i].nouns[k], rightPosition + (spacing * k), teamsY, true)
          largeImage(p5, images, teams[i].nouns[0], mainSpacingRight - x2, 180, true)
        }
      }
    }


    if (teams[0].nouns.length != 0 || teams[1].nouns.length != 0) {
      //x1 = easeOutElastic(p5.millis() / 1500) * 50 clash
      //x2 = easeOutElastic(p5.millis() / 1500) * 50

      //x1 = p5.random(-2, 2) shake
    }
  }

  const draw = (p5: p5Types) => {

    p5.background(200);
    p5.rect(0, 250, p5.width, 64)
    p5.rect(0, 450, p5.width, 64)
    for (let i = 0; i < teams[0].nouns.length; i++) {
      drawNoun(p5, images, teams[0].nouns[i], 100 + spacing * i, 225, false)
      hitbox.set(teams[0].nouns[i].id, { x: 100 + spacing * i, y: 225, width: 64, height: 64 })
    }
  }

  function mouseClicked(p5: p5Types) {
    hitbox.forEach((box, id) => {
      const { x, y, width, height } = box
      if (target) {
        if (isIn(p5, x, y, width, height)) {
          const newTarget = id
          const indexOfNewTarget = teams[0].nouns.map((noun) => noun.id).indexOf(newTarget)
          const indexOfTarget = teams[0].nouns.map((noun) => noun.id).indexOf(target)
          const temp = teams[0].nouns[indexOfNewTarget]
          teams[0].nouns[indexOfNewTarget] = teams[0].nouns[indexOfTarget]
          teams[0].nouns[indexOfTarget] = temp
          target = null
        }
      }
      else if (isIn(p5, x, y, width, height)) {
        target = id
      }
    })
  }


  return (<Sketch setup={setup} draw={draw} preload={preload} mouseClicked={mouseClicked} />)
}

function easeOutElastic(x: number): number {
  const c4 = (2 * Math.PI) / 3;

  return x === 0
    ? 0
    : x === 1
      ? 1
      : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;

}

export default GameWindow