export interface Cell {
  arrayIdx: number;
  x: number;
  y: number;
  alive: boolean;
  position: string;
}
export type Config = number[][];

export type CellsArray = Cell[];
export type CellsDict = { [key: Cell['position']]: Cell };
export enum ConfigSelected {
  Glider = 'glider',
  AchimsP16 = 'achims-p16',
  AchimsP144 = 'achims-p144',
  Weekender = 'weekender',
  MaxSpaceFiller189 = 'max-spacefiller-189',
}

export enum GameMode {
  Play,
  Stop,
  Reset,
}
