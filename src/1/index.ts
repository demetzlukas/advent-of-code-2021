import { readLinesFromInput } from '../utils/readFile';

const filename = './input/1.txt';

export async function main() {
  const depths = (await readLinesFromInput(filename)).map((l) => parseInt(l));

  console.log('Part 1:', calculateIncreases(depths, 1));
  console.log('Part 2:', calculateIncreases(depths, 3));
}

function calculateValue(
  values: number[],
  index: number,
  windowSize: number
): number {
  let sum = 0;

  for (let i = index; i < index + windowSize; i++) {
    sum += values[i];
  }

  return sum;
}

function calculateIncreases(depth: number[], windowSize: number): number {
  let increases = 0;
  let previousValue = calculateValue(depth, 0, windowSize);

  for (let i = 1; i < depth.length - windowSize + 1; i++) {
    const currentValue = calculateValue(depth, i, windowSize);

    if (currentValue > previousValue) {
      increases++;
    }
    previousValue = currentValue;
  }

  return increases;
}
