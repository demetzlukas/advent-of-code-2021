import { range } from 'lodash';
import { readLinesFromInput } from '../utils/readFile';

const filename = './input/15.txt';

export async function main() {
  const map = (await readLinesFromInput(filename)).map((line) =>
    line.split('').map(Number)
  );

  console.log('Part 1:', getRiskLevel(map));

  const length = map.length;
  const height = map[0].length;
  range(4).forEach(() => increaseMap(map, length, height));

  console.log('Part 2:', getRiskLevel(map));
}

function increaseMap(map: number[][], length: number, height: number) {
  map.forEach((row) => {
    row.slice(-length).forEach((v) => {
      row.push(v === 9 ? 1 : v + 1);
    });
  });

  map.slice(-height).forEach((row) => {
    map.push(row.map((v) => (v === 9 ? 1 : v + 1)));
  });
}

function getRiskLevel(map: number[][], row = 0, column = 0): number {
  return findPaths(map).get(getKey(map.length - 1, map[0].length - 1));
}

function findPaths(map: number[][], row = 0, column = 0): Map<String, number> {
  const costs: Map<string, number> = new Map([[getKey(row, column), 0]]);
  let nodes: [cost: number, row: number, colum: number][] = [[0, row, column]];

  while (nodes.length > 0) {
    const [cost, row, column] = nodes.shift();
    let changedNodes = false;

    getAdjacentIndices(map, row, column).forEach(([x, y]) => {
      const storedCosts = costs.get(getKey(x, y)) ?? Number.MAX_VALUE;
      const calculatedCosts = cost + map[x][y];

      if (calculatedCosts < storedCosts) {
        costs.set(getKey(x, y), calculatedCosts);
        nodes.push([calculatedCosts, x, y]);
        changedNodes = true;
      }
    });

    if (changedNodes) {
      nodes = nodes.sort(([a], [b]) => a - b);
    }
  }

  return costs;
}

function getKey(row: number, column: number): string {
  return `${row}x${[column]}`;
}

function getAdjacentIndices(
  field: number[][],
  row: number,
  column: number
): number[][] {
  const indices = [
    [-1, 0],
    [0, -1],
    [0, 1],
    [1, 0],
  ];

  return indices
    .map(([x, y]) => [row + x, column + y])
    .filter(
      ([x, y]) => x > -1 && x < field.length && y > -1 && y < field[row].length
    );
}
