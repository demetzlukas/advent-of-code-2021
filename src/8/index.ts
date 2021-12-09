import { readLinesFromInput } from '../utils/readFile';

const filename = './input/8.txt';

export async function main() {
  const lines = (await readLinesFromInput(filename)).map((line) =>
    line.split(' | ')
  );

  const lengths = [2, 4, 3, 7];

  let counter = lines
    .map(
      ([_, output]) =>
        output.split(' ').filter((number) => lengths.includes(number.length))
          .length
    )
    .reduce((sum, value) => sum + value);

  console.log('Part 1:', counter);

  counter = 0;
  lines.forEach(([input, output]) => {
    const digitAsInputs: string[] = [];
    const inputNumbers = input.split(' ');

    inputNumbers.forEach((number) => {
      if (number.length === 2) {
        digitAsInputs[1] = number;
      } else if (number.length === 4) {
        digitAsInputs[4] = number;
      } else if (number.length === 3) {
        digitAsInputs[7] = number;
      } else if (number.length === 7) {
        digitAsInputs[8] = number;
      }
    });

    const abcdfInputs = mergeInputs(digitAsInputs[4], digitAsInputs[7]);
    const bdInputs = intersectInputs(digitAsInputs[4], digitAsInputs[1]);

    inputNumbers
      .filter((number) => number.length === 5)
      .forEach((number) => {
        if (intersectInputs(number, abcdfInputs).length === 1) {
          if (containsInputs(number, bdInputs)) {
            digitAsInputs[5] = number;
          } else {
            digitAsInputs[3] = number;
          }
        } else {
          digitAsInputs[2] = number;
        }
      });

    inputNumbers
      .filter((number) => number.length === 6)
      .forEach((number) => {
        if (intersectInputs(number, digitAsInputs[1]).length === 5) {
          digitAsInputs[6] = number;
        } else if (intersectInputs(number, digitAsInputs[5]).length === 1) {
          digitAsInputs[9] = number;
        } else {
          digitAsInputs[0] = number;
        }
      });

    counter += parseInt(
      output
        .split(' ')
        .map((number) => getNumberForInputs(number, digitAsInputs))
        .reduce((total, sub) => total + sub)
    );
  });

  console.log('Part 2:', counter);
}

function mergeInputs(first: string, second: string): string {
  const result = new Set<string>((first + second).split(''));

  return [...result.values()].reduce((s, c) => s + c);
}

function intersectInputs(first: string, second: string): string {
  let result = '' + first;

  second.split('').forEach((c) => {
    result = result.replace(c, '');
  });

  return result;
}

function containsInputs(number: string, inputs: string): boolean {
  return (
    inputs.split('').filter((input) => !number.includes(input)).length === 0
  );
}

function getNumberForInputs(number: string, digitAsInputs: string[]): string {
  for (const [index, inputs] of digitAsInputs.entries()) {
    if (
      number.length === inputs.length &&
      intersectInputs(number, inputs).length === 0
    ) {
      return index.toString();
    }
  }

  throw Error('Number not found');
}
