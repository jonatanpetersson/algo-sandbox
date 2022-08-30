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
import {
  CellsArray,
  CellsDict,
  Config,
  ConfigSelected,
  GameMode,
} from './types';
import { useEffect } from 'react';
import './game-of-life.scss';
import {
  getClickedCellPosition,
  setSquareCanvas,
} from '../../../shared/functions';
import { UtilizeState } from '../../../shared/state';

export function GameOfLife() {
  const { state, updateState } = UtilizeState();

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
      this.canvas.addEventListener('click', this.placeConfig.bind(this));
    }

    loadConfig(config: ConfigSelected) {
      switch (config) {
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
      const { x, y } = getClickedCellPosition(this.canvas!, event);
      const configsCenterX = Math.floor(this.config[0].length / 2);
      const configsCenterY = Math.floor(this.config.length / 2);
      const initialCellsX =
        Math.floor(x / this.cellDimensions!) - configsCenterX;
      const initialCellsY =
        Math.floor(y / this.cellDimensions!) - configsCenterY;

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

    runGame() {
      this.gameInterval = setInterval(() => {
        const { updatedCellsDict, updatedCellsArray } = updateCellsState(
          this.cellsArray!,
          this.cellsDict!
        );
        this.cellsArray = updatedCellsArray;
        this.cellsDict = updatedCellsDict;
      }, this.tickSpeed);
    }

    stopGame() {
      clearInterval(this.gameInterval);
    }

    resetGame() {
      clearInterval(this.gameInterval);
      this.clearCanvas();
      this.cols = this.gridSize;
      this.rows = this.gridSize;
      this.cellDimensions = this.canvas!.width / this.cols;
      this.cellsArray = createCellsArray(
        this.rows,
        this.cols,
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
    state?.game.clearCanvas();
    state?.game.drawCells(state.game.cellsArray!);
    requestAnimationFrame(animate);
  }

  useEffect(() => {
    if (!state?.game) {
      const game = new GameOfLife();
      game.setupUI();
      updateState({
        ...state,
        game,
        gridSize: 50,
        tickSpeed: 150,
        populationRatio: 0.1,
        gameMode: GameMode.Reset,
      });
    }

    if (state?.tickSpeed) state.game.tickSpeed = Number(state.tickSpeed);
    if (state?.gridSize) state.game.gridSize = Number(state.gridSize);
    if (state?.populationRatio)
      state.game.populationRatio = Number(state.populationRatio);
    if (state?.config) state.game.loadConfig(state.config);

    if (state?.gameMode === GameMode.Play) state.game.runGame();
    if (state?.gameMode === GameMode.Stop) state.game.stopGame();
    if (state?.gameMode === GameMode.Reset) state.game.resetGame();

    if (state?.game?.cellsArray) animate();
  }, [state]);

  return (
    <>
      <canvas className="game-of-life-canvas"></canvas>
    </>
  );
}
