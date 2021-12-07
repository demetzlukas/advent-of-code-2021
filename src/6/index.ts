import { readFileFromInput } from '../utils/readFile';
import { range } from 'lodash';

const filename = './input/6.txt';

export async function main() {
  const input = (await readFileFromInput(filename))
    .split(',')
    .map((value) => parseInt(value));

  console.log('Part 1:', getNumberOfFishAfterDays(input, 80));
  console.log('Part 2:', getNumberOfFishAfterDays(input, 256));
}

function getNumberOfFishAfterDays(input: number[], days: number): number {
  let states: number[] = Array(9).fill(0);

  input.forEach((value) => states[value]++);

  for (const _ of range(days)) {
    let newStates: number[] = [];

    for (let i = 8; i > 0; i--) {
      newStates[i - 1] = states[i];
    }
    newStates[8] = states[0];
    newStates[6] += states[0];

    states = [...newStates];
  }

  return states.reduce((sum, value) => sum + value);
}
