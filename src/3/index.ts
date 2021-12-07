import { readLinesFromInput } from '../utils/readFile';
import { range } from 'lodash';

const filename = './input/3.txt';

export async function main() {
  const input = await readLinesFromInput(filename);

  let epsilon = '';
  let gamma = '';

  for (const index of range(input[0].length)) {
    let counter = 0;

    for (const line of input) {
      counter = line[index] === '0' ? counter - 1 : counter + 1;
    }

    if (counter > 0) {
      epsilon += '1';
      gamma += '0';
    } else {
      epsilon += '0';
      gamma += '1';
    }
  }

  console.log('Part 1:', parseInt(epsilon, 2) * parseInt(gamma, 2));

  const oxygen = calculateValue(input, (counter) => (counter > -1 ? '1' : '0'));
  const co2 = calculateValue(input, (counter) => (counter > -1 ? '0' : '1'));
  console.log('Part 2:', oxygen * co2);
}

function calculateValue(
  input: string[],
  getBit: (counter: number) => string
): number {
  let result = input;

  for (const index of range(result[0].length)) {
    let counter = 0;

    for (const line of result) {
      counter = line[index] === '0' ? counter - 1 : counter + 1;
    }
    result = result.filter((line) => line[index] === getBit(counter));

    if (result.length === 1) {
      break;
    }
  }

  return parseInt(result[0], 2);
}
