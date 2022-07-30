import { Cell, CellsArray, CellsDict } from "./types";

export function calculateCellPosition(
  cell: Cell | { x: number; y: number },
  cellDimensions: number
): { x: number; y: number } {
  const x = cellDimensions * cell.x;
  const y = cellDimensions * cell.y;
  return { x, y };
}

export function calculateNumberOfAliveNeighbours(
  cell: Cell,
  cellsDict: CellsDict
): number {
  const topLeft = `x${cell.x - 1}y${cell.y - 1}`;
  const topRight = `x${cell.x + 1}y${cell.y - 1}`;
  const bottomRight = `x${cell.x + 1}y${cell.y + 1}`;
  const bottomLeft = `x${cell.x - 1}y${cell.y + 1}`;
  const top = `x${cell.x}y${cell.y - 1}`;
  const bottom = `x${cell.x}y${cell.y + 1}`;
  const right = `x${cell.x + 1}y${cell.y}`;
  const left = `x${cell.x - 1}y${cell.y}`;

  let aliveNeighbours = 0;

  const neighbours = [
    topLeft,
    topRight,
    bottomRight,
    bottomLeft,
    top,
    bottom,
    right,
    left,
  ];

  neighbours.forEach((n) => {
    if (cellsDict[n]?.alive) {
      aliveNeighbours++;
    }
  });

  return aliveNeighbours;
}

export function createCellsArray(
  rows: number,
  cols: number,
  populationRatio: number
): CellsArray {
  let xLimit = cols;
  let x = 0;
  let y = 0;

  const cellsArray = Array(rows * cols)
    .fill({})
    .map((el, idx) => {
      const arrayIdx = idx;
      const position = `x${x}y${y}`;
      const alive = Math.random() < populationRatio;
      const cell = { x, y, position, alive, arrayIdx };
      x++;
      if (x === xLimit) {
        x = 0;
        y++;
      }
      return cell;
    });

  return cellsArray;
}

export function createCellsDict(cellsArray: CellsArray): CellsDict {
  const cellsDict: CellsDict = {};
  cellsArray.forEach((c) => {
    cellsDict[c["position"]] = c;
  });

  return cellsDict;
}

export function updateCellsState(
  cellsArray: CellsArray,
  cellsDict: CellsDict
): { updatedCellsArray: CellsArray; updatedCellsDict: CellsDict } {
  const currentCellsDict: CellsDict = JSON.parse(JSON.stringify(cellsDict));
  const currentCellsArray: CellsArray = JSON.parse(JSON.stringify(cellsArray));

  const updatedCellsDict: CellsDict = {};
  const updatedCellsArray = currentCellsArray.map((cell) => {
    const numberOfAliveNeighbours = calculateNumberOfAliveNeighbours(
      cell,
      currentCellsDict
    );
    let cellAlive = false;

    if (
      cell.alive &&
      (numberOfAliveNeighbours === 2 || numberOfAliveNeighbours === 3)
    ) {
      cellAlive = true;
    } else if (!cell.alive && numberOfAliveNeighbours === 3) {
      cellAlive = true;
    }

    updatedCellsDict[cell.position] = { ...cell, alive: cellAlive };
    return { ...cell, alive: cellAlive };
  });

  return { updatedCellsArray, updatedCellsDict };
}
