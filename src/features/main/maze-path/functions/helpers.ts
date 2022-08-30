import { setSquareCanvas } from '../../../../shared/functions';
import { Point } from '../../../../shared/types';
import { Cell } from '../cell';
import { CellNeighbours, CellSize } from '../types';

// Resize listener callback
export function resizeCanvas(
  cellSize: CellSize,
  gridSize: number,
  grid: Cell[],
  canvas: HTMLCanvasElement
) {
  setSquareCanvas(canvas);
  setCellSize(cellSize, gridSize, grid, canvas);
}

export function getCell(x: number, y: number, grid: Cell[], gridSize: number) {
  return grid[y * gridSize + x];
}

export function getCellPosition(idx: number, gridSize: number): Point {
  const y = Math.floor(idx / gridSize);
  const x = idx - y * gridSize;
  return { x, y };
}

export function setCellSize(
  cellSize: { width: number; height: number },
  gridSize: number,
  grid: Cell[],
  canvas: HTMLCanvasElement
) {
  cellSize = {
    width: canvas.width / gridSize,
    height: canvas.height / gridSize,
  };
  grid.forEach((cell) => {
    const newSize = {
      width: canvas.width / gridSize,
      height: canvas.height / gridSize,
    };
    cell.size = newSize;
  });
}

export function setCellNeighbours(x: number, y: number, gridSize: number) {
  const neighbours: CellNeighbours = {
    top: { x: x, y: y - 1 },
    right: { x: x + 1, y: y },
    bottom: { x: x, y: y + 1 },
    left: { x: x - 1, y: y },
  };

  if (y === gridSize - 1) {
    neighbours.bottom = false;
  }
  if (x === gridSize - 1) {
    neighbours.right = false;
  }
  if (y === 0) {
    neighbours.top = false;
  }
  if (x === 0) {
    neighbours.left = false;
  }

  return neighbours;
}
