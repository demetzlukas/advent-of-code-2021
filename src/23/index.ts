import { range } from 'lodash';
import { readLinesFromInput } from '../utils/readFile';
import { Amber, Amphipod, Bronze, Copper, Desert } from './amphipod';

const filename = './input/23.txt';

const storedCosts: Map<string, number> = new Map();
const parkingPositions: [number, number][] = [
  [1, 1],
  [1, 2],
  [1, 4],
  [1, 6],
  [1, 8],
  [1, 10],
  [1, 11],
];
const endPositions = [
  ...Amber.getEndPositions(),
  ...Bronze.getEndPositions(),
  ...Copper.getEndPositions(),
  ...Desert.getEndPositions(),
];
const endStatePart1 = 'A@2,3;A@3,3;B@2,5;B@3,5;C@2,7;C@3,7;D@2,9;D@3,9';

export async function main() {
  const input = (await readLinesFromInput(filename)).map((line) =>
    line.split('')
  );

  const amphipods = endPositions.map(([x, y]) =>
    createAmphipod(input[x][y], x, y)
  );

  const states = solve(getFieldState(amphipods));

  console.log('Part 1 :', states.get(endStatePart1));

  console.log('Part 2:');
}

function getCostsTo(amphipod: Amphipod, move: [number, number]): number {
  const [cx, cy] = amphipod.position;
  const [tx, ty] = move;

  if (cx === 1 || tx === 1) {
    return (Math.abs(cx - tx) + Math.abs(cy - ty)) * amphipod.weight;
  }

  return (cx - 1 + (tx - 1) + Math.abs(cy - ty)) * amphipod.weight;
}

function getEndPosition(
  amphipod: Amphipod,
  field: Map<string, string>
): [number, number] {
  const endPositions = amphipod.getEndPositions();
  if (!canMoveTo(amphipod, endPositions[0], field)) {
    return null;
  }
  for (const [x, y] of amphipod.getEndPositions()) {
    if (
      field.get(`${x}x${y}`) !== '' &&
      field.get(`${x}x${y}`) !== amphipod.id
    ) {
      return null;
    }
  }

  for (let i = endPositions.length - 1; i >= 0; i--) {
    const [x, y] = endPositions[i];
    if (field.get(`${x}x${y}`) === '') {
      return [x, y];
    }
  }
}

function canMoveTo(
  amphipod: Amphipod,
  move: [number, number],
  field: Map<string, string>
): boolean {
  const [cx, cy] = amphipod.position;
  const [tx, ty] = move;

  for (let x = tx; x >= 1; x--) {
    if (field.get(`${x}x${ty}`) !== '') {
      return false;
    }
  }

  for (let x = cx - 1; x >= 1; x--) {
    if (field.get(`${x}x${cy}`) !== '') {
      return false;
    }
  }

  for (let y = cy + 1; y <= ty; y++) {
    if (field.get(`1x${y}`) !== '') {
      return false;
    }
  }

  for (let y = cy - 1; y >= ty; y--) {
    if (field.get(`1x${y}`) !== '') {
      return false;
    }
  }

  return true;
}

function createAmphipod(type: string, x: number, y: number): Amphipod {
  switch (type) {
    case 'A':
      return new Amber(x, y);
    case 'B':
      return new Bronze(x, y);
    case 'C':
      return new Copper(x, y);
    case 'D':
      return new Desert(x, y);
  }
  throw new Error('Unknown type ' + type);
}

function getFieldState(amphipods: Amphipod[]): string {
  return amphipods
    .map((a) => a.toString())
    .sort()
    .join(';');
}

function finished(amphipods: Amphipod[]): boolean {
  return amphipods.every((a) => a.done === true);
}

function solve(initialState: string) {
  let states: [number, string][] = [[0, initialState]];
  storedCosts.set(initialState, 0);

  while (states.length > 0 || !storedCosts.has(endStatePart1)) {
    const [c, s] = states.shift();
    move(c, s, states);
    states = states.sort(([a], [b]) => a - b);
  }
  return storedCosts;
}

function createAmphipodsFromState(state: string): Amphipod[] {
  return state
    .split(';')
    .map((amphipod) => /([ABCD])@(\d+),(\d+)/.exec(amphipod))
    .map(([, id, x, y]) => [id, x, y])
    .map(([id, x, y]) => {
      const amphipod = createAmphipod(id.toString(), +x, +y);

      for (const [px, py] of parkingPositions) {
        if (px === +x && py === +y) {
          amphipod.locked = true;
          break;
        }
      }

      return amphipod;
    });
}

function placeAmphipodsOnField(
  amphipods: Amphipod[],
  field: Map<string, string>
) {
  amphipods.forEach((a) => {
    const [x, y] = a.position;
    field.set(`${x}x${y}`, a.id);
  });
}

function move(
  currentCosts: number,
  fieldState: string,
  states: [number, string][]
) {
  const field: Map<string, string> = initField();
  const amphipods = createAmphipodsFromState(fieldState);
  placeAmphipodsOnField(amphipods, field);
  setFinishedForAmphipods(amphipods, field);

  if (finished(amphipods)) {
    return storedCosts;
  }

  for (const amphipod of [
    ...amphipods.filter((a) => a.locked),
    ...amphipods.filter((a) => !a.locked && !a.done),
  ]) {
    const endPosition = getEndPosition(amphipod, field);

    if (endPosition) {
      moveTo(amphipod, endPosition, currentCosts, amphipods, states);
    }
  }

  for (const amphipod of amphipods.filter((a) => !a.done && !a.locked)) {
    for (const [px, py] of parkingPositions) {
      if (canMoveTo(amphipod, [px, py], field)) {
        moveTo(amphipod, [px, py], currentCosts, amphipods, states);
      }
    }
  }

  return storedCosts;
}

function setFinishedForAmphipods(
  amphipods: Amphipod[],
  field: Map<string, string>
) {
  amphipods.forEach((a) => {
    const [x, y] = a.position;
    const endPositions = a.getEndPositions();

    if (x === endPositions[1][0] && y === endPositions[1][1]) {
      a.done = true;
    } else if (
      x === endPositions[0][0] &&
      y === endPositions[0][1] &&
      field.get(`${endPositions[1][0]}x${endPositions[1][1]}`) === a.id
    ) {
      a.done = true;
    }
  });
}

function moveTo(
  amphipod: Amphipod,
  position: [number, number],
  currentCosts: number,
  amphipods: Amphipod[],
  states: [number, string][]
) {
  const newCosts = currentCosts + getCostsTo(amphipod, position);
  const [oldX, oldY] = amphipod.position;
  amphipod.move(position[0], position[1]);

  const state = getFieldState(amphipods);
  const stored = storedCosts.get(state) ?? Number.MAX_VALUE;

  if (stored > newCosts) {
    storedCosts.set(state, newCosts);
    states.push([newCosts, state]);
  }
  amphipod.move(oldX, oldY);
}

function initField(): Map<string, string> {
  const field: Map<string, string> = new Map();
  range(11).forEach((i) => field.set(`1x${i + 1}`, ''));
  endPositions.forEach(([x, y]) => field.set(`${x}x${y}`, ''));

  return field;
}
