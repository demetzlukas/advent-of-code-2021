import { readLinesFromInput } from '../utils/readFile';

const filename = './input/25.txt';

export async function main() {
  let field = (await readLinesFromInput(filename)).map((line) =>
    line.split('')
  );

  let counter = 0;
  while (true) {
    counter++;
    const next = move(field);

    if (JSON.stringify(field) === JSON.stringify(next)) {
      break;
    }

    field = next;
  }

  console.log('Part 1:', counter);
}

function move(field: string[][]): string[][] {
  const next = moveType(field, '>', [0, 1]);
  return moveType(next, 'v', [1, 0]);
}

function moveType(
  field: string[][],
  type: '>' | 'v',
  deltas: [0 | 1, 0 | 1]
): string[][] {
  const next: string[][] = JSON.parse(JSON.stringify(field));

  const changed: number[][] = [];
  field.forEach((row, rIndex) =>
    row.forEach((cell, cIndex) => {
      if (cell === type) {
        const nextRow = (rIndex + deltas[0]) % field.length;
        const nextColumn = (cIndex + deltas[1]) % field[0].length;
        if (next[nextRow][nextColumn] === '.') {
          next[nextRow][nextColumn] = cell;
          changed.push([rIndex, cIndex]);
        }
      }
    })
  );
  changed.forEach(([x, y]) => (next[x][y] = '.'));

  return next;
}
