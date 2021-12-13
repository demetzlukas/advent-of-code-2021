import { range } from 'lodash';
import { readFileFromInput } from '../utils/readFile';

const filename = './input/13.txt';

export async function main() {
  const parts = (await readFileFromInput(filename)).split('\r\n\r\n');
  let dots = parts[0].split('\r\n');
  const foldInstructions: [string, number][] = parts[1]
    .split('\r\n')
    .map((line) => /.* (x|y)=(\d+)/.exec(line))
    .map(([_, axis, line]) => [axis, parseInt(line)]);

  const [axis, line] = foldInstructions.shift();
  dots = fold(axis, line, dots);

  console.log('Part 1:', dots.length);

  foldInstructions.forEach(([axis, line]) => {
    dots = fold(axis, line, dots);
  });

  console.log('Part 2:');
  printDots(dots);
}

function foldX(coordinates: string[], foldX: number): string[] {
  const dots = parseCoordinates(coordinates);
  const folded: Set<string> = new Set(
    dots.filter(([x]) => x < foldX).map(([x, y]) => `${x},${y}`)
  );
  dots
    .filter(([x]) => x > foldX)
    .forEach(([x, y]) => folded.add(`${Math.abs(x - 2 * foldX)},${y}`));

  return [...folded.values()];
}

function foldY(coordinates: string[], foldY: number): string[] {
  const dots = parseCoordinates(coordinates);
  const folded: Set<string> = new Set(
    dots.filter(([_, y]) => y < foldY).map(([x, y]) => `${x},${y}`)
  );
  dots
    .filter(([_, y]) => y > foldY)
    .forEach(([x, y]) => folded.add(`${x},${Math.abs(y - 2 * foldY)}`));

  return [...folded.values()];
}

function parseCoordinates(coordinates: string[]): number[][] {
  return coordinates.map((dot) => dot.split(',').map((x) => parseInt(x)));
}

function fold(axis: string, line: number, coordinates: string[]): string[] {
  if (axis === 'x') {
    return foldX(coordinates, line);
  }
  return foldY(coordinates, line);
}

function printDots(coordinates: string[]) {
  const dots = parseCoordinates(coordinates);
  const maxX = dots.map(([x]) => x).reduce((max, x) => Math.max(max, x));
  const maxY = dots.map(([_, y]) => y).reduce((max, x) => Math.max(max, x));

  range(maxY + 1).forEach((row) => {
    let line = '';
    range(maxX + 1).forEach((column) => {
      line += coordinates.includes(`${column},${row}`) ? '#' : ' ';
    });
    console.log(line);
  });
}
