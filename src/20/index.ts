import { readFileFromInput } from '../utils/readFile';

const filename = './input/20.txt';

export async function main() {
  const input = (await readFileFromInput(filename)).split('\r\n\r\n');
  const algorithm = input[0].split('');
  let image: Map<string, string> = new Map(
    input[1]
      .split('\r\n')
      .flatMap((row, i) => row.split('').map((cell, j) => [getKey(i, j), cell]))
  );

  let minIndex = -1;
  let maxIndex = input[1].split('\r\n').length + 1;
  const rounds = 50;

  for (let round = 0; round < rounds; round++) {
    image = enhanceImage(minIndex--, maxIndex++, image, round, algorithm);
    if (round === 1) {
      console.log('Part 1:', getNumberOfLitPixels(image));
    }
  }
  console.log('Part 2:', getNumberOfLitPixels(image));
}

function enhanceImage(
  minIndex: number,
  maxIndex: number,
  image: Map<string, string>,
  round: number,
  algorithm: string[]
) {
  const nextImage: Map<string, string> = new Map();
  for (let row = minIndex; row < maxIndex; row++) {
    for (let column = minIndex; column < maxIndex; column++) {
      let binaryDigit = '';

      for (const [x, y] of geAdjacentIndices(row, column)) {
        if (!image.has(getKey(x, y))) {
          binaryDigit +=
            round % 2 === 0 ? algorithm[algorithm.length - 1] : algorithm[0];
        } else {
          binaryDigit += image.get(getKey(x, y));
        }
      }

      binaryDigit = binaryDigit.replace(/\./g, '0');
      binaryDigit = binaryDigit.replace(/#/g, '1');

      nextImage.set(getKey(row, column), algorithm[parseInt(binaryDigit, 2)]);
    }
  }
  return nextImage;
}

function getNumberOfLitPixels(image: Map<string, string>): number {
  return [...image.values()].filter((c) => c === '#').length;
}

function getKey(x: number, y: number): string {
  return `${x}x${y}`;
}

function geAdjacentIndices(row: number, column: number): number[][] {
  const indices: number[][] = [];
  for (const x of [-1, 0, 1]) {
    for (const y of [-1, 0, 1]) {
      indices.push([row + x, column + y]);
    }
  }

  return indices;
}
