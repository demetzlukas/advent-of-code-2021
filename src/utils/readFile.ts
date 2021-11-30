const { readFile } = require('fs').promises;

export async function readFileFromInput(input: string): Promise<string> {
  let content = await readFile(input, 'utf-8');

  return content.trim();
}

export async function readLinesFromInput(
  input: string,
  lineEnd = '\r\n'
): Promise<string[]> {
  let content = await readFileFromInput(input);

  return content.split(lineEnd);
}
