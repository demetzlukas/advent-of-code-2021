import { readLinesFromInput } from '../utils/readFile';

const filename = './input/24.txt';

export async function main() {
  const instructions = (await readLinesFromInput(filename)).map((line) =>
    line.split(' ')
  );

  const highest = '91599994399395';
  console.log(`Part 1: ${highest} valid: ${isValid(highest, instructions)}`);
  const lowest = '71111591176151';
  console.log(`Part 2: ${lowest} valid: ${isValid(lowest, instructions)}`);
}

function isValid(input: string, instructions: string[][]): boolean {
  const inputs = Array.from(input, Number);
  const numberOfOperations = 18;
  let counter = 0;
  let z = 0;
  while (inputs.length > 0 && counter < instructions.length) {
    const w = inputs.shift();

    const x = (z % 26) + parseInt(instructions[counter + 5][2]);
    z = Math.floor(z / parseInt(instructions[counter + 4][2]));

    if (x !== w) {
      z = z * 26 + w + parseInt(instructions[counter + 15][2]);
    }
    counter += numberOfOperations;
  }

  return z === 0;
}
