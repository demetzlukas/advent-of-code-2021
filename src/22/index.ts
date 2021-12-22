import { readLinesFromInput } from '../utils/readFile';

const filename = './input/22.txt';

type Cube = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
  state: boolean;
};

export async function main() {
  const input: [boolean, number, number, number, number, number, number][] = (
    await readLinesFromInput(filename)
  )
    .map((line) =>
      /([onf]+) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/.exec(
        line
      )
    )
    .map(([, state, xMin, xMax, yMin, yMax, zMin, zMax]) => [
      state === 'on' ? true : false,
      +xMin,
      +xMax,
      +yMin,
      +yMax,
      +zMin,
      +zMax,
    ]);
  const points: Map<string, boolean> = new Map();

  input.forEach(([state, xMin, xMax, yMin, yMax, zMin, zMax]) => {
    for (let x = xMin; x <= xMax; x++) {
      if (xMin < -50 || xMax > 50) {
        continue;
      }
      for (let y = yMin; y <= yMax; y++) {
        if (yMin < -50 || yMax > 50) {
          continue;
        }
        for (let z = zMin; z <= zMax; z++) {
          if (zMin < -50 || zMax > 50) {
            continue;
          }
          points.set(getKey(x, y, z), state);
        }
      }
    }
  });

  console.log('Part 1:', [...points.values()].filter((state) => state).length);

  // with help from https://www.reddit.com/r/adventofcode/comments/rlxhmg/comment/hpj70vh/?utm_source=share&utm_medium=web2x&context=3

  const cubes: Cube[] = input.map(
    ([state, xMin, xMax, yMin, yMax, zMin, zMax]) => {
      return {
        xMin,
        xMax,
        yMin,
        yMax,
        zMin,
        zMax,
        state,
      };
    }
  );

  const finalCubes: Cube[] = [];

  cubes.forEach((cube) => {
    const tempCubes: Cube[] = [];
    if (cube.state) {
      tempCubes.push(cube);
    }
    finalCubes.forEach((oldCube) => {
      const intersected = intersect(cube, oldCube, !oldCube.state);
      if (intersected) {
        tempCubes.push(intersected);
      }
    });
    finalCubes.push(...tempCubes);
  });

  const r = finalCubes
    .map((cube) => calculateVolume(cube) * (cube.state ? 1 : -1))
    .reduce((sum, value) => sum + value);
  console.log('Part 2:', r);
}

function getKey(x: number, y: number, z: number): string {
  return `${x}-${y}-${z}`;
}

function calculateVolume(cube: Cube): number {
  return (
    (cube.xMax - cube.xMin + 1) *
    (cube.yMax - cube.yMin + 1) *
    (cube.zMax - cube.zMin + 1)
  );
}

function intersect(first: Cube, second: Cube, state: boolean): Cube {
  if (
    first.xMin > second.xMax ||
    first.xMax < second.xMin ||
    first.yMin > second.yMax ||
    first.yMax < second.yMin ||
    first.zMin > second.zMax ||
    first.zMax < second.zMin
  ) {
    return;
  }
  return {
    state,
    xMin: Math.max(first.xMin, second.xMin),
    xMax: Math.min(first.xMax, second.xMax),
    yMin: Math.max(first.yMin, second.yMin),
    yMax: Math.min(first.yMax, second.yMax),
    zMin: Math.max(first.zMin, second.zMin),
    zMax: Math.min(first.zMax, second.zMax),
  };
}
