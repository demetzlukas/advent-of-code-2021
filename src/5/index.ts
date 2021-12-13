import { readLinesFromInput } from '../utils/readFile';

const filename = './input/5.txt';

export async function main() {
  const valves = (await readLinesFromInput(filename)).map((row) =>
    /(\d+),(\d+) -> (\d+),(\d+)/
      .exec(row)
      .slice(1)
      .map((value) => parseInt(value))
  );

  console.log('Part 1:', calculateCrossings(valves));
  console.log('Part 2:', calculateCrossings(valves, true));
}

function calculateCrossings(valves: number[][], diagonales = false): number {
  const crossings = new Map<string, number>();

  for (const [x1, y1, x2, y2] of valves) {
    if (x1 === x2 || y1 === y2 || diagonales) {
      const dx = x1 < x2 ? 1 : -1;
      const dy = y1 < y2 ? 1 : -1;
      let x = x1;
      let y = y1;

      while (true) {
        let c = `${x}-${y}`;
        let numberOfCrossings = crossings.has(c) ? crossings.get(c) : 0;
        crossings.set(c, numberOfCrossings + 1);
        if (x === x2 && y === y2) {
          break;
        }
        if (x != x2) {
          x += dx;
        }
        if (y != y2) {
          y += dy;
        }
      }
    }
  }

  return [...crossings.values()].filter((crossing) => crossing > 1).length;
}
