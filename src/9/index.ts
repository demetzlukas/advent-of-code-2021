import { readLinesFromInput } from '../utils/readFile';

const filename = './input/9.txt';

export async function main() {
  const field = (await readLinesFromInput(filename)).map((line) =>
    line.split('').map((cell) => parseInt(cell))
  );

  const basins = getBasins(field);

  console.log(
    'Part 1:',
    basins
      .map(([row, column]) => field[row][column] + 1)
      .reduce((sum, value) => sum + value)
  );

  const sinks: Set<string>[] = basins.map(([row, column]) => {
    const included = new Set<string>();
    return getValuesInBasin(
      field,
      row,
      column,
      included.add(`${row}-${column}`)
    );
  });

  console.log(
    'Part 2:',
    sinks
      .map((sink) => sink.size)
      .sort((a, b) => b - a)
      .slice(0, 3)
      .reduce((product, value) => product * value, 1)
  );
}

function getBasins(field: number[][]): number[][] {
  const basins: number[][] = [];
  field.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (
        getAdjacentIndices(field, rowIndex, columnIndex).every(
          ([row, column]) => value < field[row][column]
        )
      ) {
        basins.push([rowIndex, columnIndex]);
      }
    });
  });

  return basins;
}

function getValuesInBasin(
  field: number[][],
  row: number,
  column: number,
  included: Set<string>
): Set<string> {
  getAdjacentIndices(field, row, column)
    .filter(
      ([row, column]) =>
        field[row][column] !== 9 && !included.has(`${row}-${column}`)
    )
    .forEach(([row, column]) =>
      getValuesInBasin(field, row, column, included.add(`${row}-${column}`))
    );

  return included;
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
