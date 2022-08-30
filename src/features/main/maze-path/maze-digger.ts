import { Point } from '../../../shared/types';
import { Cell } from './cell';
import { getCell } from './functions/helpers';
import { dig } from './functions/tree';
import { Node } from './types';

export class MazeDigger {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  backtrack(
    currentPath: Point[],
    mazeFinished: boolean,
    grid: Cell[],
    gridSize: number,
    nodeTree: Node[],
    digAll: boolean,
    digSpeed: number,
    mazePathCancel: boolean
  ) {
    currentPath.pop();
    if (currentPath.length) {
      const { x, y } = currentPath.at(-1)!;
      dig(
        x,
        y,
        this,
        grid,
        gridSize,
        currentPath,
        nodeTree,
        digAll,
        digSpeed,
        mazeFinished,
        mazePathCancel
      );
    } else {
      mazeFinished = true;
    }
  }

  getNodeWithSelectedChild(grid: Cell[], gridSize: number) {
    const currentCell = getCell(this.x, this.y, grid, gridSize);
    const cellNeighbours = currentCell.neighbours;

    let possibleChildren: Node[] = [];
    Object.values(cellNeighbours).forEach((cellPosition: Point | false) => {
      if (cellPosition) {
        const { x, y } = cellPosition;
        const cell = getCell(x, y, grid, gridSize);
        if (!cell.visited) {
          const childNode = { x, y, children: [] };
          possibleChildren = [...possibleChildren, childNode];
        }
      }
    });
    if (!possibleChildren.length) {
      return false;
    }
    const selectedIndex = Math.floor(Math.random() * possibleChildren.length);
    const selectedCell = possibleChildren[selectedIndex];
    const nextX = selectedCell.x;
    const nextY = selectedCell.y;

    const x = this.x;
    const y = this.y;
    const node = { x, y, children: [] };

    return { node, possibleChildren, nextX, nextY };
  }

  setCurrentPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
