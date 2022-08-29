import {
  calculateCellPosition,
  createCellsArray,
  createCellsDict,
  updateCellsState,
} from './functions';
import {
  AchimsP144,
  AchimsP16,
  Glider,
  MaxSpaceFiller189,
  Weekender,
} from './configs';
import { CellsArray, CellsDict, Config, ConfigSelected } from './types';
import { useEffect } from 'react';
import './game-of-life.scss';
import {
  getClickedCellPosition,
  setSquareCanvas,
} from '../../../shared/functions';
import { UtilizeState } from '../../../shared/state';

export function GameOfLife() {
  const [state, updateState] = UtilizeState();
  let game: GameOfLife;

  class GameOfLife {
    rows?: number;
    cols?: number;
    canvas?: HTMLCanvasElement;
    config?: Config | undefined;
    ctx?: CanvasRenderingContext2D;
    cellDimensions?: number;
    cellsArray?: CellsArray;
    cellsDict?: CellsDict;
    gameInterval?: NodeJS.Timer;
    initialized: boolean = false;
    tickSpeed: number = 150;
    gridSize: number = 150;
    populationRatio: number = 0.15;

    setupUI() {
      this.rows = this.gridSize;
      this.cols = this.gridSize;

      this.canvas = document.querySelector('.game-of-life-canvas')!;
      this.ctx = this.canvas.getContext('2d')!;
      setSquareCanvas(this.canvas);
      window.addEventListener('resize', () => {
        setSquareCanvas(this.canvas!);
        this.cellDimensions = this.canvas!.width / this.cols!;
      });

      this.cellDimensions = this.canvas.width / this.cols;
      this.cellsArray = createCellsArray(
        this.rows,
        this.cols,
        this.populationRatio
      );
      this.cellsDict = createCellsDict(this.cellsArray);
      // drawCells(cellsArray);

      // initialized = true;

      // selectElements();
      // addEventListeners();

      // tickSpeedInput.value = tickSpeed + '';
      // populationRatioInput.value = populationRatio + '';
      // gridSizeInput.value = gridSize + '';
    }

    // function selectElements() {
    //   toggleButton = document.querySelector('.toggle-button')!;
    //   resetButton = document.querySelector('.reset-button')!;
    //   configSelect = document.querySelector('#config-select')!;
    //   settingsForm = document.querySelector('.form')!;
    //   tickSpeedInput = document.querySelector('#tick-speed')!;
    //   populationRatioInput = document.querySelector('#population-ratio')!;
    //   gridSizeInput = document.querySelector('#grid-size')!;
    // }

    // function addEventListeners() {
    //   settingsForm.addEventListener('submit', setNewSettings);
    //   configSelect.addEventListener('click', loadConfig);
    //   resetButton.addEventListener('click', resetGame);
    //   canvas.addEventListener('click', placeConfig);
    // }

    loadConfig() {
      switch (state.configSelect.value) {
        case ConfigSelected.Glider:
          this.config = Glider;
          break;
        case ConfigSelected.AchimsP16:
          this.config = AchimsP16;
          break;
        case ConfigSelected.AchimsP144:
          this.config = AchimsP144;
          break;
        case ConfigSelected.Weekender:
          this.config = Weekender;
          break;
        case ConfigSelected.MaxSpaceFiller189:
          this.config = MaxSpaceFiller189;
          break;
        default:
          this.config = undefined;
      }
      document.body.style.cursor = this.config ? 'crosshair' : 'auto';
    }

    placeConfig(event: MouseEvent) {
      if (!this.config) {
        return;
      }
      const { x, y } = this.getClickedCellPosition(this.canvas!, event);
      const initialCellsX = Math.floor(x / this.cellDimensions!);
      const initialCellsY = Math.floor(y / this.cellDimensions!);

      this.config.forEach((row, rowY) => {
        row.forEach((cell, colX) => {
          const cellsX = initialCellsX + colX;
          const cellsY = initialCellsY + rowY;
          const cellsPixelX = cellsX * this.cellDimensions!;
          const cellsPixelY = cellsY * this.cellDimensions!;
          if (!!cell) {
            this.ctx!.fillStyle = '#001219';
            this.ctx!.fillRect(
              cellsPixelX,
              cellsPixelY,
              this.cellDimensions!,
              this.cellDimensions!
            );
            const cellInDict = this.cellsDict![`x${cellsX}y${cellsY}`];
            if (cellInDict) {
              cellInDict.alive = !!cell;
              this.cellsArray![cellInDict.arrayIdx].alive = !!cell;
            }
          }
        });
      });
    }

    getClickedCellPosition(canvas: HTMLCanvasElement, event: MouseEvent) {
      return getClickedCellPosition(canvas, event);
    }

    // setNewSettings(ev: SubmitEvent) {
    //   ev.preventDefault();
    //   tickSpeed = Number(tickSpeedInput.value);
    //   populationRatio = Number(populationRatioInput.value);
    //   if (gridSize !== Number(gridSizeInput.value)) {
    //     gridSize = Number(gridSizeInput.value);
    //     cols = gridSize;
    //     rows = gridSize;
    //     cellDimensions = canvas.width / cols;
    //   }
    //   resetGame();
    // }

    // function toggleGame() {
    //   if (state.) {
    //     runGame();
    //   } else {
    //     stopGame();
    //   }
    // }

    runGame() {
      this.gameInterval = setInterval(() => {
        const { updatedCellsDict, updatedCellsArray } = updateCellsState(
          this.cellsArray!,
          this.cellsDict!
        );
        this.cellsArray = updatedCellsArray;
        this.cellsDict = updatedCellsDict;
        // this.clearCanvas();
        // this.drawCells(this.cellsArray);
      }, this.tickSpeed);
    }

    stopGame() {
      clearInterval(this.gameInterval);
    }

    resetGame() {
      clearInterval(this.gameInterval);
      this.clearCanvas();
      this.cellsArray = createCellsArray(
        this.rows!,
        this.cols!,
        this.populationRatio
      );
      this.cellsDict = createCellsDict(this.cellsArray);
      this.drawCells(this.cellsArray);
    }

    drawCells(cellsArray: CellsArray) {
      cellsArray.forEach((cell) => {
        if (cell.alive) {
          const { x, y } = calculateCellPosition(cell, this.cellDimensions!);
          this.ctx!.fillStyle = '#001219';
          this.ctx!.fillRect(x, y, this.cellDimensions!, this.cellDimensions!);
        }
      });
    }

    clearCanvas() {
      this.ctx!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
      this.ctx!.fillStyle = '#e9d8a6';
      this.ctx!.fillRect(0, 0, this.canvas!.width, this.canvas!.height);
    }
  }

  function animate() {
    state.game.clearCanvas();
    state.game.drawCells(state.game.cellsArray!);
    requestAnimationFrame(animate);
  }

  useEffect(() => {
    if (!state.game) {
      const game = new GameOfLife();
      game.setupUI();
      updateState({ ...state, game });
    }
    if (state.play === true) state.game.runGame();
    if (state.play === false) state.game.stopGame();
    if (state.reset === true) state.game.resetGame();

    if (state.game?.cellsArray) animate();
  }, [state]);

  return (
    <>
      <canvas className="game-of-life-canvas"></canvas>
    </>
  );
}
