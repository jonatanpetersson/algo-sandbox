import { Cell, CellsArray, CellsDict } from "./types.js";

const rows: number = 150;
const cols: number = 150;
const { canvas, ctx } = initializeCanvas(900, 900);
const cellDimensions: number = canvas.width / cols;

let cellsArray: CellsArray;
let cellsDict: CellsDict;
let gameInterval: number;
let gameOn: boolean = false;
let tickSpeed: number = 150;
let populationRatio: number = 0.1;
let toggleButton: HTMLButtonElement;
let resetButton: HTMLButtonElement;
let settingsForm: HTMLFormElement;
let tickSpeedInput: HTMLInputElement;
let populationRatioInput: HTMLInputElement;

setupGame();

function setupGame() {
  clearCanvas();
  cellsArray = createCellsArray(rows, cols);
  cellsDict = createCellsDict(cellsArray);
  drawCells(cellsArray);
  toggleButton = document.querySelector(".toggle-game")!;
  resetButton = document.querySelector(".reset-game")!;
  settingsForm = document.querySelector(".form")!;
  tickSpeedInput = document.querySelector("#tick-speed")!;
  populationRatioInput = document.querySelector("#population-ratio")!;

  tickSpeedInput.value = tickSpeed + "";
  populationRatioInput.value = populationRatio + "";

  settingsForm.addEventListener("submit", submitSettings);
  toggleButton.addEventListener("click", toggleGame);
  resetButton.addEventListener("click", resetGame);
}

function submitSettings(ev: SubmitEvent) {
  ev.preventDefault();
  tickSpeed = Number(tickSpeedInput.value);
  populationRatio = Number(populationRatioInput.value);
  resetGame();
}

function initializeCanvas(
  width: number,
  height: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  canvas.classList.add("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  document.body.append(canvas);
  return { canvas, ctx };
}

function toggleGame() {
  gameOn = !gameOn;

  if (gameOn) {
    runGame();
    toggleButton.textContent = "Paus game";
  } else {
    stopGame();
    toggleButton.textContent = "Start game";
  }
}

function runGame() {
  gameInterval = setInterval(() => {
    const { updatedCellsDict, updatedCellsArray } = updateCellsState(
      cellsArray,
      cellsDict
    );
    cellsArray = updatedCellsArray;
    cellsDict = updatedCellsDict;
    clearCanvas();
    drawCells(cellsArray);
  }, tickSpeed);
}

function stopGame() {
  clearInterval(gameInterval);
}

function resetGame() {
  gameOn = false;
  clearInterval(gameInterval);
  toggleButton.textContent = "Start game";
  setupGame();
}

function calculateCellPosition(cell: Cell): { x: number; y: number } {
  const x = cellDimensions * cell.x;
  const y = cellDimensions * cell.y;
  return { x, y };
}

function drawCells(cellsArray: CellsArray) {
  cellsArray.forEach((cell) => {
    if (cell.alive) {
      const { x, y } = calculateCellPosition(cell);
      ctx.fillStyle = "black";
      ctx.fillRect(x, y, cellDimensions, cellDimensions);
    }
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateCellsState(
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

function calculateNumberOfAliveNeighbours(
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

function createCellsArray(rows: number, cols: number): CellsArray {
  let xLimit = cols;
  let x = 0;
  let y = 0;

  const cellsArray = Array(rows * cols)
    .fill({})
    .map((el) => {
      const position = `x${x}y${y}`;
      const alive = Math.random() < populationRatio;
      const cell: Cell = { x, y, position, alive };
      x++;
      if (x === xLimit) {
        x = 0;
        y++;
      }
      return cell;
    });

  return cellsArray;
}

function createCellsDict(cellsArray: CellsArray): CellsDict {
  const cellsDict: CellsDict = {};
  cellsArray.forEach((c) => {
    cellsDict[c["position"]] = c;
  });

  return cellsDict;
}
