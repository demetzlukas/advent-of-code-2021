import { readFileFromInput } from '../utils/readFile';

const filename = './input/17.txt';

export async function main() {
  const [xMin, xMax, yMin, yMax] = (await readFileFromInput(filename))
    .match(/target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/)
    .slice(1)
    .map(Number);

  const valid: [xVelocity: number, yVelocity: number, maxHeight: number][] = [];

  const threshold = 500;
  for (let xVelocity = -threshold; xVelocity < threshold; xVelocity++) {
    for (let yVelocity = -threshold; yVelocity < threshold; yVelocity++) {
      const heights: number[] = [];
      if (
        hitsTargetArea(xVelocity, yVelocity, xMin, xMax, yMin, yMax, heights)
      ) {
        valid.push([xVelocity, yVelocity, Math.max(...heights)]);
      }
    }
  }

  console.log(
    'Part 1:',
    valid.sort(([, , heightA], [, , heightB]) => heightB - heightA)[0][2]
  );
  console.log('Part 2:', valid.length);
}

function hitsTargetArea(
  xVelocity: number,
  yVelocity: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  heights: number[]
): boolean {
  let x = 0;
  let y = 0;
  while (true) {
    x += xVelocity;
    y += yVelocity;
    heights.push(y);

    yVelocity--;
    if (xVelocity !== 0) {
      xVelocity += Math.sign(xVelocity) * -1;
    }
    if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
      return true;
    }
    if (x > xMax || y < yMin) {
      return false;
    }
  }
}
