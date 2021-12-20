import { readLinesFromInput } from '../utils/readFile';

const filename = './input/18.txt';

export async function main() {
  const lines = await readLinesFromInput(filename);

  console.log('Part 1:', getMagnitude(reduceAll([...lines])));
  console.log('Part 2:', getMaxMagnitude(lines));
}

function getMaxMagnitude(input: string[]): number {
  const maxMagnitudes: number[] = [];

  input.forEach((first, i) => {
    input.forEach((second, j) => {
      if (i !== j) {
        maxMagnitudes.push(getMagnitude(reduceLine(add(first, second))));
        maxMagnitudes.push(getMagnitude(reduceLine(add(second, first))));
      }
    });
  });
  return Math.max(...maxMagnitudes);
}

function reduceAll(lines: string[]): string {
  while (lines.length > 1) {
    lines.unshift(reduceLine(add(lines.shift(), lines.shift())));
  }

  return lines[0];
}

function reduceLine(string: string): string {
  while (true) {
    const [changedInExplode, stringAfterExplode] = explode(string);

    if (changedInExplode) {
      string = stringAfterExplode;
      continue;
    }

    const [changedInSplit, stringAfterSplit] = split(string);

    if (changedInSplit) {
      string = stringAfterSplit;
      continue;
    }

    return string;
  }
}

function getPair(line: string): [string, string] {
  let counter = 0;
  for (let i = 1; i < line.length; i++) {
    if (line[i] === '[') {
      counter++;
    } else if (line[i] === ']') {
      counter--;
    } else {
      if (line[i] === ',' && counter === 0) {
        return [line.slice(1, i), line.slice(i + 1, -1)];
      }
    }
  }

  throw new Error(`No pair found in ${line}`);
}

function add(first: string, second: string): string {
  return `[${first},${second}]`;
}

function explode(line: string): [changed: boolean, line: string] {
  let counter = 0;
  let nested = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '[') {
      counter++;
      nested = counter > 4;
    } else if (line[i] === ']') {
      counter--;
    } else if (line[i].match(/\d/) && nested) {
      const part = line.slice(i);
      const [, firstNumber, secondNumber] = /(\d+),(\d+)/.exec(part);
      const partBefore = addToNumberBefore(line.slice(0, i - 1), firstNumber);
      const partAfter = addToNumberAfter(
        part.slice(part.indexOf(']') + 1),
        secondNumber
      );
      return [true, `${partBefore}0${partAfter}`];
    }
  }

  return [false, line];
}

function addToNumberAfter(string: string, number: string): string {
  return addToNumber(string, number, getNumberAfter);
}

function addToNumberBefore(string: string, number: string): string {
  return addToNumber(string, number, getNumberBefore);
}

function addToNumber(
  string: string,
  number: string,
  getParts: (
    _: string
  ) => [number: number, partBefore: string, partAfter: string]
): string {
  const parts = getParts(string);
  if (parts) {
    return parts[1] + (parseInt(number) + parts[0]) + parts[2];
  }

  return string;
}

function split(line: string): [boolean, string] {
  const number = /(\d{2,})/.exec(line);
  if (number) {
    const asNumber = parseInt(number[1]);
    return [
      true,
      line.replace(
        number[1],
        `[${Math.floor(asNumber / 2)},${Math.ceil(asNumber / 2)}]`
      ),
    ];
  }

  return [false, line];
}

function getMagnitude(line: string): number {
  const number = /^(\d+)/.exec(line);
  if (number !== null) {
    return parseInt(number[1]);
  }
  if (line.startsWith('[')) {
    const [first, second] = getPair(line);
    return 3 * getMagnitude(first) + 2 * getMagnitude(second);
  }

  throw new Error(`Error calculating magnitude in ${line}`);
}

function getNumberBefore(
  line: string
): [number: number, stringBeforeNumber: string, stringAfterNumber: string] {
  return getNumber(line, /(.*[\[\],])(\d+)(.*)/);
}

function getNumberAfter(
  line: string
): [number: number, stringBeforeNumber: string, stringAfterNumber: string] {
  return getNumber(line, /(.*?[\[\],])(\d+)([\[\],].*)/);
}

function getNumber(
  line: string,
  regex: RegExp
): [number: number, stringBeforeNumber: string, stringAfterNumber: string] {
  const parts = regex.exec(line);
  if (parts) {
    return [parseInt(parts[2]), parts[1], parts[3]];
  }
}
