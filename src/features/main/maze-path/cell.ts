import { setCellNeighbours } from './functions/helpers';
import { CellNeighbours, CellSize } from './types';

export class Cell {
  x: number;
  y: number;
  size: CellSize;
  neighbours: CellNeighbours;
  visited: boolean;
  constructor(x: number, y: number, cellSize: CellSize, gridSize: number) {
    this.x = x;
    this.y = y;
    this.size = cellSize;
    this.neighbours = setCellNeighbours(this.x, this.y, gridSize);
    this.visited = false;
  }
}
