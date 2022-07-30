import {
  calculateCellPosition,
  createCellsArray,
  createCellsDict,
  updateCellsState,
} from './game-functions';
import {
  AchimsP144,
  AchimsP16,
  Glider,
  MaxSpaceFiller189,
  Weekender,
} from './configs';
import { CellsArray, CellsDict, Config, ConfigSelected } from './types';

let rows: number;
let cols: number;
let canvas: HTMLCanvasElement;
let config: Config | undefined;
let ctx: CanvasRenderingContext2D;
let cellDimensions: number;
let cellsArray: CellsArray;
let cellsDict: CellsDict;
let gameInterval: NodeJS.Timer;
let gameOn: boolean = false;
let tickSpeed: number = 150;
let gridSize: number = 150;
let populationRatio: number = 0;
let toggleButton: HTMLButtonElement;
let resetButton: HTMLButtonElement;
let configSelect: HTMLInputElement;
let settingsForm: HTMLFormElement;
let tickSpeedInput: HTMLInputElement;
let populationRatioInput: HTMLInputElement;
let gridSizeInput: HTMLInputElement;

setupUI();

function setupUI() {
  rows = gridSize;
  cols = gridSize;
  canvas = initializeCanvas(900, 900);
  ctx = canvas.getContext('2d')!;
  cellDimensions = canvas.width / cols;
  cellsArray = createCellsArray(rows, cols, populationRatio);
  cellsDict = createCellsDict(cellsArray);
  drawCells(cellsArray);

  selectElements();
  addEventListeners();

  tickSpeedInput.value = tickSpeed + '';
  populationRatioInput.value = populationRatio + '';
  gridSizeInput.value = gridSize + '';
}

function selectElements() {
  toggleButton = document.querySelector('.toggle-button')!;
  resetButton = document.querySelector('.reset-button')!;
  configSelect = document.querySelector('#config-select')!;
  settingsForm = document.querySelector('.form')!;
  tickSpeedInput = document.querySelector('#tick-speed')!;
  populationRatioInput = document.querySelector('#population-ratio')!;
  gridSizeInput = document.querySelector('#grid-size')!;
}

function addEventListeners() {
  settingsForm.addEventListener('submit', setNewSettings);
  configSelect.addEventListener('click', loadConfig);
  toggleButton.addEventListener('click', toggleGame);
  resetButton.addEventListener('click', resetGame);
  canvas.addEventListener('click', placeConfig);
}

function loadConfig() {
  switch (configSelect.value) {
    case ConfigSelected.Glider:
      config = Glider;
      break;
    case ConfigSelected.AchimsP16:
      config = AchimsP16;
      break;
    case ConfigSelected.AchimsP144:
      config = AchimsP144;
      break;
    case ConfigSelected.Weekender:
      config = Weekender;
      break;
    case ConfigSelected.MaxSpaceFiller189:
      config = MaxSpaceFiller189;
      break;
    default:
      config = undefined;
  }
  document.body.style.cursor = config ? 'crosshair' : 'auto';
}

function placeConfig(event: MouseEvent) {
  if (!config) {
    return;
  }
  const { x, y } = getClickedCellPosition(canvas, event);
  const initialCellsX = Math.floor(x / cellDimensions);
  const initialCellsY = Math.floor(y / cellDimensions);

  config.forEach((row, rowY) => {
    row.forEach((cell, colX) => {
      const cellsX = initialCellsX + colX;
      const cellsY = initialCellsY + rowY;
      const cellsPixelX = cellsX * cellDimensions;
      const cellsPixelY = cellsY * cellDimensions;
      if (!!cell) {
        ctx.fillStyle = 'black';
        ctx.fillRect(cellsPixelX, cellsPixelY, cellDimensions, cellDimensions);
        const cellInDict = cellsDict[`x${cellsX}y${cellsY}`];
        if (cellInDict) {
          cellInDict.alive = !!cell;
          cellsArray[cellInDict.arrayIdx].alive = !!cell;
        }
      }
    });
  });
}

function getClickedCellPosition(canvas: HTMLCanvasElement, event: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(event.clientX - rect.left);
  const y = Math.floor(event.clientY - rect.top);
  return { x, y };
}

function setNewSettings(ev: SubmitEvent) {
  ev.preventDefault();
  tickSpeed = Number(tickSpeedInput.value);
  populationRatio = Number(populationRatioInput.value);
  if (gridSize !== Number(gridSizeInput.value)) {
    gridSize = Number(gridSizeInput.value);
    cols = gridSize;
    rows = gridSize;
    cellDimensions = canvas.width / cols;
  }
  resetGame();
}

function initializeCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.classList.add('canvas');
  canvas.width = width;
  canvas.height = height;
  document.body.append(canvas);
  return canvas;
}

function toggleGame() {
  gameOn = !gameOn;

  if (gameOn) {
    runGame();
    toggleButton.textContent = 'Paus game';
  } else {
    stopGame();
    toggleButton.textContent = 'Start game';
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
  toggleButton.textContent = 'Start game';
  clearCanvas();
  cellsArray = createCellsArray(rows, cols, populationRatio);
  cellsDict = createCellsDict(cellsArray);
  drawCells(cellsArray);
}

function drawCells(cellsArray: CellsArray) {
  cellsArray.forEach((cell) => {
    if (cell.alive) {
      const { x, y } = calculateCellPosition(cell, cellDimensions);
      ctx.fillStyle = 'black';
      ctx.fillRect(x, y, cellDimensions, cellDimensions);
    }
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
