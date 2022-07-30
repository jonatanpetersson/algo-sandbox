import * as React from 'react';
import './layout.scss';

import {
  calculateCellPosition,
  createCellsArray,
  createCellsDict,
  updateCellsState,
} from '../functions';
import { AchimsP144, AchimsP16, Glider, Weekender } from '../configs';
import { CellsArray, CellsDict, Config, ConfigSelected } from '../types';

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
  const canvas: HTMLCanvasElement = document.querySelector('.canvas')!;
  canvas.width = width;
  canvas.height = height;
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

export interface IAppProps {}

export default function App(props: IAppProps) {
  React.useEffect(() => {
    setupUI();
  }, []);

  return (
    <>
      <section className="settings">
        <h1 className="header">Conway's Game of Life</h1>
        <p>
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
        </p>
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
        </select>
      </section>
      <canvas className="canvas"></canvas>
    </>
  );
}
