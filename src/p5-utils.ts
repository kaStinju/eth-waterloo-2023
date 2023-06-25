import p5Types from "p5";
import { Noun } from "./game-types";

export const C_RED = '#FFAAAA'
export const C_BLUE = '#AAAAFF'
export const C_WHITE = '#FFFFFF'

export interface Resources {
  imageMap: Map<string, p5Types.Image>,
}


export function loadImages(p5: p5Types, urls: string[]): Map<string, p5Types.Image> {
  const images: Map<string, p5Types.Image> = new Map();
  for (const url of urls) {
    if (!images.has(url)) {
      images.set(url, p5.loadImage(url));
    }
  }
  return images;
}

export function flippedImage(p5: p5Types, image: p5Types.Image, x: number, y: number, size: number) {
  p5.push();
  p5.translate(x + size, y);
  p5.scale(-1, 1);
  p5.image(image, 0, 0, size, size)
  p5.pop();
}

export function isIn(p5: p5Types, x: number, y: number, w: number, h: number) {
  if (p5.mouseX > x && p5.mouseX < x + w && p5.mouseY > y && p5.mouseY < y + h) {
    return true
  }
}

export function drawNoun(p5: p5Types,
  resources: Resources,
  noun: Noun,
  x: number,
  y: number,
  flipped: boolean,
  target: boolean = false,
) {
  const size = 64;
  const spacing = 4;
  const rectSize = 32
  const border = 4;
  const image = resources.imageMap.get(noun.imageURL);
  if (!image) {
    throw Error("No image");
  }
  // Border if selected
  if (target) {
    p5.fill(C_BLUE)
    p5.rect(x - border, y - border, size + 2*border, size + 2*border + spacing + rectSize)
    p5.fill(0)
  }
  //draws image
  if (flipped) {
    flippedImage(p5, image, x, y, size);
  } else {
    p5.image(image, x, y, size, size)
  }

  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.textSize(16)
  //draws health
  p5.fill(C_RED)
  p5.rect(x + rectSize, y + size + spacing, rectSize, rectSize)
  p5.fill(0)
  p5.text(noun.hp, x + 48, y + 16 + spacing + size)
  //draws power
  p5.fill(C_WHITE)
  p5.rect(x, y + size + spacing, rectSize, rectSize)
  p5.fill(0)
  p5.text(noun.attack, x + 16, y + 16 + spacing + size)
}

export interface HitboxTrigger {
  x: number;
  y: number;
  width: number;
  height: number;
  onClick: () => void;
}

export function createHitboxHandler(getHitboxes: () => HitboxTrigger[]) {
  return function mouseClicked(p5: p5Types) {
    getHitboxes().forEach(({x, y, width, height, onClick}) => {
      if (isIn(p5, x, y, width, height)) {
        onClick();
      }
    })
  }
}
