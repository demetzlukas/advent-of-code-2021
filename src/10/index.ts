import { readLinesFromInput } from '../utils/readFile';

const filename = './input/10.txt';

export async function main() {
  const parentheses = new Map<string, string>();
  parentheses.set('(', ')');
  parentheses.set('[', ']');
  parentheses.set('{', '}');
  parentheses.set('<', '>');

  const closing = [...parentheses.values()];
  const opening = [...parentheses.keys()];

  const incompleteLineStacks: string[][] = [];

  const input = (await readLinesFromInput(filename)).map((line) =>
    line.split('')
  );

  const firstIllegalParentheses: string[] = [];
  input.forEach((row) => {
    const stack: string[] = [];
    let illegalLine = false;
    for (const character of row) {
      if (opening.includes(character)) {
        stack.push(parentheses.get(character));
      } else if (closing.includes(character)) {
        const top = stack.pop();
        if (character !== top) {
          firstIllegalParentheses.push(character);
          illegalLine = true;
          break;
        }
      }
    }
    if (stack.length > 0 && !illegalLine) {
      incompleteLineStacks.push(stack);
    }
  });

  console.log(
    'Part 1:',
    firstIllegalParentheses
      .map((c) => getPointsPart1(c))
      .reduce((sum, value) => sum + value)
  );

  const sums: number[] = incompleteLineStacks
    .map((stack) => stack.reverse())
    .map((stack) =>
      stack
        .map((c) => getPointsPart2(c))
        .reduce((total, value) => total * 5 + value)
    )
    .sort((a, b) => a - b);

  console.log('Part 2:', sums[Math.floor(sums.length / 2)]);
}

function getPointsPart1(character: string): number {
  switch (character) {
    case ')':
      return 3;
    case ']':
      return 57;
    case '}':
      return 1197;
    case '>':
      return 25137;
  }

  throw new Error('Wrong character ' + character);
}

function getPointsPart2(character: string): number {
  switch (character) {
    case ')':
      return 1;
    case ']':
      return 2;
    case '}':
      return 3;
    case '>':
      return 4;
  }

  throw new Error('Wrong character ' + character);
}
