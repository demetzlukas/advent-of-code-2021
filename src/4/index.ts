import { readFileFromInput } from '../utils/readFile';

const filename = './input/4.txt';

export async function main() {
  const input = (await readFileFromInput(filename)).split('\r\n\r\n');
  const numbers = input
    .shift()
    .split(',')
    .map((number) => parseInt(number));
  const boards = input.map((board) =>
    board.split('\r\n').map((line) =>
      line
        .trim()
        .split(/[' ']+/)
        .map((number) => {
          return { value: parseInt(number), drawn: false };
        })
    )
  );

  const winningBoards = getBoardsInWinningOrder(boards, numbers);
  const firstBoard = winningBoards.shift();
  console.log(
    'Part 1:',
    getSumOfNumbersNotDrawn(firstBoard.board) * firstBoard.lastNumber
  );

  const lastBoard = winningBoards.pop();
  console.log(
    'Part 2:',
    getSumOfNumbersNotDrawn(lastBoard.board) * lastBoard.lastNumber
  );
}

function getBoardsInWinningOrder(
  boards: { value: number; drawn: boolean }[][][],
  numbers: number[]
): {
  lastNumber: number;
  board: {
    value: number;
    drawn: boolean;
  }[][];
}[] {
  let remainingBoards: { value: number; drawn: boolean }[][][] = [];
  const winningBoards: {
    lastNumber: number;
    board: { value: number; drawn: boolean }[][];
  }[] = [];
  for (const number of numbers) {
    for (const board of boards) {
      markNumber(board, number);

      if (isWinningBoard(board)) {
        winningBoards.push({ lastNumber: number, board });
      } else {
        remainingBoards.push(board);
      }
    }

    boards = [...remainingBoards];
    remainingBoards = [];

    if (boards.length === 0) {
      break;
    }
  }

  return winningBoards;
}

function markNumber(
  board: { value: number; drawn: boolean }[][],
  number: number
) {
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.value === number) {
        cell.drawn = true;
      }
    });
  });
}

function isWinningBoard(board: { value: number; drawn: boolean }[][]): boolean {
  for (const row of board) {
    if (row.filter((cell) => cell.drawn).length === board[0].length) {
      return true;
    }
  }

  for (let column = 0; column < board[0].length; column++) {
    if (
      board.map((row) => row[column]).filter((cell) => cell.drawn).length ===
      board.length
    )
      return true;
  }

  return false;
}

function getSumOfNumbersNotDrawn(
  board: { value: number; drawn: boolean }[][]
): number {
  return board
    .map((row) =>
      row
        .filter((value) => !value.drawn)
        .map((value) => value.value)
        .reduce((sum, current) => sum + current, 0)
    )
    .reduce((sum, current) => sum + current, 0);
}
