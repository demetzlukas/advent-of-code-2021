import { range } from 'lodash';
import { readFileFromInput } from '../utils/readFile';

const filename = './input/16.txt';

export async function main() {
  let binaryDigits = (await readFileFromInput(filename))
    .split('')
    .map((character) => parseInt(character, 16).toString(2).padStart(4, '0'))
    .reduce((string, character) => string + character, '')
    .split('');
  const values: number[] = [];

  console.log('Part 1:', solve(binaryDigits, values));
  console.log('Part 2:', values[0]);
}

function solve(chars: string[], values: number[], subPacket = false): number {
  let versionNumbers = 0;
  while (chars.length > 0) {
    const version = parseInt(removeCharacters(chars, 3), 2);
    versionNumbers += version;
    const typeID = parseInt(removeCharacters(chars, 3), 2);

    if (typeID === 4) {
      const number = getLiteralValue(chars);
      values.push(number);
    } else {
      const lengthTypeID = removeCharacters(chars, 1);
      const subValues: number[] = [];

      if (lengthTypeID === '0') {
        const bitsToRead = 15;
        const length = parseInt(removeCharacters(chars, bitsToRead), 2);
        const subPacket = removeCharacters(chars, length);
        const subVersionNumber = solve(subPacket.split(''), subValues);
        versionNumbers += subVersionNumber;
      } else {
        const bitsToRead = 11;
        const numberOfSubPackets = parseInt(
          removeCharacters(chars, bitsToRead),
          2
        );
        range(numberOfSubPackets).forEach(() => {
          const subVersions = solve(chars, subValues, true);
          versionNumbers += subVersions;
        });
      }
      values.push(operations[typeID](subValues));
    }
    if (subPacket) {
      break;
    }
  }

  return versionNumbers;
}

function getLiteralValue(binaryString: string[]): number {
  const digits: string[] = [];

  while (true) {
    const block = removeCharacters(binaryString, 5);
    digits.push(block.substring(1));
    if (block[0] === '0') {
      break;
    }
  }

  return parseInt(digits.join(''), 2);
}

const foo = {
  name: 'foo',
  n1: 'bar',
  age: 10,
};

const operations: { [index: number]: (values: number[]) => number } = {
  0: (values: number[]) =>
    values.reduce((product, value) => product + value, 0),
  1: (values: number[]) =>
    values.reduce((product, value) => product * value, 1),
  2: (values: number[]) => Math.min(...values),
  3: (values: number[]) => Math.max(...values),
  5: ([a, b]: [number, number]) => (a > b ? 1 : 0),
  6: ([a, b]: [number, number]) => (a < b ? 1 : 0),
  7: ([a, b]: [number, number]) => (a === b ? 1 : 0),
};

function removeCharacters(characters: string[], length: number): string {
  let removed: string[] = [];
  range(length).forEach(() => removed.push(characters.shift()));

  return removed.join('');
}
