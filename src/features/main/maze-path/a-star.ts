import { Point } from '../../../shared/types';
import { nodeId } from './functions/tree';
import { AStarNode, CellSize, Node } from './types';

export class AStar {
  exit: Point;
  exitId: string;
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  id: string;
  currentPath: AStarNode[];
  visitedCells: { [key: string]: boolean };
  neighbours: AStarNode[];
  nextCell: AStarNode;
  constructor(x: number, y: number, gridSize: number) {
    this.exit = { x: gridSize - 1, y: gridSize - 1 };
    this.exitId = nodeId({ x: this.exit.x, y: this.exit.y });
    this.x = x;
    this.y = y;
    this.g = 0;
    this.h = this.getH(this.x, this.y);
    this.f = this.getF(this.g, this.h);
    this.id = nodeId({ x: this.x, y: this.y });
    this.currentPath = [
      {
        x,
        y,
        g: this.g,
        h: this.h,
        f: this.f,
        id: this.id,
      },
    ];
    this.visitedCells = { [this.currentPath[0].id as string]: true };
    this.neighbours = [];
    this.nextCell = {} as AStarNode;
  }

  draw(cellSize: CellSize, ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < this.currentPath.length; i++) {
      if (this.currentPath[i + 1]) {
        const { width, height } = cellSize;
        const { x: startX, y: startY } = this.currentPath[i];
        const { x: endX, y: endY } = this.currentPath[i + 1];
        // if (endX && endY) {
        let connectedWidth = width;
        let connectedHeight = height;
        let newStartX = startX <= endX ? startX : endX;
        let newStartY = startY <= endY ? startY : endY;

        if (Math.abs(startX - endX) > 0) {
          connectedWidth *= 2;
        }
        if (Math.abs(startY - endY) > 0) {
          connectedHeight *= 2;
        }

        ctx.fillStyle = '#48cebf';
        ctx.fillRect(
          newStartX * width + 2,
          newStartY * height + 2,
          connectedWidth - 4,
          connectedHeight - 4
        );
        // }
      }
    }
  }

  next(digSpeed: number, nodeTree: Node[]) {
    if (this.exitId === this.id) {
      return;
    }
    this.getPossibleNeighbours(nodeTree);
    if (this.neighbours.length) {
      this.addCostToNeighbours();
      this.selectNextCell();
      this.goToNextCell();
      setTimeout(() => {
        this.next(digSpeed, nodeTree);
      }, digSpeed);
    } else {
      this.backtrack(digSpeed, nodeTree);
    }
  }

  findNeighbours(id: string, nodes: Node[]) {
    nodes.forEach((node) => {
      if (node.id === id) {
        this.neighbours = node.children!.map((c) => {
          const { children, ...nodeWithoutChildern } = c;
          return nodeWithoutChildern;
        });
        return;
      } else {
        if (node.children?.length) {
          this.findNeighbours(id, node.children);
        }
      }
    });
  }

  getPossibleNeighbours(nodeTree: Node[]) {
    this.neighbours = [];
    this.findNeighbours(nodeId({ x: this.x, y: this.y }), nodeTree);
    if (this.neighbours.length) {
      this.neighbours = this.neighbours.filter(
        (n) => !this.visitedCells[n.id!]
      );
    }
    // const cellNeighbours = getCell(this.x, this.y).neighbours;

    // let possibleNeighbours = [];
    // Object.values(cellNeighbours).forEach((neighbour) => {
    //   if (neighbour) {
    //     const cell = getCell(neighbour.x, neighbour.y);
    //     if (!cell.visited) {
    //       possibleNeighbours = [...possibleNeighbours, neighbour];
    //     }
    //   }
    // });
    // if (this..length) {
    //   this.neighbours = possibleNeighbours;
    //   return true;
    // } else {
    //   return false;
    // }
  }

  addCostToNeighbours() {
    this.neighbours = this.neighbours.map((neighbour) => {
      const { x, y } = neighbour;
      const h = this.getH(x, y);
      const g = this.getG(x, y);
      const f = this.getF(g, h);
      return { ...neighbour, f, g, h };
    });
  }

  selectNextCell() {
    // if (!this.neighbours.length) {
    //   this.nextCell = undefined;
    //   return;
    // }
    if (this.neighbours.length === 1) {
      this.nextCell = this.neighbours[0];
      return;
    }
    const lowestFValue = this.neighbours
      .map((n) => n.f)
      .reduce((a, b) => (a! <= b! ? a : b));
    const selectableCells = this.neighbours.filter((n) => n.f === lowestFValue);
    if (selectableCells.length === 1) {
      this.nextCell = selectableCells[0];
    } else {
      const selectedIndex = Math.floor(Math.random() * selectableCells.length);
      this.nextCell = selectableCells[selectedIndex];
    }
  }

  goToNextCell() {
    this.currentPath = [...this.currentPath, this.nextCell];
    const { x, y, f, g, h, id } = this.nextCell;
    this.visitedCells[id!] = true;
    this.setNewPosition(x, y, f!, g!, h!, id!);
    this.nextCell = {} as AStarNode;
  }

  getG(x: number, y: number) {
    const currentG = this.g;
    const currentH = this.h;
    const neighbourH = this.getH(x, y);
    const hDiff = Math.abs(currentH - neighbourH);
    return currentG + hDiff;
  }
  getH(x: number, y: number) {
    const xLength = this.exit.x - x;
    const yLength = this.exit.y - y;
    return Math.sqrt(xLength * xLength + yLength * yLength);
  }
  getF(g: number, h: number) {
    return g + h;
  }

  backtrack(digSpeed: number, nodeTree: Node[]) {
    this.currentPath.pop();
    if (this.currentPath.length) {
      const previousCell = this.currentPath.at(-1);
      const { x, y, f, g, h, id } = previousCell!;
      this.setNewPosition(x, y, f!, g!, h!, id!);
      this.nextCell = {} as AStarNode;
      this.next(digSpeed, nodeTree);
    }
  }

  setNewPosition(
    x: number,
    y: number,
    f: number,
    g: number,
    h: number,
    id: string
  ) {
    this.x = x;
    this.y = y;
    this.f = f;
    this.g = g;
    this.h = h;
    this.id = id;
  }
}
