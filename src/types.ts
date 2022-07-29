export interface Cell {
  x: number;
  y: number;
  alive: boolean;
  position: string;
}

export type CellsArray = Cell[];
export type CellsDict = { [key: Cell["position"]]: Cell };
