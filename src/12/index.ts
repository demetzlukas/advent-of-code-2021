import { readLinesFromInput } from '../utils/readFile';

const filename = './input/12.txt';

export async function main() {
  const input = await readLinesFromInput(filename);
  const map: Map<string, string[]> = new Map();
  input.forEach((line) => {
    const [from, to] = line.split('-');
    addNeighbor(from, to, map);
    addNeighbor(to, from, map);
  });

  console.log('Part 1:', findPath('start', map, [], []).length);
  console.log('Part 2:', findPath('start', map, [], [], false).length);
}

function findPath(
  node: string,
  map: Map<string, string[]>,
  visited: string[],
  paths: string[][],
  flag = true
): string[][] {
  if (
    (flag && /[a-z]+/.test(node) && visited.includes(node)) ||
    (visited.length > 0 && node === 'start')
  ) {
    return paths;
  }

  if (/[a-z]+/.test(node) && visited.includes(node)) {
    flag = true;
  }

  visited.push(node);

  if (node === 'end') {
    paths.push(visited);
    return paths;
  }

  map.get(node).forEach((neighbor) => {
    findPath(neighbor, map, [...visited], paths, flag);
  });

  return paths;
}

function addNeighbor(from: string, to: string, map: Map<string, string[]>) {
  const neighbors = map.has(from) ? map.get(from) : [];
  neighbors.push(to);
  map.set(from, neighbors);
}
