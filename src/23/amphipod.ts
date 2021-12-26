export class Amphipod {
  static endPositions: [number, number][];
  static type = '';
  weight = 0;
  position: [number, number];
  id: string;
  done: boolean;
  locked: boolean;

  constructor(x: number, y: number) {
    this.position = [x, y];
    this.done = false;
    this.locked = false;
  }

  static getEndPositions(): [number, number][] {
    return this.endPositions;
  }

  getEndPositions(): [number, number][] {
    return [];
  }

  move(x: number, y: number): number {
    this.position = [x, y];
    return this.weight;
  }
  toString(): string {
    return `${this.id}@${this.position}`;
  }
}

export class Amber extends Amphipod {
  static type = 'A';
  static endPositions: [number, number][] = [
    [2, 3],
    [3, 3],
    // [4, 3],
    // [5, 3],
  ];
  weight = 1;

  position: [number, number];

  constructor(x: number, y: number) {
    super(x, y);
    this.id = 'A';
  }

  getEndPositions(): [number, number][] {
    return Amber.getEndPositions();
  }
}

export class Bronze extends Amphipod {
  static type = 'B';
  static endPositions: [number, number][] = [
    [2, 5],
    [3, 5],
    // [4, 5],
    // [5, 5],
  ];
  weight = 10;

  position: [number, number];

  constructor(x: number, y: number) {
    super(x, y);
    this.id = 'B';
  }

  getEndPositions(): [number, number][] {
    return Bronze.getEndPositions();
  }
}

export class Copper extends Amphipod {
  static type = 'C';
  static endPositions: [number, number][] = [
    [2, 7],
    [3, 7],
    // [4, 7],
    // [5, 7],
  ];
  weight = 100;

  position: [number, number];

  constructor(x: number, y: number) {
    super(x, y);
    this.id = 'C';
  }

  getEndPositions(): [number, number][] {
    return Copper.getEndPositions();
  }
}

export class Desert extends Amphipod {
  static type = 'D';
  static endPositions: [number, number][] = [
    [2, 9],
    [3, 9],
    // [4, 9],
    // [5, 9],
  ];
  weight = 1000;

  position: [number, number];

  constructor(x: number, y: number) {
    super(x, y);
    this.id = 'D';
  }

  getEndPositions(): [number, number][] {
    return Desert.getEndPositions();
  }
}
