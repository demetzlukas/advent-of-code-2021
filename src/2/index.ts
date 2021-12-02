import { readLinesFromInput } from '../utils/readFile';

const filename = './input/2.txt';

export async function main() {
  const instructions = (await readLinesFromInput(filename)).map((line) =>
    line.split(' ')
  );

  console.log('Part 1:', calculateDepth(instructions));
  console.log('Part 2:', calculateDepth(instructions, true));
}

function calculateDepth(instructions: string[][], flag = false): number {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  for (const [direction, steps] of instructions) {
    const stepsAsNumber = parseInt(steps);
    if (direction == 'forward') {
      horizontal += stepsAsNumber;
      if (flag) {
        depth += aim * stepsAsNumber;
      }
    } else if (direction == 'up') {
      if (flag) {
        aim -= stepsAsNumber;
      } else {
        depth -= stepsAsNumber;
      }
    } else if (direction == 'down') {
      if (flag) {
        aim += stepsAsNumber;
      } else {
        depth += stepsAsNumber;
      }
    }
  }

  return horizontal * depth;
}
