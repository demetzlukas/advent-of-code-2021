import { readFileFromInput } from '../utils/readFile';

const filename = './input/7.txt';

export async function main() {
  const positions = (await readFileFromInput(filename))
    .split(',')
    .map((position) => parseInt(position));

  console.log('Part 1:', calculateNeededFuel(positions));
  console.log('Part 2:', calculateNeededFuel(positions, true));
}

function calculateNeededFuel(
  positions: number[],
  increasingFuel = false
): number {
  const maxPosition = positions.reduce((max, v) => (v > max ? v : max));

  const fuels: number[] = [];
  for (const possiblePosition of [...Array(maxPosition + 1).keys()]) {
    let sumOfChanges = 0;
    positions.forEach((position) => {
      const changes = Math.abs(possiblePosition - position);
      sumOfChanges += increasingFuel ? (changes * (changes + 1)) / 2 : changes;
    });
    fuels.push(sumOfChanges);
  }

  return fuels.reduce((min, value) => (value < min ? value : min));
}
