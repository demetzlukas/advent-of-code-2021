import { range } from 'lodash';
import { readFileFromInput } from '../utils/readFile';

const filename = './input/14.txt';

export async function main() {
  let [polymer, rulesPart] = (await readFileFromInput(filename)).split(
    '\r\n\r\n'
  );
  const rules: Map<string, string> = new Map(
    rulesPart
      .split('\r\n')
      .map((line) => line.split(' -> '))
      .map(([pair, insert]) => [pair, insert])
  );

  const occurrences = initOccurrences(polymer);
  let pairs = initPolymerPairs(polymer);

  range(10).forEach(() => (pairs = step(pairs, rules, occurrences)));
  console.log('Part 1:', calculateValue(occurrences));

  range(30).forEach(() => (pairs = step(pairs, rules, occurrences)));
  console.log('Part 2:', calculateValue(occurrences));
}

function calculateValue(occurrences: Map<string, number>): number {
  const sorted = [...occurrences.values()].sort((a, b) => a - b);

  return sorted[sorted.length - 1] - sorted[0];
}

function initPolymerPairs(polymer: string): Map<string, number> {
  const pairs: Map<string, number> = new Map();
  for (let index = 0; index < polymer.length - 1; index++) {
    const pair = polymer.substring(index, index + 2);
    pairs.set(pair, (pairs.get(pair) ?? 0) + 1);
  }

  return pairs;
}

function initOccurrences(polymer: string): Map<string, number> {
  const occurrences: Map<string, number> = new Map();

  polymer
    .split('')
    .forEach((c) => occurrences.set(c, (occurrences.get(c) ?? 0) + 1));

  return occurrences;
}

function step(
  pairs: Map<string, number>,
  rules: Map<string, string>,
  occurrences: Map<string, number>
): Map<string, number> {
  const next: Map<string, number> = new Map();

  pairs.forEach((occurrence, pair) => {
    const insert = rules.get(pair);
    const [first, second] = pair.split('');

    next.set(first + insert, occurrence + (next.get(first + insert) ?? 0));
    next.set(insert + second, occurrence + (next.get(insert + second) ?? 0));
    occurrences.set(insert, occurrence + (occurrences.get(insert) ?? 0));
  });

  return next;
}
