import { parseInt, range } from 'lodash';
import { readLinesFromInput } from '../utils/readFile';

const filename = './input/11.txt';

export async function main() {
  let energyLevels = (await readLinesFromInput(filename)).map((line) =>
    line.split('').map((cell) => parseInt(cell))
  );

  let flashes = 0;
  let steps = 100;

  range(steps).forEach(() => {
    flashes += step(energyLevels);
  });

  console.log('Part 1:', flashes);

  while (!energyLevels.every((row) => row.every((cell) => cell === 0))) {
    step(energyLevels);
    steps++;
  }
  console.log('Part 2:', steps);
}

function step(energyLevels: number[][]): number {
  const flashed: string[] = [];

  energyLevels.forEach((row, rowIndex) => {
    row.forEach((_, columnIndex) => {
      increaseEnergyLevel(energyLevels, rowIndex, columnIndex, flashed);
    });
  });

  return flashed.length;
}

function increaseEnergyLevel(
  energyLevels: number[][],
  row: number,
  column: number,
  flashed: string[]
): void {
  if (flashed.includes(`${row}x${column}`)) {
    return;
  }
  energyLevels[row][column]++;

  if (energyLevels[row][column] > 9) {
    energyLevels[row][column] = 0;
    flashed.push(`${row}x${column}`);
    for (const [neighborRow, neighborColumn] of getAdjacent(
      energyLevels,
      row,
      column
    )) {
      increaseEnergyLevel(energyLevels, neighborRow, neighborColumn, flashed);
    }
  }
}

function* getAdjacent(field: any[][], row: number, column: number) {
  for (const x of [-1, 0, 1]) {
    const dx = row + x;
    if (dx < 0 || dx >= field.length) {
      continue;
    }
    for (const y of [-1, 0, 1]) {
      const dy = column + y;
      if (dy < 0 || dy >= field[row].length || (x == 0 && y == 0)) {
        continue;
      }
      yield [dx, dy];
    }
  }
}
