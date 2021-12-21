import { range } from 'lodash';
import { readLinesFromInput } from '../utils/readFile';

const filename = './input/21.txt';
const storedWins: Map<string, [number, number]> = new Map();

export async function main() {
  const input = await readLinesFromInput(filename);
  let player1Position = +input[0].split(': ')[1];
  let player2Position = +input[1].split(': ')[1];

  const positions: number[] = [player1Position, player2Position];
  const scores = [0, 0];

  let dice = 1;
  let counter = 0;

  while (scores[0] < 1000 && scores[1] < 1000) {
    const player = (dice - 1) % 2;
    let steps = 0;
    range(3).forEach(() => {
      steps += dice++;
      if (dice > 100) {
        dice -= 100;
      }
    });
    counter += 3;
    positions[player] = ((positions[player] + steps - 1) % 10) + 1;
    scores[player] += positions[player];
  }

  console.log('Part 1:', Math.min(...scores) * counter);

  const wins = playRound([0, 0], [player1Position, player2Position]);
  console.log('Part 2:', Math.max(...wins));
}

function playRound(
  scores: [number, number],
  positions: [number, number],
  player: number = 0
): [number, number] {
  if (scores[0] >= 21) {
    return [1, 0];
  }
  if (scores[1] >= 21) {
    return [0, 1];
  }

  let wins: [number, number] = storedWins.get(
    `${scores}-${positions}-${player}`
  );

  if (wins) {
    return wins;
  }

  wins = [0, 0];
  const combinations = [
    [3, 1],
    [4, 3],
    [5, 6],
    [6, 7],
    [7, 6],
    [8, 3],
    [9, 1],
  ];
  combinations.forEach(([moves, times]) => {
    const nextScores: [number, number] = [...scores];
    const nextPositions: [number, number] = [...positions];

    nextPositions[player] = ((nextPositions[player] + moves - 1) % 10) + 1;
    nextScores[player] += nextPositions[player];

    const newWins = playRound(nextScores, nextPositions, player === 0 ? 1 : 0);
    range(2).forEach((i) => (wins[i] += newWins[i] * times));
  });

  storedWins.set(`${scores}-${positions}-${player}`, wins);

  return wins;
}
