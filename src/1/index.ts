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
  return values
    .slice(index, index + windowSize)
    .reduce((sum, current) => sum + current);
}

function calculateIncreases(values: number[], windowSize: number): number {
  let increases = 0;
  let previousValue = calculateValue(values, 0, windowSize);

  for (let i = 1; i < values.length - windowSize + 1; i++) {
    const currentValue = calculateValue(values, i, windowSize);

    if (currentValue > previousValue) {
      increases++;
    }
    previousValue = currentValue;
  }

  return increases;
}
