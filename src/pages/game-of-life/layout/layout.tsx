import * as React from 'react';
import './layout.scss';

import {
  calculateCellPosition,
  createCellsArray,
  createCellsDict,
  updateCellsState,
} from '../functions';
import {
  AchimsP144,
  AchimsP16,
  Glider,
  MaxSpaceFiller189,
  Weekender,
} from '../configs';
import { CellsArray, CellsDict, Config, ConfigSelected } from '../types';
import Canvas from '../canvas/canvas';

let canvas: HTMLCanvasElement;
let canvasSize: number;
let config: Config | undefined;
let ctx: CanvasRenderingContext2D;
let cellSize: number;
let cellsArray: CellsArray;
let cellsDict: CellsDict;
let gameInterval: NodeJS.Timer;
let gameOn: boolean = false;
let tickSpeed: number = 150;
let gridSize: number = 150;
let populationRatio: number = 0.1;
let toggleButton: HTMLButtonElement;
let resetButton: HTMLButtonElement;
let configSelect: HTMLInputElement;
let settingsForm: HTMLFormElement;
let tickSpeedInput: HTMLInputElement;
let populationRatioInput: HTMLInputElement;
let gridSizeInput: HTMLInputElement;

function resizeCanvas() {
  const windowSize =
    window.innerWidth < window.innerHeight
      ? window.innerWidth
      : window.innerHeight;
  cellSize = Math.floor(windowSize / gridSize);
  canvasSize = cellSize * gridSize;
  canvas.width = canvasSize;
  canvas.height = canvasSize;
}

function reSizeAndDraw() {
  resizeCanvas();
  drawCells();
}

function setupUI() {
  cellsArray = createCellsArray(gridSize, populationRatio);
  cellsDict = createCellsDict(cellsArray);

  selectElements();
  addEventListeners();
  resizeCanvas();
  drawCells();

  tickSpeedInput.value = tickSpeed + '';
  populationRatioInput.value = populationRatio + '';
  gridSizeInput.value = gridSize + '';
}

function selectElements() {
  canvas = document.querySelector('.canvas')!;
  ctx = canvas.getContext('2d')!;
  configSelect = document.querySelector('#config-select')!;
  gridSizeInput = document.querySelector('#grid-size')!;
  populationRatioInput = document.querySelector('#population-ratio')!;
  resetButton = document.querySelector('.reset-button')!;
  settingsForm = document.querySelector('.form')!;
  tickSpeedInput = document.querySelector('#tick-speed')!;
  toggleButton = document.querySelector('.toggle-button')!;
}

function addEventListeners() {
  settingsForm.addEventListener('submit', setNewSettings);
  configSelect.addEventListener('click', loadConfig);
  toggleButton.addEventListener('click', toggleGame);
  resetButton.addEventListener('click', resetGame);
  canvas.addEventListener('click', placeConfig);
  window.addEventListener('resize', reSizeAndDraw);
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
  const initialCellsX = Math.floor(x / cellSize);
  const initialCellsY = Math.floor(y / cellSize);

  config.forEach((row, rowY) => {
    row.forEach((cell, colX) => {
      const cellsX = initialCellsX + colX;
      const cellsY = initialCellsY + rowY;
      const cellsPixelX = cellsX * cellSize;
      const cellsPixelY = cellsY * cellSize;
      if (!!cell) {
        ctx.fillStyle = 'black';
        ctx.fillRect(cellsPixelX, cellsPixelY, cellSize, cellSize);
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
    resizeCanvas();
  }
  resetGame();
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
    drawCells();
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
  cellsArray = createCellsArray(gridSize, populationRatio);
  cellsDict = createCellsDict(cellsArray);
  drawCells();
}

function drawCells() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  cellsArray.forEach((cell) => {
    if (cell.alive) {
      const { x, y } = calculateCellPosition(cell, cellSize);
      ctx.fillStyle = 'black';
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  });
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export interface IAppProps {}

export function Layout(props: IAppProps) {
  React.useEffect(() => {
    setupUI();
  }, []);

  return (
    <main className="main">
      <Canvas />
      {/* <canvas className="canvas"></canvas> */}
      <section className="settings">
        <h1 className="settings-header">Conway's Game of Life</h1>
        {/* <p>
          Visualisation of{' '}
          <a
            href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life"
            target="_blank"
          >
            Conway's Game of Life
          </a>
          . It is a zero-player game, meaning that its evolution is determined
          by its initial state, which currently is set at random for each cell.
          There are a few settings below to tinker with.
        </p> */}
        <button className="toggle-button">Play game</button>
        <button className="reset-button">Reset game</button>
        <h3>Settings</h3>
        <form action="submit" className="form">
          <label htmlFor="grid-size">Grid size (for rows and columns)</label>
          <input type="number" name="grid-size" id="grid-size" step="5" />
          <label htmlFor="tick-speed">Tick speed (ms)</label>
          <input type="number" name="tick-speed" id="tick-speed" step="10" />
          <label htmlFor="population-ratio">
            Initial population ratio (0-1)
          </label>
          <input
            type="number"
            max="1"
            min="0"
            step=".05"
            name="population-ratio"
            id="population-ratio"
          />
          <input
            className="submit-button"
            type="submit"
            value="Save settings"
          />
        </form>
        <label className="config-select-label" htmlFor="config-select">
          Select and place a config on the canvas
        </label>
        <select
          className="config-select"
          name="config-select"
          id="config-select"
        >
          <option value="" disabled selected hidden>
            Select configuration
          </option>
          <option value="glider">Glider</option>
          <option value="achims-p16">Archims P16</option>
          <option value="achims-p144">Archims P144</option>
          <option value="weekender">Weekender</option>
          <option value="max-spacefiller-189">Max SpaceFiller 189</option>
        </select>
      </section>
    </main>
  );
}
